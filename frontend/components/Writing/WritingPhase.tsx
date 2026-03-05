"use client";

import React, { useRef, useEffect } from "react";
import { WritingDraft, ContentType, Phase } from "@/app/write/page";

interface WritingPhaseProps {
  draft: WritingDraft;
  onUpdateDraft: (updates: Partial<WritingDraft>) => void;
  onPhaseChange: (phase: Phase) => void;
  isSaving: boolean;
}

export default function WritingPhase({
  draft,
  onUpdateDraft,
  onPhaseChange,
  isSaving,
}: WritingPhaseProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, [draft.content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateDraft({ title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateDraft({ content: e.target.value });
  };

  const handleContentTypeSelect = (type: ContentType) => {
    onUpdateDraft({ type });
  };

  const wordCount = draft.content
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const canContinue = draft.type && draft.title && draft.content;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="py-12 ">
         
     

      {/* EDITOR CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-12">
            {/* CONTENT TYPE TOGGLE */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  {draft.type ? `Writing a ${draft.type === "story" ? "Story" : "Poem"}` : "What do you want to create?"}
                </h1>
              </div>
              <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1 mb-12">
                <button
                  onClick={() => handleContentTypeSelect("story")}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    draft.type === "story"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                   Story
                </button>
                <button
                  onClick={() => handleContentTypeSelect("poem")}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    draft.type === "poem"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                   Poem
                </button>
              </div>
            </div>

            {/* TITLE */}
            {draft.type && (
              <>
                <input
                  ref={titleRef}
                  type="text"
                  placeholder={`${draft.type === "story" ? "Story" : "Poem"} Title`}
                  value={draft.title}
                  onChange={handleTitleChange}
                  className="w-full text-5xl pl-4 font-serif font-bold text-gray-900 border-l-4 border-gray-300 placeholder-gray-300 focus:outline-none mb-8 bg-transparent"
                />

                {/* CONTENT */}
                <textarea
                  ref={contentRef}
                  placeholder={
                    draft.type === "story"
                      ? "Start writing your story. Write freely without worrying about formatting or publishing details..."
                      : "Write your poem. Let your words flow freely..."
                  }
                  value={draft.content}
                  onChange={handleContentChange}
                  className="w-full text-lg leading-relaxed text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent resize-none font-serif"
                  style={{ minHeight: "500px" }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING TOOLBAR */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {draft.type && (
              <>
                <span className="font-semibold">{wordCount}</span> words
              </>
            )}
          </div>
           {isSaving && (
              <span className="text-xs text-gray-500 animate-pulse">
                Saving...
              </span>
            )}
            {!isSaving && draft.lastSaved && (
              <span className="text-xs text-gray-400">
                Saved at{" "}
                {draft.lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}

          <div className="flex gap-3">
            <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              Save as Draft
            </button>
            <button
              onClick={() => onPhaseChange("metadata")}
              disabled={!canContinue}
              className="px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-900 disabled:bg-gray-300 rounded-full transition-colors"
            >
              Continue to Settings →
            </button>
          </div>
        </div>
      </div>
    </div>
     </div>
  );
}
