"use client";

import React from "react";

interface PoemContentProps {
  content: string;
}

export default function PoemContent({ content }: PoemContentProps) {
  return (
    <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed italic whitespace-pre-line text-lg">
      {content}
    </div>
  );
}
