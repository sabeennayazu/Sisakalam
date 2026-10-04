"use client";

import UniversalCard from "@/components/shared/UniversalCard";
import type { ProfileContent } from "@/utils/profile.api";
import EmptyTabState from "./EmptyTabState";

interface PoemsTabProps {
  poems: ProfileContent[] | null;
  loading: boolean;
  error: string | null;
  isOwner: boolean;
  viewerId: number;
  onDelete: (item: ProfileContent) => Promise<void>;
  onTogglePrivacy: (item: ProfileContent) => Promise<void>;
}

export default function PoemsTab({ poems, loading, error, isOwner, viewerId, onDelete, onTogglePrivacy }: PoemsTabProps) {
  if (loading) return <div className="py-16 text-center text-sm text-gray-500">Loading {isOwner ? "your" : "this user's"} poems...</div>;
  if (error) return <div className="py-16 text-center text-sm text-red-500">{error}</div>;
  if (!poems?.length) return <EmptyTabState message={isOwner ? "You haven't posted any poems yet." : "This user hasn't published any poems yet."} actionLabel={isOwner ? "Post a Poem" : undefined} />;

  return <ContentGrid title="All Poems" items={poems} viewerId={viewerId} onDelete={onDelete} onTogglePrivacy={onTogglePrivacy} />;
}

function ContentGrid({ title, items, viewerId, onDelete, onTogglePrivacy }: { title: string; items: ProfileContent[]; viewerId: number; onDelete: (item: ProfileContent) => Promise<void>; onTogglePrivacy: (item: ProfileContent) => Promise<void> }) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="font-serif text-xl font-bold text-black">{title}</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{items.length} Works</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-items-center gap-6 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:gap-8">
        {items.map((item) => <UniversalCard key={`${item.type}-${item.id}`} {...item} isOwner={item.authorId === viewerId} isPrivate={item.isPrivate} onDeleteContent={() => onDelete(item)} onTogglePrivacy={() => onTogglePrivacy(item)} />)}
      </div>
    </div>
  );
}
