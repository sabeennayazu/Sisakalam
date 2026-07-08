import { apiFetch } from "./client";

/**
 * Records a story view event for analytics.
 *
 * @param storyId The story identifier.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const recordStoryView = async (storyId: string | number) => {
  return apiFetch(`/analytics/stories/${storyId}/views/`, { method: "POST" });
};

/**
 * Records a poem view event for analytics.
 *
 * @param poemId The poem identifier.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const recordPoemView = async (poemId: string | number) => {
  return apiFetch(`/analytics/poems/${poemId}/views/`, { method: "POST" });
};

/**
 * Records reading duration for a story or poem.
 *
 * @param payload The reading duration payload.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const recordReadingTime = async (payload: Record<string, unknown>) => {
  return apiFetch("/analytics/reading-duration/", { method: "POST", body: payload });
};

/**
 * Records a recommendation click event.
 *
 * @param payload The recommendation click payload.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const recordRecommendationClick = async (payload: Record<string, unknown>) => {
  return apiFetch("/analytics/recommendation-clicks/", { method: "POST", body: payload });
};

/**
 * Records a search event for analytics.
 *
 * @param payload The search event payload.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const recordSearch = async (payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for search event analytics.
  return apiFetch("/analytics/search/", { method: "POST", body: payload });
};

/**
 * Fetches the authenticated user's reading statistics.
 *
 * @returns Reading statistics payload.
 * @requiresAuthentication true
 */
export const getReadingStatistics = async () => {
  // TODO: Backend endpoint pending for reading statistics.
  return apiFetch("/analytics/reading-statistics/");
};

/**
 * Fetches the author dashboard analytics.
 *
 * @returns Dashboard statistics for the authenticated author.
 * @requiresAuthentication true
 */
export const getAuthorDashboard = async () => {
  return apiFetch("/analytics/stats/");
};

/**
 * Fetches analytics for a story.
 *
 * @param storyId The story identifier.
 * @returns Story analytics payload.
 * @requiresAuthentication true
 */
export const getStoryAnalytics = async (storyId: string | number) => {
  // TODO: Backend endpoint pending for story analytics.
  return apiFetch(`/analytics/stories/${storyId}/`);
};

/**
 * Fetches analytics for a poem.
 *
 * @param poemId The poem identifier.
 * @returns Poem analytics payload.
 * @requiresAuthentication true
 */
export const getPoemAnalytics = async (poemId: string | number) => {
  // TODO: Backend endpoint pending for poem analytics.
  return apiFetch(`/analytics/poems/${poemId}/`);
};

/**
 * Fetches genre analytics.
 *
 * @returns Genre popularity analytics.
 * @requiresAuthentication false
 */
export const getGenreAnalytics = async () => {
  return apiFetch("/analytics/popular-genres/");
};

/**
 * Fetches platform-wide analytics summary.
 *
 * @returns Platform statistics.
 * @requiresAuthentication true
 */
export const getPlatformStatistics = async () => {
  // TODO: Backend endpoint pending for platform statistics.
  return apiFetch("/analytics/platform/");
};

/**
 * Fetches user activity analytics for the authenticated user.
 *
 * @returns User activity payload.
 * @requiresAuthentication true
 */
export const getUserActivity = async () => {
  // TODO: Backend endpoint pending for user activity analytics.
  return apiFetch("/analytics/activity/");
};

/**
 * Fetches recommendation performance metrics.
 *
 * @returns Recommendation metrics payload.
 * @requiresAuthentication true
 */
export const getRecommendationMetrics = async () => {
  // TODO: Backend endpoint pending for recommendation metrics.
  return apiFetch("/analytics/recommendations/metrics/");
};