"use client";

import UniversalCard from "@/components/shared/UniversalCard";
import type { ProfileContent } from "@/utils/profile.api";
import EmptyTabState from "./EmptyTabState";

interface StoriesTabProps {
  stories: ProfileContent[] | null;
  loading: boolean;
  error: string | null;
}

export default function StoriesTab({ stories, loading, error }: StoriesTabProps) {
  if (loading) return <div className="py-16 text-center text-sm text-gray-500">Loading your stories...</div>;
  if (error) return <div className="py-16 text-center text-sm text-red-500">{error}</div>;
  if (!stories?.length) return <EmptyTabState message="You haven't posted any stories yet." actionLabel="Post a Story" />;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="font-serif text-xl font-bold text-black">All Stories</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{stories.length} Works</span>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-8">
        {stories.map((item) => <UniversalCard key={`${item.type}-${item.id}`} {...item} />)}
      </div>
    </div>
  );
}
