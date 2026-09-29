"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WritingPhase from "@/components/Writing/WritingPhase";
import MetadataPhase from "@/components/Writing/MetadataPhase";
import { startPublishing, startSaving } from "@/components/loader/UploadModal";
import { createChapter, createStory, getStory, updateStory } from "@/utils/stories.api";
import { createPoem, updatePoem } from "@/utils/poems.api";
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
  matureContent: boolean;
  visibility: "draft" | "public" | "private";
  lastSaved: Date;
}

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterStoryId = searchParams.get("mode") === "chapter" ? searchParams.get("storyId") : null;
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
        setDraft((current) => ({ ...current, ...savedChapterDraft, type: "story", title: savedChapterDraft.title || `Chapter ${story.chapter_count + 1}`, genre: story.genre_name ?? "", genreId: story.genre, synopsis: story.synopsis }));
      })
      .catch(() => setPublishErrors({ general: "Unable to load the parent story." }));
  }, [chapterStoryId]);

  // Debounced authenticated autosave for standalone drafts.
  useEffect(() => {
    if (chapterStoryId || !draft.type) return;
    const timer = setTimeout(() => {
      if (draft.title || draft.content) {
        setIsSaving(true);
        setSaveError(null);
        const payload = draft.type === "poem"
          ? { title: draft.title.trim() || "Untitled Poem", content: draft.content, genre: draft.genreId, tags: draft.tags, is_mature: draft.matureContent, is_private: draft.visibility === "private", status: "draft" }
          : { title: draft.title.trim() || "Untitled Story", synopsis: draft.synopsis.trim(), genre: draft.genreId, tags: draft.tags, is_mature: draft.matureContent, is_private: draft.visibility === "private", status: "draft" };
        const draftId = Number(draft.id);
        const request = draftId > 0
          ? draft.type === "poem" ? updatePoem(draftId, payload) : updateStory(draftId, payload)
          : draft.type === "poem" ? createPoem(payload) : createStory(payload);
        void request.then((result) => {
          if (result && typeof result === "object" && "id" in result) setDraft((current) => ({ ...current, id: String(result.id), lastSaved: new Date() }));
        }).catch((saveFailure) => setSaveError(saveFailure instanceof Error ? saveFailure.message : "Unable to save draft.")).finally(() => setIsSaving(false));
      }
    }, 1500); // Autosave after 1.5 seconds of inactivity

    return () => clearTimeout(timer);
  }, [chapterStoryId, draft]);

  const handleUpdateDraft = (updates: Partial<WritingDraft>) => {
    setSaveSuccess(null);
    setSaveError(null);
    setDraft((prev) => ({
      ...prev,
      ...updates,
    }));
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

    const payload = contentType === "poem"
      ? { title: draft.title.trim(), content: draft.content, genre: draft.genreId, tags: draft.tags, is_mature: draft.matureContent, is_private: draft.visibility === "private", status: "published" }
      : { title: draft.title.trim(), content: draft.content, synopsis: draft.synopsis.trim(), genre: draft.genreId, tags: draft.tags, is_mature: draft.matureContent, is_private: draft.visibility === "private", status: "published" };

    const draftId = Number(draft.id);
    startPublishing({
      type: contentType,
      payload,
      request: draftId > 0
        ? () => contentType === "poem" ? updatePoem(draftId, payload) : updateStory(draftId, payload)
        : undefined,
      onSuccess: (result) => {
        if (result && typeof result === "object" && "id" in result) {
          router.push(contentType === "story" ? `/stories/${result.id}` : `/poems/${result.id}`);
        }
      },
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
        setDraft((current) => ({ ...current, lastSaved: new Date() }));
        setSaveSuccess("Chapter draft saved on this device.");
      } catch {
        setSaveError("Unable to save this chapter draft on this device.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    const payload = draft.type === "poem"
      ? {
          title: draft.title.trim() || "Untitled Poem",
          content: draft.content,
          genre: draft.genreId,
          tags: draft.tags,
          is_mature: draft.matureContent,
          is_private: draft.visibility === "private",
          status: "draft",
        }
      : {
          title: draft.title.trim() || "Untitled Story",
          synopsis: draft.synopsis.trim(),
          genre: draft.genreId,
          tags: draft.tags,
          is_mature: draft.matureContent,
          is_private: draft.visibility === "private",
          status: "draft",
        };

    setIsSaving(true);
    startSaving({
      type: draft.type,
      payload,
      onSuccess: (result) => {
        if (result && typeof result === "object" && "id" in result) {
          setDraft((current) => ({
            ...current,
            id: String(result.id),
            lastSaved: new Date(),
          }));
        }
      },
      onSettled: () => setIsSaving(false),
    });
  };

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
          publishErrors={publishErrors}
          publishSuccess={publishSuccess}
        />
      )}
    </div>
  );
}
