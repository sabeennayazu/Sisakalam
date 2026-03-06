"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WritingDraft, Phase } from "@/app/write/page";
import GenreSelector from "./GenreSelector";
import TagInput from "./TagInput";

interface MetadataPhaseProps {
  draft: WritingDraft;
  onUpdateDraft: (updates: Partial<WritingDraft>) => void;
  onPhaseChange: (phase: Phase) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  isSaving: boolean;
}

const STORY_GENRES = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Historical",
  "Contemporary",
  "Drama",
  "Comedy",
  "Adventure",
];

const POEM_GENRES = [
  "Haiku",
  "Free Verse",
  "Sonnet",
  "Narrative",
  "Lyrical",
  "Experimental",
];

export default function MetadataPhase({
  draft,
  onUpdateDraft,
  onPhaseChange,
  onPublish,
  onSaveDraft,
  isSaving,
}: MetadataPhaseProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(
    draft.coverImage
  );

  const isStory = draft.type === "story";
  const isPoem = draft.type === "poem";

  const genres = isStory ? STORY_GENRES : POEM_GENRES;

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        onUpdateDraft({ coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const canPublish = isStory ? draft.genre && draft.type : draft.type;

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className=" py-16 ">
        
    

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* LEFT COLUMN - COVER & PREVIEW */}
          <div className="md:col-span-1">
            {/* COVER IMAGE */}
            
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Cover Image
                </h3>
                <div className="relative aspect-2/3 bg-gray-200 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 group cursor-pointer hover:border-gray-400 transition-colors">
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-xs text-gray-600">Upload cover image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Choose Image
                </button>
              </div>
            

            {/* QUICK PREVIEW */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {isStory ? "Story" : "Poem"} Preview
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    Title
                  </p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {draft.title || `Untitled ${isStory ? "Story" : "Poem"}`}
                  </p>
                </div>
                {isStory && (
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                      Genre
                    </p>
                    <p className="text-sm text-gray-700">
                      {draft.genre || "Not selected"}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {draft.tags.length > 0 ? (
                      draft.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No tags selected</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    Content Type
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    {draft.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - FORM */}
          <div className="md:col-span-2 space-y-8">
            {/* GENRE (REQUIRED FOR STORIES, OPTIONAL FOR POEMS) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Genre {isStory && <span className="text-red-500">*</span>}
              </label>
              <GenreSelector
                options={genres}
                value={draft.genre}
                onChange={(val) => onUpdateDraft({ genre: val })}
                placeholder={isStory ? "Select a genre" : "Select a genre (optional)"}
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Tags (up to 8)
              </label>
              <TagInput
                tags={draft.tags}
                onChange={(tags) => onUpdateDraft({ tags })}
                maxTags={8}
                placeholder="Type a tag and press Enter..."
              />
            </div>

            {/* SYNOPSIS (ONLY FOR STORIES) */}
            {isStory && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Synopsis
                </label>
                <textarea
                  value={draft.synopsis}
                  onChange={(e) => onUpdateDraft({ synopsis: e.target.value })}
                  placeholder="Write a compelling synopsis (200-500 words recommended)"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-900 placeholder-gray-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {draft.synopsis.length} characters
                </p>
              </div>
            )}

            {/* MATURE CONTENT */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Mature Content
              </label>
              <div className="space-y-3">
                {[
                  { label: "No", value: false },
                  {
                    label: "Yes (contains explicit content)",
                    value: true,
                  },
                ].map((option) => (
                  <label
                    key={String(option.value)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mature"
                      checked={draft.matureContent === option.value}
                      onChange={() =>
                        onUpdateDraft({ matureContent: option.value })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* VISIBILITY */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Visibility
              </label>
              <div className="space-y-3">
                {[
                  {
                    label: "Draft",
                    value: "draft" as const,
                    description: "Only visible to you",
                  },
                  {
                    label: "Private",
                    value: "private" as const,
                    description: "Shareable via link",
                  },
                  {
                    label: "Public",
                    value: "public" as const,
                    description: "Visible to everyone",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={draft.visibility === option.value}
                      onChange={() =>
                        onUpdateDraft({ visibility: option.value })
                      }
                      className="w-4 h-4 mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex gap-4 justify-between">
            <button
              onClick={() => onPhaseChange("writing")}
              className="px-8 py-3 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              ← Previous
            </button>
            <div className="flex gap-4">
              <button
                onClick={onSaveDraft}
                disabled={isSaving}
                className="px-8 py-3 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 rounded-full transition-colors"
              >
                {isSaving ? "Saving..." : "Save as Draft"}
              </button>
              <button
                onClick={onPublish}
                disabled={!canPublish || isSaving}
                className="px-8 py-3 font-medium text-white bg-black hover:bg-gray-900 disabled:bg-gray-300 rounded-full transition-colors"
              >
                {isSaving
                  ? "Publishing..."
                  : `Publish ${isStory ? "Story" : "Poem"}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
  );
}
