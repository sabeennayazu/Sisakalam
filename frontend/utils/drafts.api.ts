import { getPoem } from "./poems.api";
import { getStory, getStoryChapters } from "./stories.api";
import { getMediaUrl } from "./api";

export type DraftContentType = "poem" | "story";

export interface EditableDraftRecord {
  id: string;
  type: DraftContentType;
  title: string;
  content: string;
  genre: string;
  genreId: number | null;
  tags: string[];
  synopsis: string;
  coverImage: string | null;
  matureContent: boolean;
  visibility: "draft" | "private";
  lastSaved: Date;
}

interface DraftApiRecord {
  id: number;
  title: string;
  content?: string;
  synopsis?: string;
  genre: number | null;
  genre_name: string | null;
  tag_names: string[];
  image: string | null;
  is_mature: boolean;
  is_private: boolean;
  status: string;
  updated_at: string;
}

interface StoryChapterRecord {
  content: string;
  order: number;
}

const asRecord = (value: unknown): DraftApiRecord => {
  if (!value || typeof value !== "object" || !("id" in value)) {
    throw new Error("The requested draft could not be loaded.");
  }
  return value as DraftApiRecord;
};

export const getEditableDraft = async (type: DraftContentType, id: string): Promise<EditableDraftRecord> => {
  const record = asRecord(type === "poem" ? await getPoem(id) : await getStory(id));

  if (record.status !== "draft") {
    throw new Error("This work is no longer a draft.");
  }

  let content = record.content ?? "";
  if (type === "story") {
    const chapters = await getStoryChapters<StoryChapterRecord[]>(id);
    content = [...chapters].sort((left, right) => left.order - right.order)[0]?.content ?? "";
  }

  return {
    id: String(record.id),
    type,
    title: record.title ?? "",
    content,
    genre: record.genre_name ?? "",
    genreId: record.genre,
    tags: Array.isArray(record.tag_names) ? record.tag_names : [],
    synopsis: record.synopsis ?? "",
    coverImage: getMediaUrl(record.image),
    matureContent: Boolean(record.is_mature),
    visibility: record.is_private ? "private" : "draft",
    lastSaved: new Date(record.updated_at),
  };
};