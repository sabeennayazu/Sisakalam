"use client";

import React, { useState, useEffect } from "react";
import WritingPhase from "@/components/Writing/WritingPhase";
import MetadataPhase from "@/components/Writing/MetadataPhase";

export type ContentType = "story" | "poem";
export type Phase = "writing" | "metadata";

export interface WritingDraft {
  id: string;
  type: ContentType | null;
  title: string;
  content: string;
  genre: string;
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
    tags: [],
    synopsis: "",
    coverImage: null,
    matureContent: false,
    visibility: "draft",
    lastSaved: new Date(),
  });

  const [isSaving, setIsSaving] = useState(false);

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

  const handlePublish = async () => {
    // TODO: Send to backend API
    console.log("Publishing content:", draft);
    alert(`${draft.type} published! (Mock)`);
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
        />
      ) : (
        <MetadataPhase
          draft={draft}
          onUpdateDraft={handleUpdateDraft}
          onPhaseChange={setPhase}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
