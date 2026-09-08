"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WritingPhase from "@/components/Writing/WritingPhase";
import MetadataPhase from "@/components/Writing/MetadataPhase";
import { startPublishing, startSaving } from "@/components/loader/UploadModal";

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

const DRAFT_STORAGE_KEY = "writing-draft";

export default function WritePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("writing");
  const [draft, setDraft] = useState<WritingDraft>({
    id: Date.now().toString(),
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishErrors, setPublishErrors] = useState<PublishErrors>({});
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setDraft({
          ...parsed,
          lastSaved: new Date(parsed.lastSaved),
        });
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // Autosave draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (draft.title || draft.content) {
        setIsSaving(true);
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            ...draft,
            lastSaved: new Date(),
          })
        );
        setDraft((prev) => ({
          ...prev,
          lastSaved: new Date(),
        }));
        setIsSaving(false);
      }
    }, 1500); // Autosave after 1.5 seconds of inactivity

    return () => clearTimeout(timer);
  }, [draft]);

  const handleUpdateDraft = (updates: Partial<WritingDraft>) => {
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
    if (!draft.genreId) errors.genre = "Please select a genre.";
    if (draft.type === "story" && !draft.synopsis.trim()) errors.synopsis = "Please add a synopsis.";

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

    const payload = contentType === "poem"
      ? { title: draft.title.trim(), content: draft.content, genre: draft.genreId, tags: draft.tags, is_mature: draft.matureContent, status: "published" }
      : { title: draft.title.trim(), synopsis: draft.synopsis.trim(), genre: draft.genreId, tags: draft.tags, is_mature: draft.matureContent, status: "published" };

    startPublishing({ type: contentType, payload });
    router.back();
  };

  const handleSaveDraft = async () => {
    if (isSaving || !draft.type) return;

    const payload = draft.type === "poem"
      ? {
          title: draft.title.trim() || "Untitled Poem",
          content: draft.content,
          genre: draft.genreId,
          tags: draft.tags,
          is_mature: draft.matureContent,
          status: "draft",
        }
      : {
          title: draft.title.trim() || "Untitled Story",
          synopsis: draft.synopsis.trim(),
          genre: draft.genreId,
          tags: draft.tags,
          is_mature: draft.matureContent,
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
      {phase === "writing" ? (
        <WritingPhase
          draft={draft}
          onUpdateDraft={handleUpdateDraft}
          onPhaseChange={setPhase}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
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
