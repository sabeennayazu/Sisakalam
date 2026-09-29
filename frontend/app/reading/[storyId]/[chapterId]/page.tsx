"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoryChapters } from "@/utils/stories.api";
import type { ChapterReferenceApiRecord } from "@/types";

interface PageProps {
  params: Promise<{ storyId: string; chapterId: string }>;
}

export default function LegacyReadingRoute({ params }: PageProps) {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void params.then(async ({ storyId, chapterId }) => {
      try {
        const requestedNumber = Number(chapterId);
        const chapters = await getStoryChapters<ChapterReferenceApiRecord[]>(storyId, true);
        const chapter = chapters.find((item) => item.chapter_number === requestedNumber);
        if (!chapter) {
          if (!cancelled) setError(true);
          return;
        }
        if (!cancelled) router.replace(`/stories/${storyId}/${chapter.slug}`);
      } catch {
        if (!cancelled) setError(true);
      }
    });
    return () => { cancelled = true; };
  }, [params, router]);

  if (error) {
    return <div className="flex min-h-screen items-center justify-center"><div className="text-center"><p className="text-gray-600">Unable to open this chapter.</p><Link href="/stories" className="mt-4 inline-block rounded bg-black px-6 py-2 text-white">Browse Stories</Link></div></div>;
  }

  return <div className="flex min-h-screen items-center justify-center"><p className="text-gray-500">Opening chapter...</p></div>;
}
