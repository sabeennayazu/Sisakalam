"use client";

import React, { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WritingPhase from "@/components/Writing/WritingPhase";
import MetadataPhase from "@/components/Writing/MetadataPhase";
import { startPublishing, startSaving } from "@/components/loader/UploadModal";
import { createChapter, createStory, getStory, updateStory } from "@/utils/stories.api";
import { createPoem, updatePoem } from "@/utils/poems.api";
import { getEditableDraft, type DraftContentType } from "@/utils/drafts.api";
import { getMediaUrl } from "@/utils/api";
import type { StoryApiRecord } from "@/types";

export type ContentType = "story" | "poem";
export type Phase = "writing" | "metadata";
export type PublishField = "type" | "title" | "content" | "genre" | "synopsis" | "general";
export type PublishErrors = Partial<Record<PublishField, string>>;

export interface WritingDraft {
  id: string;
  type: ContentType | null;
  title: string;
  content: string;
  genre: string;
  genreId: number | null;
  tags: string[];
  synopsis: string;
  coverImage: string | null;
  coverImageFile: File | null;
  matureContent: boolean;
  visibility: "draft" | "public" | "private";
  lastSaved: Date;
}

const toRequestBody = (payload: Record<string, unknown>, file: File | null): Record<string, unknown> | FormData => {
  if (!file) return payload;

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          formData.append(key, String(item));
        }
      });
      return;
    }

    if (value instanceof File) {
      formData.append(key, value, value.name);
      return;
    }

    formData.append(key, String(value));
  });

  formData.append("image", file, file.name);
  return formData;
};

const buildPayload = (snapshot: WritingDraft, status: "draft" | "published"): Record<string, unknown> => ({
  title: snapshot.title.trim() || (snapshot.type === "story" ? "Untitled Story" : "Untitled Poem"),
  content: snapshot.content,
  ...(snapshot.type === "story" ? { synopsis: snapshot.synopsis.trim() } : {}),
  genre: snapshot.genreId,
  tags: snapshot.tags,
  is_mature: snapshot.matureContent,
  is_private: snapshot.visibility === "private",
  status,
});

