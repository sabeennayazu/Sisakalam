"use client";

import { useState } from "react";

type BrowseType = "trending" | "collections";

export default function BrowseMenu() {
  const [type, setType] = useState<BrowseType>("trending");

  return (
    <div className="absolute top-full pt-6">
      <div className="relative bg-slate-900 text-white rounded-2xl shadow-2xl w-[700px] p-6">

        {/* Arrow */}
        <div className="absolute -top-2 left-10 w-4 h-4 bg-slate-900 rotate-45"></div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6">
          <button
            onMouseEnter={() => setType("trending")}
            className={type === "trending" ? "border-b" : "opacity-60"}
          >
            Trending
          </button>

          <button
            onMouseEnter={() => setType("collections")}
            className={type === "collections" ? "border-b" : "opacity-60"}
          >
            Collections
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">

          {type === "trending" ? (
            <>
              <Column title="Popular" items={["Today", "This Week", "This Month"]} />
              <Column title="Rising" items={["New Voices", "Emerging", "Gaining Traction"]} />
              <Column title="Featured" items={["Editor Picks", "Staff Picks", "Recommended"]} />
            </>
          ) : (
            <>
              <Column title="Curated" items={["Best of Poetry", "Story Collections", "Must Read"]} />
              <Column title="Categories" items={["Most Viewed", "Highly Rated", "Recently Added"]} />
              <Column title="Special" items={["Award Winners", "Classics", "Hidden Gems"]} />
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