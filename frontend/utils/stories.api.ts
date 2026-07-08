import { apiFetch } from "./client";

/**
 * Fetches a collection of stories from the backend.
 *
 * @param query Optional query parameters such as search, genre, tag, author, and pagination values.
 * @returns A paginated list of stories or a raw array from the backend.
 * @requiresAuthentication false
 */
export const getStories = async (query?: Record<string, string | number | boolean | undefined | null>) => {
  return apiFetch("/stories/", { query });
};

/**
 * Fetches a single story by its identifier.
 *
 * @param storyId The unique story identifier.
 * @returns The story record.
 * @requiresAuthentication false
 */
export const getStory = async (storyId: string | number) => {
  return apiFetch(`/stories/${storyId}/`);
};

/**
 * Creates a new story.
 *
 * @param payload The story payload to submit.
 * @returns The created story record.
 * @requiresAuthentication true
 */
export const createStory = async (payload: Record<string, unknown>) => {
  return apiFetch("/stories/", { method: "POST", body: payload });
};

/**
 * Updates an existing story.
 *
 * @param storyId The unique story identifier.
 * @param payload Partial story fields to update.
 * @returns The updated story record.
 * @requiresAuthentication true
 */
export const updateStory = async (storyId: string | number, payload: Record<string, unknown>) => {
  return apiFetch(`/stories/${storyId}/`, { method: "PATCH", body: payload });
};

/**
 * Deletes a story.
 *
 * @param storyId The unique story identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const deleteStory = async (storyId: string | number) => {
  return apiFetch(`/stories/${storyId}/`, { method: "DELETE" });
};

/**
 * Publishes a draft story.
 *
 * @param storyId The unique story identifier.
 * @returns The updated story record.
 * @requiresAuthentication true
 */
export const publishStory = async (storyId: string | number) => {
  return apiFetch(`/stories/${storyId}/publish/`, { method: "POST" });
};

/**
 * Unpublishes a published story.
 *
 * @param storyId The unique story identifier.
 * @returns The updated story record.
 * @requiresAuthentication true
 */
export const unpublishStory = async (storyId: string | number) => {
  return apiFetch(`/stories/${storyId}/unpublish/`, { method: "POST" });
};

/**
 * Saves a story as a draft.
 *
 * @param payload The story content and metadata for the draft.
 * @returns The created draft story record.
 * @requiresAuthentication true
 */
export const saveDraft = async (payload: Record<string, unknown>) => {
  return apiFetch("/stories/", { method: "POST", body: { ...payload, status: "draft" } });
};

/**
 * Fetches the current user's draft stories.
 *
 * @returns A list of draft stories owned by the authenticated user.
 * @requiresAuthentication true
 */
export const getDrafts = async () => {
  return apiFetch("/stories/", { query: { mine: 1, status: "draft" } });
};

/**
 * Fetches chapters for a given story.
 *
 * @param storyId The unique story identifier.
 * @returns A list of chapters.
 * @requiresAuthentication false
 */
export const getStoryChapters = async (storyId: string | number) => {
  return apiFetch(`/stories/${storyId}/chapters/`);
};

/**
 * Creates a new chapter for a story.
 *
 * @param storyId The unique story identifier.
 * @param payload The chapter payload.
 * @returns The created chapter.
 * @requiresAuthentication true
 */
export const createChapter = async (storyId: string | number, payload: Record<string, unknown>) => {
  return apiFetch(`/stories/${storyId}/chapters/`, { method: "POST", body: payload });
};

/**
 * Updates a story chapter.
 *
 * @param storyId The unique story identifier.
 * @param chapterId The chapter identifier.
 * @param payload Partial chapter fields to update.
 * @returns The updated chapter.
 * @requiresAuthentication true
 */
export const updateChapter = async (storyId: string | number, chapterId: string | number, payload: Record<string, unknown>) => {
  return apiFetch(`/stories/${storyId}/chapters/${chapterId}/`, { method: "PATCH", body: payload });
};

/**
 * Deletes a story chapter.
 *
 * @param storyId The unique story identifier.
 * @param chapterId The chapter identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const deleteChapter = async (storyId: string | number, chapterId: string | number) => {
  return apiFetch(`/stories/${storyId}/chapters/${chapterId}/`, { method: "DELETE" });
};

/**
 * Reorders story chapters.
 *
 * @param storyId The unique story identifier.
 * @param payload An array describing the new chapter order.
 * @returns The reordered chapters.
 * @requiresAuthentication true
 */
export const reorderChapters = async (storyId: string | number, payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for chapter reordering.
  return apiFetch(`/stories/${storyId}/chapters/reorder/`, { method: "POST", body: payload });
};

/**
 * Publishes a single chapter.
 *
 * @param storyId The unique story identifier.
 * @param chapterId The chapter identifier.
 * @returns The updated chapter.
 * @requiresAuthentication true
 */
