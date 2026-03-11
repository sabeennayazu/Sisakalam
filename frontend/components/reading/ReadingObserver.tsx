'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ReadingObserverProps {
  onNearBottom: () => void;
  onNearTop: () => void;
  bottomThreshold?: number;
  topThreshold?: number;
}

/**
 * Component that observes scroll position and triggers callbacks when user
 * is near the top or bottom of the reading area.
 */
export default function ReadingObserver({
  onNearBottom,
  onNearTop,
  bottomThreshold = 0.5,
  topThreshold = 0.5,
}: ReadingObserverProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const handleBottomIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onNearBottom();
        }
      });
    },
    [onNearBottom],
  );

  const handleTopIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onNearTop();
        }
      });
    },
    [onNearTop],
  );

  useEffect(() => {
    const bottomObserver = new IntersectionObserver(
      handleBottomIntersection,
      {
        threshold: bottomThreshold,
        rootMargin: '200px',
      },
    );

    const topObserver = new IntersectionObserver(handleTopIntersection, {
      threshold: topThreshold,
      rootMargin: '200px',
    });

    if (bottomRef.current) {
      bottomObserver.observe(bottomRef.current);
    }

    if (topRef.current) {
      topObserver.observe(topRef.current);
    }

    return () => {
      bottomObserver.disconnect();
      topObserver.disconnect();
    };
  }, [handleBottomIntersection, handleTopIntersection, bottomThreshold, topThreshold]);

  return (
    <>
      <div ref={topRef} className="h-px w-full" data-observer="top" />
      <div ref={bottomRef} className="h-px w-full" data-observer="bottom" />
    </>
  );
}
