"use client";

import UniversalCard from "@/components/shared/UniversalCard";
import type { ProfileContent } from "@/utils/profile.api";
import EmptyTabState from "./EmptyTabState";

interface SavedTabProps {
  items: ProfileContent[] | null;
  loading: boolean;
  error: string | null;
}

export default function SavedTab({ items, loading, error }: SavedTabProps) {
  if (loading) return <div className="py-16 text-center text-sm text-gray-500">Loading your bookmarks...</div>;
  if (error) return <div className="py-16 text-center text-sm text-red-500">{error}</div>;
  if (!items?.length) return <EmptyTabState message="You haven't bookmarked anything yet." />;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="font-serif text-xl font-bold text-black">Bookmarks</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{items.length} Items</span>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-8">
        {items.map((item) => <UniversalCard key={`${item.type}-${item.id}`} {...item} showBookmark={false} />)}
      </div>
    </div>
  );
}