export default function WritePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-600">Loading editor...</div>}>
      <WritePageContent />
    </Suspense>
  );
}

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterStoryId = searchParams.get("mode") === "chapter" ? searchParams.get("storyId") : null;
  const draftIdParam = searchParams.get("id");
  const draftTypeParam = searchParams.get("type") as DraftContentType | null;
  const [parentStory, setParentStory] = useState<StoryApiRecord | null>(null);
  const [phase, setPhase] = useState<Phase>("writing");
  const [draft, setDraft] = useState<WritingDraft>({
    id: "new",
    type: null,
    title: "",
    content: "",
    genre: "",
    genreId: null,
    tags: [],
    synopsis: "",
    coverImage: null,
    coverImageFile: null,
    matureContent: false,
    visibility: "draft",
    lastSaved: new Date(),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishErrors, setPublishErrors] = useState<PublishErrors>({});
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [draftLoadError, setDraftLoadError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const draftRef = useRef(draft);
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());
  const editVersionRef = useRef(0);
  const pendingSavesRef = useRef(0);
  const hydratedDraftKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (chapterStoryId) {
      setIsDraftReady(true);
      return;
    }

    if (!draftIdParam) {
      setIsDraftReady(true);
      return;
    }

    if (draftTypeParam !== "poem" && draftTypeParam !== "story") {
      setDraftLoadError("The draft type is missing or invalid.");
      setIsDraftReady(true);
      return;
    }

    const draftKey = `${draftTypeParam}:${draftIdParam}`;
    if (hydratedDraftKeyRef.current === draftKey) {
      setIsDraftReady(true);
      return;
    }

    let cancelled = false;
    setIsDraftReady(false);
    setDraftLoadError(null);
    getEditableDraft(draftTypeParam, draftIdParam)
      .then((loadedDraft) => {
        if (cancelled) return;
        hydratedDraftKeyRef.current = draftKey;
        draftRef.current = { ...loadedDraft, coverImageFile: null };
        setDraft(draftRef.current);
        setIsDirty(false);
        setIsDraftReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setDraftLoadError(error instanceof Error ? error.message : "Unable to load this draft.");
        setIsDraftReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [chapterStoryId, draftIdParam, draftTypeParam]);

  useEffect(() => {
    if (!chapterStoryId) return;
    getStory<StoryApiRecord>(chapterStoryId)
      .then((story) => {
        setParentStory(story);
        let savedChapterDraft: Partial<Pick<WritingDraft, "title" | "content">> = {};
        try {
          const saved = localStorage.getItem(`chapter-draft:${story.id}`);
          if (saved) savedChapterDraft = JSON.parse(saved) as typeof savedChapterDraft;
        } catch {
          localStorage.removeItem(`chapter-draft:${story.id}`);
        }
        const chapterDraft = { ...draftRef.current, ...savedChapterDraft, type: "story" as const, title: savedChapterDraft.title || `Chapter ${story.chapter_count + 1}`, genre: story.genre_name ?? "", genreId: story.genre, synopsis: story.synopsis };
        draftRef.current = chapterDraft;
        setDraft(chapterDraft);
      })
      .catch(() => setPublishErrors({ general: "Unable to load the parent story." }));
  }, [chapterStoryId]);

  const persistDraft = useCallback((snapshot: WritingDraft, status: "draft" | "published") => {
    if (!snapshot.type) return Promise.reject(new Error("Choose poem or story before saving."));
    const editVersion = editVersionRef.current;
    pendingSavesRef.current += 1;
    setIsSaving(true);
    const request = persistenceQueueRef.current.catch(() => undefined).then(async () => {
      const payload = buildPayload(snapshot, status);
      const body = toRequestBody(payload, snapshot.coverImageFile);
      const currentId = Number(draftRef.current.id);
      const result = snapshot.type === "poem"
        ? currentId > 0 ? await updatePoem(currentId, body) : await createPoem(body)
        : currentId > 0 ? await updateStory(currentId, body) : await createStory(body);

      if (result && typeof result === "object" && "id" in result) {
        const id = String(result.id);
        const savedImage = "image" in result && typeof result.image === "string" ? getMediaUrl(result.image) : null;
        const uploadedFileUnchanged = Boolean(snapshot.coverImageFile && draftRef.current.coverImageFile === snapshot.coverImageFile && savedImage);
        const updatedDraft = {
          ...draftRef.current,
          id,
          lastSaved: new Date(),
          ...(uploadedFileUnchanged ? { coverImage: savedImage, coverImageFile: null } : {}),
        };
        draftRef.current = updatedDraft;
        setDraft((current) => ({ ...current, ...updatedDraft }));
        if (!(currentId > 0)) {
          const key = `${snapshot.type}:${id}`;
          hydratedDraftKeyRef.current = key;
          router.replace(`/write?type=${snapshot.type}&id=${id}`, { scroll: false });
        }
      }

      if (status === "draft" && editVersion === editVersionRef.current) {
        setIsDirty(false);
        setSaveError(null);
        setSaveSuccess("Draft saved.");
      }
      return result;
    });

    persistenceQueueRef.current = request.then(() => undefined, () => undefined);
    return request.finally(() => {
      pendingSavesRef.current = Math.max(0, pendingSavesRef.current - 1);
      setIsSaving(pendingSavesRef.current > 0);
    });
  }, [router]);

  useEffect(() => {
    if (chapterStoryId || isPublishing || !isDraftReady || !isDirty || !draft.type || (!draft.title && !draft.content)) return;
    const timer = setTimeout(() => {
      setSaveError(null);
      void persistDraft(draft, "draft").catch((saveFailure: unknown) => {
        setSaveError(saveFailure instanceof Error ? saveFailure.message : "Unable to save draft.");
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [chapterStoryId, draft, isDirty, isDraftReady, isPublishing, persistDraft]);

  const handleUpdateDraft = (updates: Partial<WritingDraft>) => {
    setSaveSuccess(null);
    setSaveError(null);
    editVersionRef.current += 1;
    const nextDraft = { ...draftRef.current, ...updates };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
    setIsDirty(true);
  };

  const validateDraft = (): PublishErrors => {
    const errors: PublishErrors = {};

    if (!draft.type) errors.type = "Please select whether you're creating a poem or story.";
    if (!draft.title.trim()) errors.title = "Title is required.";
    if (!draft.content.trim()) errors.content = "Please write some content before publishing.";
    if (!chapterStoryId && !draft.genreId) errors.genre = "Please select a genre.";
    if (!chapterStoryId && draft.type === "story" && !draft.synopsis.trim()) errors.synopsis = "Please add a synopsis.";

    return errors;
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    const validationErrors = validateDraft();
    if (Object.keys(validationErrors).length > 0) {
      setPublishErrors(validationErrors);
      if (validationErrors.title || validationErrors.content || validationErrors.type) {
        setPhase("writing");
      }
      return;
    }

    const contentType = draft.type;
    if (!contentType) return;

    setIsPublishing(true);
    setPublishErrors({});
    setPublishSuccess(null);
    setSaveError(null);
    setSaveSuccess(null);

    if (chapterStoryId && parentStory) {
      try {
        const chapter = await createChapter(chapterStoryId, { title: draft.title.trim(), content: draft.content }) as { slug: string };
        localStorage.removeItem(`chapter-draft:${parentStory.id}`);
        setPublishSuccess("Chapter published successfully.");
        router.push(`/stories/${parentStory.id}/${chapter.slug}`);
      } catch (publishError) {
        setPublishErrors({ general: publishError instanceof Error ? publishError.message : "Unable to publish chapter." });
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    startPublishing({
      type: contentType,
      payload: { title: draft.title.trim() },
      request: () => persistDraft(draftRef.current, "published"),
      onSuccess: (result) => {
        if (result && typeof result === "object" && "id" in result) {
          router.push(contentType === "story" ? `/stories/${result.id}` : `/poems/${result.id}`);
        }
      },
      onSettled: () => setIsPublishing(false),
    });
  };

  const handleSaveDraft = async () => {
    if (isSaving || !draft.type) return;

    if (chapterStoryId) {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(null);
      try {
        localStorage.setItem(`chapter-draft:${chapterStoryId}`, JSON.stringify({ title: draft.title, content: draft.content }));
        const chapterDraft = { ...draftRef.current, lastSaved: new Date() };
        draftRef.current = chapterDraft;
        setDraft(chapterDraft);
        setSaveSuccess("Chapter draft saved on this device.");
      } catch {
        setSaveError("Unable to save this chapter draft on this device.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    startSaving({
      type: draft.type,
      payload: { title: draft.title.trim() || (draft.type === "story" ? "Untitled Story" : "Untitled Poem") },
      request: () => persistDraft(draftRef.current, "draft"),
    });
  };

  if (!chapterStoryId && draftIdParam && !isDraftReady) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-600">Loading your draft...</div>;
  }

  if (!chapterStoryId && draftLoadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <p className="text-sm text-red-600" role="alert">{draftLoadError}</p>
        <button type="button" onClick={() => router.push("/library")} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">Back to Library</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {publishErrors.general && <p className="mx-auto max-w-5xl px-8 pt-6 text-sm text-red-600">{publishErrors.general}</p>}
      {chapterStoryId && parentStory && <p className="mx-auto max-w-5xl px-8 pt-6 text-sm font-semibold text-gray-600">Adding a chapter to {parentStory.title}</p>}
      {chapterStoryId || phase === "writing" ? (
        <WritingPhase
          draft={draft}
          onUpdateDraft={handleUpdateDraft}
          onPhaseChange={setPhase}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          chapterMode={Boolean(chapterStoryId)}
          isSaving={isSaving}
          isPublishing={isPublishing}
          saveError={saveError}
          saveSuccess={saveSuccess}
          publishErrors={publishErrors}
        />
      ) : (
        <MetadataPhase
          draft={draft}
          onUpdateDraft={handleUpdateDraft}
          onPhaseChange={setPhase}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
          isPublishing={isPublishing}
          saveError={saveError}
          saveSuccess={saveSuccess}
          publishErrors={publishErrors}
          publishSuccess={publishSuccess}
        />
      )}
    </div>
  );
}
