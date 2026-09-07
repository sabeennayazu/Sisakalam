"use client";

import React, { useState, useEffect } from "react";
import WritingPhase from "@/components/Writing/WritingPhase";
import MetadataPhase from "@/components/Writing/MetadataPhase";
import { createPoem } from "@/utils/poems.api";
import { createStory } from "@/utils/stories.api";

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

    setIsPublishing(true);
    setPublishErrors({});
    setPublishSuccess(null);

    try {
      if (draft.type === "poem") {
        await createPoem({
          title: draft.title.trim(),
          content: draft.content,
          genre: draft.genreId,
          tags: draft.tags,
          is_mature: draft.matureContent,
          status: "published",
        });
      } else {
        await createStory({
          title: draft.title.trim(),
          synopsis: draft.synopsis.trim(),
          genre: draft.genreId,
          tags: draft.tags,
          is_mature: draft.matureContent,
          status: "published",
        });
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setPublishSuccess(`${draft.type === "poem" ? "Poem" : "Story"} published successfully.`);
    } catch (error: unknown) {
      const details = error && typeof error === "object" && "details" in error
        ? (error as { details?: unknown }).details
        : null;
      const backendErrors: PublishErrors = {};
      if (details && typeof details === "object") {
        const responseDetails = details as Record<string, unknown>;
        for (const field of ["title", "content", "genre", "synopsis"] as const) {
          const value = responseDetails[field];
          if (Array.isArray(value) && value.length > 0) backendErrors[field] = String(value[0]);
          else if (typeof value === "string") backendErrors[field] = value;
        }
        const general = responseDetails.detail ?? responseDetails.message;
        if (typeof general === "string") backendErrors.general = general;
      }
      setPublishErrors(
        Object.keys(backendErrors).length > 0
          ? backendErrors
          : { general: error instanceof Error ? error.message : "Unable to publish. Please try again." }
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // TODO: Send to backend API for persistent storage
    setTimeout(() => {
      setIsSaving(false);
      alert("Draft saved! (Mock)");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
      {phase === "writing" ? (
        <WritingPhase
          draft={draft}
          onUpdateDraft={handleUpdateDraft}
          onPhaseChange={setPhase}
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
