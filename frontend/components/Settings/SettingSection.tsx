"use client";

import React from "react";

interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}

export default function SettingSection({ title, description, children, danger = false }: SettingSectionProps) {
  return (
    <section className={`mb-12 ${danger ? "border border-red-100 rounded-xl p-6 bg-red-50/10" : ""}`}>
      <div className="mb-6">
        <h3 className={`text-lg font-bold font-serif ${danger ? "text-red-600" : "text-black"}`}>
          {title}
        </h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="divide-y divide-gray-100 italic">
        {children}
      </div>
    </section>
  );
}