export const publishChapter = async (storyId: string | number, chapterId: string | number) => {
  // TODO: Backend endpoint pending for chapter publishing.
  return apiFetch(`/stories/${storyId}/chapters/${chapterId}/publish/`, { method: "POST" });
};

/**
 * Records that a story has been read.
 *
 * @param storyId The unique story identifier.
 * @returns The response from the backend.
 * @requiresAuthentication false
 */
export const readStory = async (storyId: string | number) => {
  return apiFetch(`/stories/${storyId}/read/`, { method: "POST" });
};

/**
 * Records a story view event for analytics.
 *
 * @param storyId The unique story identifier.
 * @returns The response from the backend.
 * @requiresAuthentication false
 */
export const recordStoryView = async (storyId: string | number) => {
  return apiFetch(`/analytics/stories/${storyId}/views/`, { method: "POST" });
};

/**
 * Searches stories by text.
 *
 * @param query The search text.
 * @returns Matching stories.
 * @requiresAuthentication false
 */
export const searchStories = async (query: string) => {
  return apiFetch("/stories/", { query: { q: query } });
};

/**
 * Searches stories by title.
 *
 * @param title The title to match.
 * @returns Matching stories.
 * @requiresAuthentication false
 */
export const searchStoriesByTitle = async (title: string) => {
  return apiFetch("/stories/", { query: { q: title } });
};

/**
 * Searches stories by genre.
 *
 * @param genre The genre name.
 * @returns Matching stories.
 * @requiresAuthentication false
 */
export const searchStoriesByGenre = async (genre: string) => {
  return apiFetch("/stories/", { query: { genre } });
};

/**
 * Searches stories by author.
 *
 * @param authorId The author identifier.
 * @returns Stories written by the specified author.
 * @requiresAuthentication false
 */
export const searchStoriesByAuthor = async (authorId: string | number) => {
  return apiFetch("/stories/", { query: { author: authorId } });
};

/**
 * Fetches trending stories.
 *
 * @returns A list of trending stories.
 * @requiresAuthentication false
 */
export const getTrendingStories = async () => {
  return apiFetch("/stories/trending/");
};

/**
 * Fetches popular stories.
 *
 * @returns A list of popular stories.
 * @requiresAuthentication false
 */
export const getPopularStories = async () => {
  return apiFetch("/stories/popular/");
};

/**
 * Fetches the latest stories.
 *
 * @returns A list of the newest stories.
 * @requiresAuthentication false
 */
export const getLatestStories = async () => {
  return apiFetch("/stories/latest/");
};

/**
 * Fetches featured stories.
 *
 * @returns A list of featured stories.
 * @requiresAuthentication false
 */
export const getFeaturedStories = async () => {
  return apiFetch("/stories/featured/");
};

/**
 * Fetches recommended stories for the current user.
 *
 * @returns A list of recommended stories.
 * @requiresAuthentication true
 */
export const getRecommendedStories = async () => {
  return apiFetch("/stories/recommendations/");
};

/**
 * Fetches stories written by a specific author.
 *
 * @param authorId The author identifier.
 * @returns Stories written by the specified author.
 * @requiresAuthentication false
 */
export const getAuthorStories = async (authorId: string | number) => {
  return apiFetch("/stories/", { query: { author: authorId } });
};

/**
 * Fetches stories owned by the current user.
 *
 * @returns Stories owned by the authenticated user.
 * @requiresAuthentication true
 */
export const getUserStories = async () => {
  return apiFetch("/stories/", { query: { mine: 1 } });
};

/**
 * Fetches story statistics for a story.
 *
 * @param storyId The unique story identifier.
 * @returns Story statistics.
 * @requiresAuthentication false
 */
export const getStoryStats = async (storyId: string | number) => {
  // TODO: Backend endpoint pending for story stats.
  return apiFetch(`/stories/${storyId}/stats/`);
};

/**
 * Reports a story for moderation.
 *
 * @param storyId The unique story identifier.
 * @param reason The report reason.
 * @returns The moderation response from the backend.
 * @requiresAuthentication true
 */
export const reportStory = async (storyId: string | number, reason: string) => {
  // TODO: Backend endpoint pending for story reports.
  return apiFetch(`/stories/${storyId}/report/`, { method: "POST", body: { reason } });
};

/**
 * Duplicates a story.
 *
 * @param storyId The unique story identifier.
 * @returns The duplicated story record.
 * @requiresAuthentication true
 */
export const duplicateStory = async (storyId: string | number) => {
  // TODO: Backend endpoint pending for story duplication.
  return apiFetch(`/stories/${storyId}/duplicate/`, { method: "POST" });
};

/**
 * Archives a story.
 *
 * @param storyId The unique story identifier.
 * @returns The archived story record.
 * @requiresAuthentication true
 */
export const archiveStory = async (storyId: string | number) => {
  // TODO: Backend endpoint pending for story archiving.
  return apiFetch(`/stories/${storyId}/archive/`, { method: "POST" });
};