"use client";

import EmptyTabState from "./EmptyTabState";
import type { ProfileContent } from "@/utils/profile.api";

interface WorksTabProps {
  poems: ProfileContent[] | null;
  stories: ProfileContent[] | null;
  loading: boolean;
  error: string | null;
}

export default function WorksTab({ poems, stories, loading, error }: WorksTabProps) {
  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Loading your works...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-sm text-red-500">{error}</div>;
  }

  const totalPoems = poems?.length ?? 0;
  const totalStories = stories?.length ?? 0;

  if (totalPoems === 0 && totalStories === 0) {
    return (
      <EmptyTabState
        message="You haven't created any works yet. Start writing your first poem or story to build your creative journey."
        actionLabel="Create a Work"
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl border border-gray-200 bg-gray-50 p-8 text-center">
      <h2 className="font-serif text-xl font-bold text-black">Work Analytics</h2>
      <p className="mt-3 text-sm text-gray-600">Your work analytics are currently being developed.</p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Stat label="Total Poems" value={totalPoems} />
        <Stat label="Total Stories" value={totalStories} />
        <Stat label="Total Works" value={totalPoems + totalStories} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-bold text-black">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
    </div>
  );
}
