import { apiFetch } from "./client";

/**
 * Fetches the authenticated user's reading history.
 *
 * @returns The user's reading history entries.
 * @requiresAuthentication true
 */
export const getReadingHistory = async () => {
  return apiFetch("/library/history/");
};

/**
 * Updates the user's reading progress for a story or poem.
 *
 * @param payload The reading progress payload.
 * @returns The updated reading history entry.
 * @requiresAuthentication true
 */
export const updateReadingProgress = async (payload: Record<string, unknown>) => {
  return apiFetch("/library/history/", { method: "POST", body: payload });
};

/**
 * Fetches the current reading position for the authenticated user.
 *
 * @returns The most recently read item.
 * @requiresAuthentication true
 */
export const getContinueReading = async () => {
  return apiFetch("/library/history/continue-reading/");
};

/**
 * Clears the authenticated user's reading history.
 *
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const clearReadingHistory = async () => {
  // TODO: Backend endpoint pending for clearing reading history.
  return apiFetch("/library/history/clear/", { method: "POST" });
};

/**
 * Fetches the authenticated user's collections.
 *
 * @returns A list of collections.
 * @requiresAuthentication true
 */
export const getCollections = async () => {
  return apiFetch("/library/collections/");
};

/**
 * Fetches a single collection by identifier.
 *
 * @param collectionId The collection identifier.
 * @returns The collection record.
 * @requiresAuthentication true
 */
export const getCollection = async (collectionId: string | number) => {
  return apiFetch(`/library/collections/${collectionId}/`);
};

/**
 * Creates a new collection.
 *
 * @param payload The collection payload.
 * @returns The created collection.
 * @requiresAuthentication true
 */
export const createCollection = async (payload: Record<string, unknown>) => {
  return apiFetch("/library/collections/", { method: "POST", body: payload });
};

/**
 * Updates an existing collection.
 *
 * @param collectionId The collection identifier.
 * @param payload Partial collection fields to update.
 * @returns The updated collection.
 * @requiresAuthentication true
 */
export const updateCollection = async (collectionId: string | number, payload: Record<string, unknown>) => {
  return apiFetch(`/library/collections/${collectionId}/`, { method: "PATCH", body: payload });
};

/**
 * Deletes a collection.
 *
 * @param collectionId The collection identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const deleteCollection = async (collectionId: string | number) => {
  return apiFetch(`/library/collections/${collectionId}/`, { method: "DELETE" });
};

/**
 * Adds an item to a collection.
 *
 * @param collectionId The collection identifier.
 * @param payload The content to add to the collection.
 * @returns The created collection item.
 * @requiresAuthentication true
 */
export const addCollectionItem = async (collectionId: string | number, payload: Record<string, unknown>) => {
  return apiFetch(`/library/collections/${collectionId}/items/`, { method: "POST", body: payload });
};

/**
 * Removes an item from a collection.
 *
 * @param itemId The collection item identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const removeCollectionItem = async (itemId: string | number) => {
  return apiFetch(`/library/collections/items/${itemId}/`, { method: "DELETE" });
};

/**
 * Reorders the items inside a collection.
 *
 * @param collectionId The collection identifier.
 * @param payload The reordered item list.
 * @returns The reordered collection items.
 * @requiresAuthentication true
 */
export const reorderCollectionItems = async (collectionId: string | number, payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for collection reordering.
  return apiFetch(`/library/collections/${collectionId}/items/reorder/`, { method: "POST", body: payload });
};

/**
 * Fetches the items contained in a collection.
 *
 * @param collectionId The collection identifier.
 * @returns The collection items.
 * @requiresAuthentication true
 */
export const getCollectionItems = async (collectionId: string | number) => {
  return apiFetch(`/library/collections/${collectionId}/items/`);
};

/**
 * Fetches the authenticated user's saved stories.
 *
 * @returns The saved stories from the user's library.
 * @requiresAuthentication true
 */
export const getSavedStories = async () => {
  // TODO: Backend endpoint pending for saved stories listing.
  return apiFetch("/library/saved-stories/");
};

/**
 * Fetches the authenticated user's saved poems.
 *
 * @returns The saved poems from the user's library.
 * @requiresAuthentication true
 */
export const getSavedPoems = async () => {
  // TODO: Backend endpoint pending for saved poems listing.
  return apiFetch("/library/saved-poems/");
};