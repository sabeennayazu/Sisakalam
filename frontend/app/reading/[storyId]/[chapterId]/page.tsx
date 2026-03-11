'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReadingLayout from '@/components/reading/ReadingLayout';
import { mockStories } from '@/app/stories/mockData';
import { ChapterData } from '@/hooks/useContinuousChapters';

interface PageProps {
  params: Promise<{ storyId: string; chapterId: string }>;
}

export default function ReadingPage({ params }: PageProps) {
  const [paramsResolved, setParamsResolved] = useState(false);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolved) => {
      setStoryId(resolved.storyId);
      setChapterId(resolved.chapterId);
      setParamsResolved(true);
    });
  }, [params]);

  if (!paramsResolved || !storyId || !chapterId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Get story from mock data
  const story = mockStories[storyId];

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Story not found</h1>
          <p className="mt-2 text-gray-600">
            The story you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Parse chapter number from chapterId (assumes format like "1", "2", etc.)
  const chapterNumber = parseInt(chapterId, 10);

  if (isNaN(chapterNumber)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Invalid chapter</h1>
          <p className="mt-2 text-gray-600">
            The chapter number is invalid.
          </p>
        </div>
      </div>
    );
  }

  // Get the requested chapter and surrounding chapters
  const requestedChapter = story.chapters.find(
    (ch) => ch.chapter_number === chapterNumber,
  );

  if (!requestedChapter) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Chapter not found
          </h1>
          <p className="mt-2 text-gray-600">
            This chapter doesn't exist in this story.
          </p>
        </div>
      </div>
    );
  }

  // For continuous reading, load the requested chapter and some surrounding ones
  let initialChapters: ChapterData[] = [];

  if (chapterNumber === 1) {
    // Load first few chapters
    initialChapters = story.chapters
      .slice(0, Math.min(3, story.chapters.length))
      .map((ch) => ({
        id: ch.chapter_id,
        title: ch.chapter_title,
        chapter_number: ch.chapter_number,
        content: ch.content,
        next_chapter:
          ch.chapter_number < story.chapters.length ? `${ch.chapter_number + 1}` : null,
        previous_chapter: ch.chapter_number > 1 ? `${ch.chapter_number - 1}` : null,
        created_at: ch.created_at,
      }));
  } else {
    // For specific chapter, load current and surrounding ones
    const startIndex = Math.max(0, chapterNumber - 2);
    const endIndex = Math.min(
      story.chapters.length,
      chapterNumber + 1,
    );

    initialChapters = story.chapters
      .slice(startIndex, endIndex)
      .map((ch) => ({
        id: ch.chapter_id,
        title: ch.chapter_title,
        chapter_number: ch.chapter_number,
        content: ch.content,
        next_chapter:
          ch.chapter_number < story.chapters.length ? `${ch.chapter_number + 1}` : null,
        previous_chapter: ch.chapter_number > 1 ? `${ch.chapter_number - 1}` : null,
        created_at: ch.created_at,
      }));
  }

  return (
    <ReadingLayout
      storyId={storyId}
      storyTitle={story.title}
      storyImage={story.image}
      storyAuthor={story.author}
      synopsis={story.synopsis}
      likes={story.likes}
      views={story.views}
      bookmarks={story.bookmarks}
      initialChapters={initialChapters}
      initialChapterNumber={chapterNumber}
    />
  );
}
