import { apiFetch } from "./client";

/**
 * Fetches a paginated list of poems from the backend.
 *
 * @param query Optional query parameters such as search, genre, tag, author, and pagination values.
 * @returns A list of poems or a paginated response from the backend.
 * @requiresAuthentication false
 */
export const getPoems = async (query?: Record<string, string | number | boolean | undefined | null>) => {
  return apiFetch("/poems/", { query });
};

/**
 * Fetches a single poem by its identifier.
 *
 * @param poemId The unique poem identifier.
 * @returns The poem record.
 * @requiresAuthentication false
 */
export const getPoem = async (poemId: string | number) => {
  return apiFetch(`/poems/${poemId}/`);
};

/**
 * Creates a new poem.
 *
 * @param payload The poem payload to submit.
 * @returns The created poem record.
 * @requiresAuthentication true
 */
export const createPoem = async (payload: Record<string, unknown>) => {
  return apiFetch("/poems/", { method: "POST", body: payload });
};

/**
 * Updates an existing poem.
 *
 * @param poemId The unique poem identifier.
 * @param payload Partial poem fields to update.
 * @returns The updated poem record.
 * @requiresAuthentication true
 */
export const updatePoem = async (poemId: string | number, payload: Record<string, unknown>) => {
  return apiFetch(`/poems/${poemId}/`, { method: "PATCH", body: payload });
};

/**
 * Deletes a poem.
 *
 * @param poemId The unique poem identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const deletePoem = async (poemId: string | number) => {
  return apiFetch(`/poems/${poemId}/`, { method: "DELETE" });
};

/**
 * Publishes a draft poem.
 *
 * @param poemId The unique poem identifier.
 * @returns The updated poem record.
 * @requiresAuthentication true
 */
export const publishPoem = async (poemId: string | number) => {
  return apiFetch(`/poems/${poemId}/publish/`, { method: "POST" });
};

/**
 * Unpublishes a published poem.
 *
 * @param poemId The unique poem identifier.
 * @returns The updated poem record.
 * @requiresAuthentication true
 */
export const unpublishPoem = async (poemId: string | number) => {
  return apiFetch(`/poems/${poemId}/unpublish/`, { method: "POST" });
};

/**
 * Saves a poem as a draft.
 *
 * @param payload The poem content and metadata for the draft.
 * @returns The created draft poem record.
 * @requiresAuthentication true
 */
export const saveDraft = async (payload: Record<string, unknown>) => {
  return apiFetch("/poems/", { method: "POST", body: { ...payload, status: "draft" } });
};

/**
 * Fetches the current user's draft poems.
 *
 * @returns A list of draft poems owned by the authenticated user.
 * @requiresAuthentication true
 */
export const getDrafts = async () => {
  return apiFetch("/poems/", { query: { mine: 1, status: "draft" } });
};

/**
 * Searches poems by free text.
 *
 * @param query The search text.
 * @returns Matching poems.
 * @requiresAuthentication false
 */
export const searchPoems = async (query: string) => {
  return apiFetch("/poems/", { query: { q: query } });
};

/**
 * Searches poems by genre.
 *
 * @param genre The genre name or identifier.
 * @returns Matching poems.
 * @requiresAuthentication false
 */
export const searchPoemsByGenre = async (genre: string) => {
  return apiFetch("/poems/", { query: { genre } });
};

/**
 * Searches poems by author.
 *
 * @param authorId The author identifier.
 * @returns Poems written by the specified author.
 * @requiresAuthentication false
 */
export const searchPoemsByAuthor = async (authorId: string | number) => {
  return apiFetch("/poems/", { query: { author: authorId } });
};

/**
 * Fetches trending poems.
 *
 * @returns A list of trending poems.
 * @requiresAuthentication false
 */
export const getTrendingPoems = async () => {
  return apiFetch("/poems/trending/");
};

/**
 * Fetches popular poems.
 *
 * @returns A list of popular poems.
 * @requiresAuthentication false
 */
export const getPopularPoems = async () => {
  return apiFetch("/poems/popular/");
};

/**
 * Fetches the latest poems.
 *
 * @returns A list of the newest poems.
 * @requiresAuthentication false
 */
export const getLatestPoems = async () => {
  return apiFetch("/poems/latest/");
};

/**
 * Fetches featured poems.
 *
 * @returns A list of featured poems.
 * @requiresAuthentication false
 */
export const getFeaturedPoems = async () => {
  // TODO: Backend endpoint pending for featured poems.
  return apiFetch("/poems/featured/");
};

/**
 * Fetches recommended poems for the current user.
 *
 * @returns A list of recommended poems.
 * @requiresAuthentication true
 */
export const getRecommendedPoems = async () => {
  return apiFetch("/poems/recommendations/");
};

/**
 * Fetches poems written by a specific author.
 *
 * @param authorId The author identifier.
 * @returns Poems written by the specified author.
 * @requiresAuthentication false
 */
export const getAuthorPoems = async (authorId: string | number) => {
  return apiFetch("/poems/", { query: { author: authorId } });
};

/**
 * Reports a poem for moderation.
 *
 * @param poemId The unique poem identifier.
 * @param reason The report reason.
 * @returns The moderation response from the backend.
 * @requiresAuthentication true
 */
export const reportPoem = async (poemId: string | number, reason: string) => {
  // TODO: Backend endpoint pending for poem reports.
  return apiFetch(`/poems/${poemId}/report/`, { method: "POST", body: { reason } });
};
