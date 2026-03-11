'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string;
  chapter_id: string;
  user: string;
  avatar: string;
  comment: string;
  created_at: string;
  likes: number;
}

interface ChapterCommentsPanelProps {
  chapterId: string;
  chapterNumber: number;
  comments: Comment[];
  isOpen: boolean;
  onClose: () => void;
  onPostComment?: (comment: string) => Promise<void>;
}

export default function ChapterCommentsPanel({
  chapterId,
  chapterNumber,
  comments,
  isOpen,
  onClose,
  onPostComment,
}: ChapterCommentsPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePostComment = async () => {
    if (!newComment.trim() || !onPostComment) return;

    setIsPosting(true);
    try {
      await onPostComment(newComment);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-screen w-80 overflow-y-auto bg-white shadow-lg">
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Comments</h2>
              <p className="text-xs text-gray-500">
                Chapter {chapterNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        {onPostComment && (
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 resize-none rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={3}
              />
            </div>
            <button
              onClick={handlePostComment}
              disabled={!newComment.trim() || isPosting}
              className="mt-2 flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Post
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="divide-y divide-gray-200">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="px-6 py-4">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={comment.avatar}
                      alt={comment.user}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">
                      {comment.user}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      {comment.comment}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                No comments yet. Be the first to share!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
