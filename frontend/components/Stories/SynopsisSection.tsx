"use client";

import React from "react";

interface SynopsisSectionProps {
  synopsis: string;
}

export default function SynopsisSection({ synopsis }: SynopsisSectionProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed">{synopsis}</p>
    </div>
  );
}
