"use client";

import React from "react";

interface PoemTableOfContentsProps {
  content: string;
}

export default function PoemTableOfContents({
  content,
}: PoemTableOfContentsProps) {
  return (
    <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed italic whitespace-pre-line text-lg">
      {content}
    </div>
  );
}
