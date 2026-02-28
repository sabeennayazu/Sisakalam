"use client";

import { useState } from "react";

type GenreType = "poems" | "stories";

export default function MegaMenu() {
  const [type, setType] = useState<GenreType>("poems");

  return (
    <div className="absolute top-full pt-6">
      <div className="relative bg-slate-900 text-white rounded-2xl shadow-2xl w-[700px] p-6">

        {/* Arrow */}
        <div className="absolute -top-2 left-10 w-4 h-4 bg-slate-900 rotate-45"></div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6">
          <button
            onMouseEnter={() => setType("poems")}
            className={type === "poems" ? "border-b" : "opacity-60"}
          >
            Poems
          </button>

          <button
            onMouseEnter={() => setType("stories")}
            className={type === "stories" ? "border-b" : "opacity-60"}
          >
            Stories
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">

          {type === "poems" ? (
            <>
              <Column title="Classic" items={["Love","Nature","Life"]}/>
              <Column title="Modern" items={["Free Verse","Dark","Hope"]}/>
              <Column title="Mood" items={["Sad","Motivation"]}/>
            </>
          ) : (
            <>
              <Column title="Fiction" items={["Fantasy","Sci-Fi","Horror"]}/>
              <Column title="Realistic" items={["Drama","Urban"]}/>
              <Column title="Audience" items={["Teen","Romance"]}/>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function Column({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <ul className="space-y-1 opacity-80">
        {items.map((i) => (
          <li key={i} className="hover:text-white cursor-pointer">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}