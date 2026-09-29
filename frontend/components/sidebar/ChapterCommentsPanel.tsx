'use client';

import { MessageCircle } from 'lucide-react';
import ContentComments from '@/components/Comments/ContentComments';

interface ChapterCommentsPanelProps {
  chapterId: number | null;
  chapterNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChapterCommentsPanel({
  chapterId,
  chapterNumber,
  isOpen,
  onClose,
}: ChapterCommentsPanelProps) {
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

        <div className="p-4">
          {chapterId === null ? <p className="py-8 text-center text-sm text-gray-500">Chapter comments are unavailable.</p> : <ContentComments type="chapter" contentId={chapterId} />}
        </div>
      </div>
    </div>
  );
}
