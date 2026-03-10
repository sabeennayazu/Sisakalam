"use client";

import React from "react";

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  align?: "center" | "start";
}

export default function SettingItem({ label, description, children, align = "center" }: SettingItemProps) {
  return (
    <div className={`flex flex-col sm:flex-row ${align === "center" ? "sm:items-center" : "sm:items-start"} justify-between py-4 gap-4`}>
      <div className="max-w-xl">
        <h4 className="text-sm font-semibold text-black mb-1">{label}</h4>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex shrink-0">
        {children}
      </div>
    </div>
  );
}
