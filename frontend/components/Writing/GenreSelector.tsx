"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

interface GenreSelectorProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function GenreSelector({
  options,
  value,
  onChange,
  placeholder = "Search or select a genre...",
  disabled = false,
}: GenreSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update search term when value changes or dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen && e.key !== "Escape") {
      setIsOpen(true);
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={`flex items-center w-full px-4 py-3 border rounded-lg bg-white overflow-hidden transition-colors ${
          isOpen
            ? "border-black ring-1 ring-black"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "cursor-text"}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="flex-1 flex flex-wrap gap-2 mr-2">
          {value && !isOpen ? (
            <div className="flex items-center rounded text-sm text-gray-900 border-none bg-transparent">
              {value}
            </div>
          ) : null}
          <input
            type="text"
            className={`flex-1 min-w-[50px] bg-transparent outline-none text-gray-900 text-sm placeholder-gray-500 ${
              value && !isOpen ? "w-0 h-0 opacity-0 absolute" : "w-full"
            }`}
            placeholder={value && !isOpen ? "" : placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => !disabled && setIsOpen(true)}
            disabled={disabled}
          />
        </div>
        <div className="flex-shrink-0 text-gray-400">
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer ${
                    index === activeIndex
                      ? "bg-gray-100 text-black"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${value === option ? "font-semibold bg-gray-50 text-black" : ""}`}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No genres found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
