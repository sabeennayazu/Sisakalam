"use client";

import { useMemo, useState } from "react";
import UniversalCard from "@/components/shared/UniversalCard";
import type { ProfileContent, ProfileContentType } from "@/utils/profile.api";
import EmptyTabState from "./EmptyTabState";

interface LikedTabProps {
  items: ProfileContent[] | null;
  loading: boolean;
  error: string | null;
}

export default function LikedTab({ items, loading, error }: LikedTabProps) {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [filter, setFilter] = useState<"all" | ProfileContentType>("all");

  const filtered = useMemo(() => {
    const content = items ?? [];
    return [...content]
      .filter((item) => filter === "all" || item.type === filter)
      .sort((a, b) => sort === "newest" ? b.id - a.id : a.id - b.id);
  }, [items, filter, sort]);

  if (loading) return <div className="py-16 text-center text-sm text-gray-500">Loading your liked posts...</div>;
  if (error) return <div className="py-16 text-center text-sm text-red-500">{error}</div>;
  if (!items?.length) return <EmptyTabState message="You haven't liked anything yet." />;

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "oldest")} className="border px-3 py-2 text-sm text-black">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <select value={filter} onChange={(event) => setFilter(event.target.value as "all" | ProfileContentType)} className="border px-3 py-2 text-sm text-black">
            <option value="all">All Content</option>
            <option value="story">Stories</option>
            <option value="poem">Poems</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-items-center gap-6 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:gap-8">
        {filtered.map((item) => <UniversalCard key={`${item.type}-${item.id}`} {...item} type={item.type} showBookmark={false} />)}
      </div>
    </div>
  );
}
