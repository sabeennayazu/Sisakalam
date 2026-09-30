"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, ThumbsUp, MessageCircle, MoreHorizontal, Pin } from "lucide-react";
import { createComment, deleteComment, getComments, toggleLike } from "@/utils/interactions.api";
import { isAuthenticated } from "@/utils/auth";
import { ApiError } from "@/utils/client";

interface CommentRecord {
  id: number;
  user: number;
  author_name: string;
  body: string;
  created_at: string;
  is_owner: boolean;
  rating: number | null;
  like_count: number;
  is_liked: boolean;
  parent?: number | null;
}

type CommentSort = "most_liked" | "newest";

export default function ContentComments({
  type,
  contentId,
  chapterNumber,
  chapterTitle,
}: {
  type: "story" | "poem" | "chapter";
  contentId: number;
  chapterNumber?: number;
  chapterTitle?: string;
}) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const [sort, setSort] = useState<CommentSort>("most_liked");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [likingCommentIds, setLikingCommentIds] = useState<Set<number>>(() => new Set());

  const rootComments = useMemo(() => comments.filter((comment) => !comment.parent), [comments]);

  const selectSort = (nextSort: CommentSort) => {
    setSort(nextSort);
    setComments((current) => [...current].sort((left, right) => {
      const newestFirst = Date.parse(right.created_at) - Date.parse(left.created_at);
      return nextSort === "newest" ? newestFirst : right.like_count - left.like_count || newestFirst;
    }));
  };

  useEffect(() => {
    const syncAuthState = () => setSignedIn(isAuthenticated());
    syncAuthState();
    window.addEventListener("authChange", syncAuthState);
    return () => window.removeEventListener("authChange", syncAuthState);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let cancelled = false;
    void getComments(type, contentId, sort)
      .then((result) => {
        if (!cancelled) setComments((result as CommentRecord[]).map((item) => ({ ...item, parent: item.parent ?? null })));
      })
      .catch(() => {
        if (!cancelled) setError(`Unable to load ${type === "chapter" ? "comments" : "reviews"} right now. Please try again.`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [type, contentId, sort]);

  const refreshComments = async () => {
    const nextComments = await getComments(type, contentId, sort) as CommentRecord[];
    setComments(nextComments.map((item) => ({ ...item, parent: item.parent ?? null })));
  };

  const submit = async () => {
    if (submitting) return;
    if (type !== "chapter" && !rating) {
      setError("Please select a star rating.");
      setSuccess(null);
      return;
    }
    if (!body.trim()) {
      setError(`Please enter your ${type === "chapter" ? "comment" : "review"}.`);
      setSuccess(null);
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createComment({ [type]: contentId, body: body.trim(), ...(type === "chapter" ? {} : { rating }) }) as CommentRecord;
      setBody("");
      setRating(0);
      setComments((current) => [...current, { ...created, parent: created.parent ?? null }]);
      setSuccess(`Your ${type === "chapter" ? "comment" : "review"} has been posted.`);
      try {
        await refreshComments();
      } catch {
        setError("Posted successfully, but the comment list could not refresh. Please retry.");
      }
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 401) {
        setSignedIn(false);
        setError(`Your session expired. Please sign in again to post a ${type === "chapter" ? "comment" : "review"}.`);
      } else if (submitError instanceof ApiError && submitError.status >= 500) {
        setError(`Unable to post your ${type === "chapter" ? "comment" : "review"} right now. Please try again.`);
      } else if (submitError instanceof ApiError && submitError.status === 0) {
        setError("Unable to connect. Check your connection and try again.");
      } else {
        setError(submitError instanceof Error ? submitError.message : `Unable to post your ${type === "chapter" ? "comment" : "review"}.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (parentId: number) => {
    const replyText = (replyDrafts[parentId] ?? "").trim();
    if (!replyText) {
      setError("Please enter a reply.");
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createComment({ [type]: contentId, body: replyText, parent: parentId }) as CommentRecord;
      setReplyingTo(null);
      setReplyDrafts((current) => ({ ...current, [parentId]: "" }));
      setComments((current) => [...current, { ...created, parent: created.parent ?? parentId }]);
      setSuccess("Your reply has been posted.");
      try {
        await refreshComments();
      } catch {
        setError("Reply posted successfully, but the comment list could not refresh. Please retry.");
      }
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 401) {
        setSignedIn(false);
        setError("Your session expired. Please sign in again to reply.");
      } else if (submitError instanceof ApiError && submitError.status >= 500) {
        setError("Unable to post your reply right now. Please try again.");
      } else {
        setError(submitError instanceof Error ? submitError.message : "Unable to post your reply.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCommentLike = async (comment: CommentRecord) => {
    if (likingCommentIds.has(comment.id)) return;
    if (!signedIn) {
      setError("Please log in to like this comment.");
      return;
    }

    const wasLiked = comment.is_liked;
    const previousCount = comment.like_count;
    const optimisticLiked = !wasLiked;
    const optimisticCount = Math.max(0, previousCount + (optimisticLiked ? 1 : -1));
    setLikingCommentIds((current) => new Set(current).add(comment.id));
    setComments((current) => current.map((item) => item.id === comment.id
      ? { ...item, is_liked: optimisticLiked, like_count: optimisticCount }
      : item));
    setError(null);

    try {
      const result = await toggleLike("comment", comment.id);
      setComments((current) => {
        const updated = current.map((item) => item.id === comment.id
          ? { ...item, is_liked: result.is_liked, like_count: result.like_count }
          : item);
        return sort === "newest"
          ? updated.sort((left, right) => Date.parse(right.created_at) - Date.parse(left.created_at))
          : updated.sort((left, right) => right.like_count - left.like_count || Date.parse(right.created_at) - Date.parse(left.created_at));
      });
    } catch (likeError) {
      setComments((current) => current.map((item) => item.id === comment.id
        ? { ...item, is_liked: wasLiked, like_count: previousCount }
        : item));
      if (likeError instanceof ApiError && likeError.status === 401) {
        setSignedIn(false);
        setError("Please log in to like this comment.");
      } else {
        setError("Unable to update like. Please try again.");
      }
    } finally {
      setLikingCommentIds((current) => {
        const next = new Set(current);
        next.delete(comment.id);
        return next;
      });
    }
  };

  const sectionTitle = type === "chapter" ? `Comments${chapterNumber ? ` — Chapter ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ""}` : ""}` : "Reviews";

  return <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
    <div className="mb-6 border-b border-gray-200 pb-5">
      <h2 className="text-xl font-bold text-gray-950">{type === "chapter" ? "Leave a Comment" : "Leave a Review"}</h2>
      {type === "chapter" && <p className="mt-1 text-sm text-gray-600">{sectionTitle}</p>}
      {type !== "chapter" && <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span>Your Rating:</span>
        <div className="flex" aria-label="Choose a rating">
          {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} star${value === 1 ? "" : "s"}`} aria-pressed={value === rating} onClick={() => { setRating(value); setError(null); }} disabled={!signedIn || submitting} className="p-0.5 text-gray-950 disabled:cursor-not-allowed disabled:opacity-60"><Star size={18} fill={value <= rating ? "currentColor" : "none"} /></button>)}
        </div>
      </div>}
      <textarea value={body} onChange={(event) => { setBody(event.target.value); setError(null); }} rows={4} placeholder={signedIn ? `Share your thoughts on this ${type === "chapter" ? "chapter" : "work"}` : "Sign in to share your thoughts"} disabled={!signedIn || submitting} className="mt-4 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 disabled:bg-gray-50" />
      <div className="mt-3 flex items-center justify-between gap-3">
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : success ? <p role="status" className="text-sm text-emerald-700">{success}</p> : <span />}
        <button type="button" onClick={() => void submit()} disabled={!signedIn || submitting || !body.trim() || (type !== "chapter" && !rating)} className="rounded-lg bg-gray-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300">{submitting ? "Submitting..." : `Post ${type === "chapter" ? "Comment" : "Review"}`}</button>
      </div>
    </div>
    <div className="flex items-center gap-6 border-b border-gray-200 pb-3 text-[11px] font-bold uppercase tracking-wide text-gray-500"><button type="button" aria-pressed={sort === "most_liked"} onClick={() => selectSort("most_liked")} className={`pb-3 ${sort === "most_liked" ? "border-b-2 border-gray-950 text-gray-950" : "text-gray-500"}`}>Most Liked</button><button type="button" aria-pressed={sort === "newest"} onClick={() => selectSort("newest")} className={`pb-3 ${sort === "newest" ? "border-b-2 border-gray-950 text-gray-950" : "text-gray-500"}`}>Newest</button><span className="ml-auto normal-case font-normal tracking-normal">{comments.length} {type === "chapter" ? "comment" : "review"}{comments.length === 1 ? "" : "s"}</span></div>
    <div className="divide-y divide-gray-200">
      {loading && comments.length === 0 ? <p className="py-8 text-sm text-gray-500">Loading {type === "chapter" ? "comments" : "reviews"}...</p> : error && comments.length === 0 ? <div className="py-8 text-center text-sm text-red-600"><p>{error}</p><button type="button" onClick={() => { setError(null); setLoading(true); void getComments(type, contentId, sort).then((result) => setComments((result as CommentRecord[]).map((item) => ({ ...item, parent: item.parent ?? null })))).catch(() => setError(`Unable to load ${type === "chapter" ? "comments" : "reviews"} right now. Please try again.`)).finally(() => setLoading(false)); }} className="mt-2 underline">Retry</button></div> : comments.length === 0 ? <p className="py-8 text-sm text-gray-500">No {type === "chapter" ? "comments" : "reviews"} yet. Be the first to share your thoughts.</p> : rootComments.map((comment) => {
        const nestedReplies = comments.filter((item) => item.parent === comment.id);

        return <article key={comment.id} className="relative py-5">
          <Pin size={14} className="absolute right-0 top-6 text-gray-400" />
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">{comment.author_name.slice(0, 1).toUpperCase()}</div>
            <div>
              <p className="text-sm font-semibold text-gray-950">{comment.author_name}</p>
              <p className="text-[11px] text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          {type !== "chapter" && <div className="mt-1 flex text-gray-950">{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={12} fill={comment.rating && value <= comment.rating ? "currentColor" : "none"} />)}</div>}
          <p className="mt-3 pr-4 text-xs leading-5 text-gray-700">{comment.body}</p>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500">
            <button type="button" onClick={() => void toggleCommentLike(comment)} disabled={likingCommentIds.has(comment.id)} aria-pressed={comment.is_liked} className={`inline-flex items-center gap-1 disabled:opacity-60 ${comment.is_liked ? "text-blue-700" : ""}`}><ThumbsUp size={12} fill={comment.is_liked ? "currentColor" : "none"} /> {comment.like_count}</button>
            <button type="button" onClick={() => { setReplyingTo(comment.id); setError(null); }} className="inline-flex items-center gap-1"><MessageCircle size={12} /> Reply</button>
            <button type="button" aria-label="More actions"><MoreHorizontal size={14} /></button>
            {comment.is_owner && <button type="button" onClick={() => void deleteComment(comment.id).then(() => setComments((current) => current.filter((item) => item.id !== comment.id)))} className="text-gray-500 hover:text-red-600">Delete</button>}
          </div>

          {replyingTo === comment.id && <div className="mt-4 ml-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-xs font-semibold text-gray-700">Replying to @{comment.author_name}</p>
            <textarea
              value={replyDrafts[comment.id] ?? ""}
              onChange={(event) => setReplyDrafts((current) => ({ ...current, [comment.id]: event.target.value }))}
              rows={3}
              className="w-full resize-none rounded border border-gray-200 bg-white p-2 text-sm text-gray-900 focus:border-gray-500"
              placeholder="Write a reply..."
            />
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setReplyingTo(null)} className="rounded px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={() => void submitReply(comment.id)} disabled={submitting || !(replyDrafts[comment.id] ?? "").trim()} className="rounded bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300">Reply</button>
            </div>
          </div>}

          {nestedReplies.length > 0 && <div className="mt-4 ml-6 space-y-3 border-l border-gray-200 pl-4">
            {nestedReplies.map((reply) => <div key={reply.id} className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">{reply.author_name.slice(0, 1).toUpperCase()}</div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{reply.author_name}</p>
                  <p className="text-[10px] text-gray-500">{new Date(reply.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-700">{reply.body}</p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                <button type="button" onClick={() => void toggleCommentLike(reply)} disabled={likingCommentIds.has(reply.id)} aria-pressed={reply.is_liked} className={`inline-flex items-center gap-1 disabled:opacity-60 ${reply.is_liked ? "text-blue-700" : ""}`}><ThumbsUp size={11} fill={reply.is_liked ? "currentColor" : "none"} /> {reply.like_count}</button>
                <button type="button" onClick={() => { setReplyingTo(reply.id); setError(null); }} className="inline-flex items-center gap-1"><MessageCircle size={11} /> Reply</button>
                {reply.is_owner && <button type="button" onClick={() => void deleteComment(reply.id).then(() => setComments((current) => current.filter((item) => item.id !== reply.id)))} className="text-gray-500 hover:text-red-600">Delete</button>}
              </div>
              {replyingTo === reply.id && <div className="mt-3 rounded border border-gray-200 bg-white p-2">
                <textarea value={replyDrafts[reply.id] ?? ""} onChange={(event) => setReplyDrafts((current) => ({ ...current, [reply.id]: event.target.value }))} rows={2} className="w-full resize-none border-0 bg-transparent text-xs text-gray-900 outline-none" placeholder="Write a reply..." />
                <div className="mt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setReplyingTo(null)} className="rounded px-2 py-1 text-[10px] font-medium text-gray-600">Cancel</button>
                  <button type="button" onClick={() => void submitReply(reply.id)} disabled={submitting || !(replyDrafts[reply.id] ?? "").trim()} className="rounded bg-gray-950 px-2 py-1 text-[10px] font-semibold text-white disabled:bg-gray-300">Reply</button>
                </div>
              </div>}
            </div>)}
          </div>}
        </article>;
      })}
    </div>
  </section>;
}