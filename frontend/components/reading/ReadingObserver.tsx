'use client';

import { useEffect, useRef } from 'react';

interface ReadingObserverProps {
  edge: 'top' | 'bottom';
  onIntersect: () => void;
}

/**
 * Component that observes scroll position and triggers callbacks when user
 * is near the top or bottom of the reading area.
 */
export default function ReadingObserver({
  edge,
  onIntersect,
}: ReadingObserverProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onIntersect();
    }, {
      rootMargin: '300px 0px',
    });

    if (targetRef.current) observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [onIntersect]);

  return (
    <div ref={targetRef} className="h-px w-full" data-observer={edge} />
  );
}
