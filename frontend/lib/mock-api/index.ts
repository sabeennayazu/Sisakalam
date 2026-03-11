import { stories, Story } from '@/mock/stories';
import { chapters, storySevenChapters, Chapter } from '@/mock/chapters';
import { comments, Comment } from '@/mock/comments';

/**
 * Get all stories
 */
export function getStories(): Story[] {
  return stories;
}

/**
 * Get a story by ID
 */
export function getStoryById(id: number): Story | undefined {
  return stories.find((story) => story.id === id);
}

/**
 * Get a story by slug
 */
export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug);
}

/**
 * Get all chapters for a story
 */
export function getChaptersByStory(storyId: number): Chapter[] {
  const allChapters = storyId === 7 
    ? storySevenChapters 
    : chapters;
  
  return allChapters
    .filter((chapter) => chapter.story_id === storyId)
    .sort((a, b) => a.chapter_number - b.chapter_number);
}

/**
 * Get a specific chapter by story ID and chapter slug
 */
export function getChapterBySlug(
  storyId: number,
  slug: string,
): Chapter | undefined {
  const allChapters = storyId === 7 
    ? storySevenChapters 
    : chapters;
  
  return allChapters.find(
    (chapter) => chapter.story_id === storyId && chapter.slug === slug,
  );
}

/**
 * Get a specific chapter by chapter ID
 */
export function getChapterById(id: string): Chapter | undefined {
  const allChapters = [...chapters, ...storySevenChapters];
  return allChapters.find((chapter) => chapter.id === id);
}

/**
 * Get the first chapter of a story
 */
export function getFirstChapter(storyId: number): Chapter | undefined {
  const storyChapters = getChaptersByStory(storyId);
  return storyChapters[0];
}

/**
 * Get comments for a specific chapter
 */
export function getChapterComments(chapterId: string): Comment[] {
  return comments
    .filter((comment) => comment.chapter_id === chapterId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
}

/**
 * Get next chapter information
 */
export function getNextChapter(
  storyId: number,
  chapterId: string,
): Chapter | undefined {
  const allChapters = storyId === 7 
    ? storySevenChapters 
    : chapters;
  
  const current = allChapters.find((ch) => ch.id === chapterId);
  if (!current || !current.next_chapter) return undefined;

  return allChapters.find((ch) => ch.slug === current.next_chapter);
}

/**
 * Get previous chapter information
 */
export function getPreviousChapter(
  storyId: number,
  chapterId: string,
): Chapter | undefined {
  const allChapters = storyId === 7 
    ? storySevenChapters 
    : chapters;
  
  const current = allChapters.find((ch) => ch.id === chapterId);
  if (!current || !current.previous_chapter) return undefined;

  return allChapters.find((ch) => ch.slug === current.previous_chapter);
}

/**
 * Get chapter by story ID and chapter number
 */
export function getChapterByNumber(
  storyId: number,
  chapterNumber: number,
): Chapter | undefined {
  const allChapters = storyId === 7 
    ? storySevenChapters 
    : chapters;
  
  return allChapters.find(
    (chapter) =>
      chapter.story_id === storyId && chapter.chapter_number === chapterNumber,
  );
}

/**
 * Search chapters by keyword
 */
export function searchChapters(
  storyId: number,
  keyword: string,
): Chapter[] {
  const allChapters = storyId === 7 
    ? storySevenChapters 
    : chapters;
  
  const searchTerm = keyword.toLowerCase();
  return allChapters.filter(
    (chapter) =>
      chapter.story_id === storyId &&
      (chapter.title.toLowerCase().includes(searchTerm) ||
        chapter.content.toLowerCase().includes(searchTerm)),
  );
}

/**
 * Get chapter list with minimal data (for sidebars)
 */
export function getChapterList(storyId: number) {
  return getChaptersByStory(storyId).map((chapter) => ({
    id: chapter.id,
    chapter_number: chapter.chapter_number,
    title: chapter.title,
    slug: chapter.slug,
  }));
}
