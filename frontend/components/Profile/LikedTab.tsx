"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type ItemType = "story" | "poem";

interface LikedItem {
  id: number;
  title: string;
  author: string;
  type: ItemType;
  date: string;
}

export default function LikedTab() {
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState<"all" | ItemType>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const items: LikedItem[] = [
    { id: 1, title: "Echoes of Silence", author: "Clara Thorne", type: "poem", date: "2025-02-01" },
    { id: 2, title: "Hidden Path", author: "Arlo Finch", type: "story", date: "2025-01-12" },
    { id: 3, title: "Melodies of May", author: "Elena Rousseau", type: "poem", date: "2024-12-21" },
    { id: 4, title: "The Burning Road", author: "Rhea Novak", type: "story", date: "2024-11-08" }
  ];

  const filtered = items
    .filter((i) => filter === "all" || i.type === filter)
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectAll = () => {
    setSelected(filtered.map((i) => i.id));
  };

  const clearSelection = () => {
    setSelected([]);
    setSelectionMode(false);
  };

  const deleteSelected = () => {
    console.log("Deleting", selected);
    clearSelection();
  };

  const Card = ({ item }: { item: LikedItem }) => (
    <div className="relative">

      {selectionMode && (
        <input
          type="checkbox"
          checked={selected.includes(item.id)}
          onChange={() => toggleSelect(item.id)}
          className="absolute top-3 left-3 z-10"
        />
      )}

      <div className="rounded-xl overflow-hidden bg-gray-100 h-72 mb-3"></div>

      <p className="text-xs text-gray-500 capitalize">{item.type}</p>

      <h3 className="font-serif text-sm text-black">{item.title}</h3>

      <p className="text-xs text-gray-500">{item.author}</p>
    </div>
  );

  return (
    <div className="space-y-8 py-4">

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border text-sm px-3 py-2 rounded-md"
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
          </select>

          {/* Type Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border text-sm px-3 py-2 rounded-md"
          >
            <option value="all">All Content</option>
            <option value="story">Stories</option>
            <option value="poem">Poems</option>
          </select>

        </div>

        {/* Selection Controls */}
        <div className="flex items-center gap-3">

          {!selectionMode && (
            <button
              onClick={() => setSelectionMode(true)}
              className="text-sm border px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Select
            </button>
          )}

          {selectionMode && (
            <>
              <button
                onClick={selectAll}
                className="text-sm border px-4 py-2 rounded-md"
              >
                Select All
              </button>

              {selected.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-2 text-sm px-4 py-2 bg-black text-white rounded-md"
                >
                  <Trash2 size={16} />
                  Delete ({selected.length})
                </button>
              )}

              <button
                onClick={clearSelection}
                className="text-sm px-3 py-2 text-gray-500"
              >
                Cancel
              </button>
            </>
          )}

        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {filtered.map((item) => (
          <Card key={item.id} item={item} />
        ))}

      </div>

    </div>
  );
}