"use client";

import { useEffect, useState } from "react";
import { createComment, deleteComment, getComments } from "@/utils/interactions.api";

interface CommentRecord {
  id: number;
  user: number;
  author_name: string;
  body: string;
  created_at: string;
  is_owner: boolean;
}

export default function ContentComments({ type, contentId }: { type: "story" | "poem"; contentId: number }) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setComments(await getComments(type, contentId) as CommentRecord[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [type, contentId]);

  const submit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const created = await createComment({ [type]: contentId, body: body.trim() }) as CommentRecord;
      setComments((current) => [...current, created]);
      setBody("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return <section className="border border-gray-200 bg-white p-5 shadow-sm">
    <h2 className="mb-4 text-lg font-semibold text-black">Comments ({comments.length})</h2>
    <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={3} placeholder="Share your thoughts..." className="w-full border border-gray-300 p-3 text-sm text-black focus:border-black focus:outline-none" />
    <button type="button" onClick={() => void submit()} disabled={submitting || !body.trim()} className="mt-3 bg-black px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-300">{submitting ? "Posting..." : "Post comment"}</button>
    {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    <div className="mt-6 space-y-4">
      {loading ? <p className="text-sm text-gray-500">Loading comments...</p> : comments.length === 0 ? <p className="text-sm text-gray-500">No comments yet.</p> : comments.map((comment) => <article key={comment.id} className="border-b border-gray-100 pb-4"><div className="flex items-center justify-between gap-3"><p className="font-medium text-black">{comment.author_name}</p><time className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</time></div><p className="mt-2 text-sm leading-6 text-gray-700">{comment.body}</p>{comment.is_owner && <button type="button" onClick={() => void deleteComment(comment.id).then(() => setComments((current) => current.filter((item) => item.id !== comment.id)))} className="mt-2 text-xs text-gray-500 hover:text-red-600">Delete</button>}</article>)}
    </div>
  </section>;
}