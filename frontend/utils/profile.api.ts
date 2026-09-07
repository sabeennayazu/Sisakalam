import { API_BASE_URL } from "./api";
import { getBookmarks, getLikedContent } from "./interactions.api";
import { getPoems } from "./poems.api";
import { getStories } from "./stories.api";

export type ProfileContentType = "poem" | "story";

export interface ProfileContent {
  id: number;
  type: ProfileContentType;
  title: string;
  author: string;
  genre: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
}

interface CollectionResponse<T> {
  results: T[];
}

interface ContentRecord {
  id: number;
  title: string;
  author_name: string | null;
  genre_name: string | null;
  image: string | null;
  views: number;
  likes: number;
  comments_count: number;
}

interface InteractionContentRecord {
  content_id: number;
  content_type: ProfileContentType;
  title: string;
  author_name: string | null;
  genre_name: string | null;
  image: string | null;
  views: number;
  likes: number;
  comments_count: number;
}

const asCollection = <T>(response: T[] | CollectionResponse<T>): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  throw new Error("The server returned an invalid content collection.");
};

const absoluteImageUrl = (image: string | null): string => {
  if (!image) {
    return "";
  }

  return image.startsWith("http") ? image : `${API_BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

const mapContent = (item: ContentRecord, type: ProfileContentType): ProfileContent => ({
  id: item.id,
  type,
  title: item.title,
  author: item.author_name ?? "Unknown author",
  genre: item.genre_name ?? "",
  image: absoluteImageUrl(item.image),
  views: item.views,
  likes: item.likes,
  comments: item.comments_count,
});

const mapInteractionContent = (item: InteractionContentRecord): ProfileContent => ({
  id: item.content_id,
  type: item.content_type,
  title: item.title,
  author: item.author_name ?? "Unknown author",
  genre: item.genre_name ?? "",
  image: absoluteImageUrl(item.image),
  views: item.views,
  likes: item.likes,
  comments: item.comments_count,
});

export const getMyPoems = async (): Promise<ProfileContent[]> => {
  const response = await getPoems<ContentRecord[]>({ mine: 1 });
  return asCollection(response).map((item) => mapContent(item, "poem"));
};

export const getMyStories = async (): Promise<ProfileContent[]> => {
  const response = await getStories<ContentRecord[]>({ mine: 1 });
  return asCollection(response).map((item) => mapContent(item, "story"));
};

export const getSavedProfileContent = async (): Promise<ProfileContent[]> => {
  const response = await getBookmarks();
  return asCollection(response).map(mapInteractionContent);
};

export const getLikedProfileContent = async (): Promise<ProfileContent[]> => {
  const response = await getLikedContent();
  return asCollection(response).map(mapInteractionContent);
};
