'use client';

import { useEffect, useRef } from 'react';
import { ChapterData } from '@/hooks/useContinuousChapters';

interface ChapterContentProps {
  chapter: ChapterData;
  highlightTitle?: boolean;
  onVisible: (chapterNumber: number) => void;
}

export default function ChapterContent({ chapter, highlightTitle = false, onVisible }: ChapterContentProps) {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onVisible(chapter.chapter_number);
    }, { rootMargin: '-15% 0px -75% 0px' });
    if (markerRef.current) observer.observe(markerRef.current);
    return () => observer.disconnect();
  }, [chapter.chapter_number, onVisible]);

  return (
      <article
        id={`chapter-${chapter.chapter_number}`}
        className="mb-16 scroll-mt-16"
        data-chapter-id={chapter.id}
        data-chapter-number={chapter.chapter_number}
      >
        <div ref={markerRef} className="h-px" />
        {/* Chapter Title - Sticky on scroll */}
        <div
          className={`mb-8 ${
            highlightTitle
              ? 'sticky top-0 z-10 bg-inherit py-4 shadow-sm'
              : ''
          }`}
        >
          <h2 className="text-3xl font-bold text-inherit" style={{ color: 'inherit' }}>
            Chapter {chapter.chapter_number}: {chapter.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {new Date(chapter.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Chapter Content */}
        <div className="prose max-w-none text-inherit" style={{ fontSize: 'var(--reading-font-size)' }}>
          {chapter.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 leading-8" style={{ color: 'inherit' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Chapter Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>End of Chapter {chapter.chapter_number}</p>
        </div>
      </article>
    );
}
