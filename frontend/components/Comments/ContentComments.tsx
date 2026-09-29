"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp, MessageCircle, MoreHorizontal, Pin } from "lucide-react";
import { createComment, deleteComment, getComments } from "@/utils/interactions.api";
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
}

type CommentSort = "most_liked" | "newest";

export default function ContentComments({ type, contentId }: { type: "story" | "poem" | "chapter"; contentId: number }) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const [sort, setSort] = useState<CommentSort>("most_liked");

  const selectSort = (nextSort: CommentSort) => {
    setSort(nextSort);
    setComments((current) => [...current].sort((left, right) => {
      const newestFirst = Date.parse(right.created_at) - Date.parse(left.created_at);
      return nextSort === "newest" ? newestFirst : right.like_count - left.like_count || newestFirst;
    }));
  };

  useEffect(() => {
    setSignedIn(isAuthenticated());
    setLoading(true);
    let cancelled = false;
    void getComments(type, contentId, sort)
      .then((result) => { if (!cancelled) setComments(result as CommentRecord[]); })
      .catch(() => { if (!cancelled) setError(`Unable to load ${type === "chapter" ? "comments" : "reviews"} right now. Please try again.`); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [type, contentId, sort]);

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
      await createComment({ [type]: contentId, body: body.trim(), ...(type === "chapter" ? {} : { rating }) });
      setBody("");
      setRating(0);
      setComments(await getComments(type, contentId, sort) as CommentRecord[]);
      setSuccess(`Your ${type === "chapter" ? "comment" : "review"} has been posted.`);
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

  return <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
    <div className="mb-6 border-b border-gray-200 pb-5">
      <h2 className="text-xl font-bold text-gray-950">Leave a {type === "chapter" ? "Comment" : "Review"}</h2>
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
      {loading && comments.length === 0 ? <p className="py-8 text-sm text-gray-500">Loading {type === "chapter" ? "comments" : "reviews"}...</p> : comments.length === 0 ? <p className="py-8 text-sm text-gray-500">No {type === "chapter" ? "comments" : "reviews"} yet. Be the first to share your thoughts.</p> : comments.map((comment) => <article key={comment.id} className="relative py-5"><Pin size={14} className="absolute right-0 top-6 text-gray-400" /><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">{comment.author_name.slice(0, 1).toUpperCase()}</div><div><p className="text-sm font-semibold text-gray-950">{comment.author_name}</p><p className="text-[11px] text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p></div></div>{type !== "chapter" && <div className="mt-1 flex text-gray-950">{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={12} fill={comment.rating && value <= comment.rating ? "currentColor" : "none"} />)}</div>}<p className="mt-3 pr-4 text-xs leading-5 text-gray-700">{comment.body}</p><div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500"><button type="button" className="inline-flex items-center gap-1"><ThumbsUp size={12} /> {comment.like_count}</button><button type="button" className="inline-flex items-center gap-1"><MessageCircle size={12} /> Reply</button><button type="button" aria-label="More actions"><MoreHorizontal size={14} /></button>{comment.is_owner && <button type="button" onClick={() => void deleteComment(comment.id).then(() => setComments((current) => current.filter((item) => item.id !== comment.id)))} className="text-gray-500 hover:text-red-600">Delete</button>}</div></article>)}
    </div>
  </section>;
}