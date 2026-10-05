"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Feather, LoaderCircle, Search } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { searchContent, type SearchResponse } from "@/utils/search.api";

interface SearchPopupProps {
  query?: string;
  onClose?: () => void;
}

interface SearchState {
  query: string;
  results?: SearchResponse;
  error?: string;
}

export default function SearchPopup({ query = "", onClose }: SearchPopupProps) {
  const trimmedQuery = query.trim();
  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const currentState = searchState?.query === trimmedQuery ? searchState : null;
  const isLoading = Boolean(trimmedQuery && !currentState);
  const results = currentState?.results;

  useEffect(() => {
    if (!trimmedQuery) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void searchContent(trimmedQuery, { limit: 3, signal: controller.signal })
        .then((response) => setSearchState({ query: trimmedQuery, results: response }))
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setSearchState({
              query: trimmedQuery,
              error: error instanceof Error ? error.message : "Search is unavailable right now.",
            });
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  const empty = Boolean(results && results.total === 0);

  return (
    <div className="w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/10 bg-white text-black shadow-[0_12px_40px_rgba(0,0,0,0.14)]" role="region" aria-label="Search suggestions">
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
        <Search size={16} strokeWidth={1.8} className="shrink-0 text-black/45" />
        <p className="min-w-0 flex-1 truncate text-[13px] text-black/65">{trimmedQuery || "Type to search Sisakalam"}</p>
        {onClose && <button type="button" onClick={onClose} aria-label="Close search" className="flex h-7 w-7 items-center justify-center text-black/50 hover:bg-black/5 hover:text-black">×</button>}
      </div>

      {!trimmedQuery ? (
        <p className="px-4 py-6 text-center text-xs text-black/45">Search stories, poems, and writers.</p>
      ) : isLoading ? (
        <div className="flex items-center justify-center gap-2 px-4 py-8 text-xs text-black/45" role="status"><LoaderCircle size={14} className="animate-spin" /> Searching</div>
      ) : currentState?.error ? (
        <p className="px-4 py-6 text-center text-xs text-black/55" role="status">{currentState.error}</p>
      ) : empty ? (
        <p className="px-4 py-8 text-center text-xs text-black/55">No results found</p>
      ) : results ? (
        <div className="max-h-[min(60vh,430px)] overflow-y-auto">
          {results.stories.length > 0 && <section aria-label="Stories">
            <h2 className="border-b border-black/[0.07] px-4 pb-2 pt-3 text-[9px] font-semibold uppercase text-black/45">Stories</h2>
            {results.stories.map((item) => <Link key={item.id} href={`/stories/${item.id}`} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-black/[0.035]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-black/10 bg-black/[0.025]"><BookOpen size={15} strokeWidth={1.6} /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-medium">{item.title}</span><span className="block truncate text-[10px] text-black/45">by {item.author}</span></span>
            </Link>)}
          </section>}

          {results.poems.length > 0 && <section aria-label="Poems">
            <h2 className="border-b border-black/[0.07] px-4 pb-2 pt-3 text-[9px] font-semibold uppercase text-black/45">Poems</h2>
            {results.poems.map((item) => <Link key={item.id} href={`/poems/${item.id}`} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-black/[0.035]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-black/10 bg-black/[0.025]"><Feather size={15} strokeWidth={1.6} /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-medium">{item.title}</span><span className="block truncate text-[10px] text-black/45">by {item.author}</span></span>
            </Link>)}
          </section>}

          {results.users.length > 0 && <section aria-label="Users">
            <h2 className="border-b border-black/[0.07] px-4 pb-2 pt-3 text-[9px] font-semibold uppercase text-black/45">Users</h2>
            {results.users.map((item) => <Link key={item.id} href={`/profile/${encodeURIComponent(item.username)}`} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-black/[0.035]">
              <UserAvatar userId={item.id} username={item.username} imageUrl={item.profile_picture} className="h-8 w-8 border border-black/10" fallbackClassName="bg-black/[0.04] text-black/60 text-xs" />
              <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-medium">{item.username}</span><span className="block truncate text-[10px] text-black/45">@{item.username}</span></span>
            </Link>)}
          </section>}
        </div>
      ) : null}

      {trimmedQuery && !isLoading && !currentState?.error && !empty && <div className="border-t border-black/10 p-1.5">
        <Link href={`/search?q=${encodeURIComponent(trimmedQuery)}`} onClick={onClose} className="flex h-9 items-center justify-center gap-2 rounded-lg text-[11px] font-medium text-black/60 hover:bg-black/[0.05] hover:text-black">View all results <ArrowRight size={13} /></Link>
      </div>}
    </div>
  );
}