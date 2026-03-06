"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import ProfileCard from "./ProfileCard";

type ItemType = "story" | "poem";

interface LikedItem {
  id: number;
  title: string;
  author: string;
  genre: string;
  views: string;
  likes: number;
  comments: string;
  image: string;
  type: ItemType;
  date: string;
}

export default function LikedTab() {
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState<"all" | ItemType>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const items: LikedItem[] = [
    { id: 1, title: "Echoes of Silence", author: "Clara Thorne", genre: "Romanticism", views: "45M", likes: 1200, comments: "1.2K", image: "/images/covers/cover1.jpg", type: "poem", date: "2025-02-01" },
    { id: 2, title: "Hidden Path", author: "Arlo Finch", genre: "Mystery", views: "1.1M", likes: 800, comments: "400", image: "/images/covers/cover2.jpg", type: "story", date: "2025-01-12" },
    { id: 3, title: "Melodies of May", author: "Elena Rousseau", genre: "Lyric", views: "33M", likes: 3000, comments: "2.1K", image: "/images/covers/cover5.jpg", type: "poem", date: "2024-12-21" },
    { id: 4, title: "The Burning Road", author: "Rhea Novak", genre: "Action", views: "17.7M", likes: 1400, comments: "890", image: "/images/covers/cover3.jpg", type: "story", date: "2024-11-08" }
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

  // The internal Card function was fully removed since ProfileCard has selection support out-of-the-box.

  return (
    <div className="space-y-8 py-4">

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border text-sm text-black  px-3 py-2 rounded-md"
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
          </select>

          {/* Type Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border text-sm text-black px-3 py-2 rounded-md"
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
              className="text-sm text-black border px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Select
            </button>
          )}

          {selectionMode && (
            <>
              <button
                onClick={selectAll}
                className="text-sm text-black border px-4 py-2 rounded-md"
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

        {filtered.map((item) => (
          <ProfileCard
             key={item.id}
             id={item.id}
             title={item.title}
             author={item.author}
             genre={item.genre}
             image={item.image}
             views={item.views}
             likes={item.likes}
             comments={item.comments}
             type={item.type}
             selectionMode={selectionMode}
             isSelected={selected.includes(item.id)}
             onToggleSelect={toggleSelect}
             showBookmark={false}
          />
        ))}

      </div>

    </div>
  );
}