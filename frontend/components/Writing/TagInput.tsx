"use client";

import React, { useState, KeyboardEvent, useRef } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  disabled?: boolean;
}

export default function TagInput({
  tags,
  onChange,
  maxTags = 8,
  placeholder = "Add a tag and press Enter...",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "") {
      // Remove last tag if input is empty
      if (tags.length > 0) {
        onChange(tags.slice(0, -1));
      }
    }
  };

  const addTag = () => {
    // 1. Trim whitespace
    let newTag = inputValue.trim();
    if (!newTag) return;

    // 2. Convert to lowercase
    newTag = newTag.toLowerCase();

    // 3. Prevent duplicates
    if (tags.includes(newTag)) {
      setInputValue("");
      return;
    }

    // 4. Enforce limit
    if (tags.length >= maxTags) {
      return;
    }

    // Add tag
    onChange([...tags, newTag]);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    if (disabled) return;
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const focusInput = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`w-full flex flex-wrap gap-2 px-3 py-2 border rounded-lg bg-white transition-colors cursor-text focus-within:ring-2 focus-within:ring-black focus-within:border-black ${
        disabled
          ? "opacity-60 cursor-not-allowed bg-gray-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onClick={focusInput}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full"
        >
          {tag}
          <button
            type="button"
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            disabled={disabled}
            aria-label={`Remove tag ${tag}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length >= maxTags ? `Max ${maxTags} tags reached` : placeholder}
        disabled={disabled || tags.length >= maxTags}
        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-gray-900 placeholder-gray-500 py-1"
      />
    </div>
  );
}
