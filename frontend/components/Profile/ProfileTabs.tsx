"use client";

import { useEffect, useState } from "react";
import PoemsTab from "./PoemsTab";
import StoriesTab from "./StoriesTab";
import SavedTab from "./SavedTab";
import LikedTab from "./LikedTab";
import { deleteProfileContent, getLikedProfileContent, getMyPoems, getMyStories, getSavedProfileContent, getUserPoems, getUserStories, toggleProfileContentPrivacy, type ProfileContent } from "@/utils/profile.api";
import type { Profile } from "@/utils/account.api";

const ownerTabs = ["Poems", "Stories", "Saved", "Liked"] as const;
const publicTabs = ["Poems", "Stories", "Saved", "Liked"] as const;
type TabName = (typeof ownerTabs)[number];

interface DataState { data: ProfileContent[] | null; loading: boolean; error: string | null; }
const initialState: DataState = { data: null, loading: false, error: null };

export default function ProfileTabs({ profile, isOwner }: { profile: Profile; isOwner: boolean }) {
  const [activeTab, setActiveTab] = useState<TabName>("Poems");
  const [poems, setPoems] = useState<DataState>(initialState);
  const [stories, setStories] = useState<DataState>(initialState);
  const [saved, setSaved] = useState<DataState>(initialState);
  const [liked, setLiked] = useState<DataState>(initialState);
  const tabs = isOwner ? ownerTabs : publicTabs;

  const deleteItem = async (item: ProfileContent) => {
    await deleteProfileContent(item);
    const update = (state: DataState): DataState => ({ ...state, data: state.data?.filter((current) => current.id !== item.id || current.type !== item.type) ?? null });
    if (item.type === "poem") setPoems(update(poems)); else setStories(update(stories));
  };

  const togglePrivacy = async (item: ProfileContent) => {
    await toggleProfileContentPrivacy(item);
    const update = (state: DataState): DataState => ({ ...state, data: state.data?.map((current) => current.id === item.id && current.type === item.type ? { ...current, isPrivate: !current.isPrivate } : current) ?? null });
    if (item.type === "poem") setPoems(update(poems)); else setStories(update(stories));
  };

  useEffect(() => {
    let cancelled = false;
    const load = async (state: DataState, setState: (value: DataState) => void, fetcher: () => Promise<ProfileContent[]>, label: string) => {
      if (state.data !== null || state.loading) return;
      setState({ data: null, loading: true, error: null });
      try {
        const data = await fetcher();
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch {
        if (!cancelled) setState({ data: null, loading: false, error: `Unable to load ${label}. Please try again.` });
      }
    };
    if (activeTab === "Poems") {
      void load(poems, setPoems, isOwner ? () => getMyPoems() : () => getUserPoems(profile.id), "poems");
    } else if (activeTab === "Stories") {
      void load(stories, setStories, isOwner ? () => getMyStories() : () => getUserStories(profile.id), "stories");
    } else if (isOwner && activeTab === "Saved") {
      void load(saved, setSaved, getSavedProfileContent, "saved posts");
    } else if (isOwner && activeTab === "Liked") {
      void load(liked, setLiked, getLikedProfileContent, "liked posts");
    }
    return () => { cancelled = true; };
  }, [activeTab, isOwner, profile.id]);

  return <div className="mx-auto mb-20 w-full max-w-5xl px-4">
    <div className="mb-10 flex justify-center border-b border-gray-200"><nav className="flex gap-8">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`relative pb-4 text-xs font-bold uppercase tracking-widest ${activeTab === tab ? "text-black" : "text-gray-400 hover:text-gray-800"}`}>{tab}{activeTab === tab && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-black" />}</button>)}</nav></div>
    <div className="min-h-[400px]">
      {activeTab === "Poems" && <PoemsTab poems={poems.data} loading={poems.loading} error={poems.error} isOwner={isOwner} viewerId={profile.id} onDelete={deleteItem} onTogglePrivacy={togglePrivacy} />}
      {activeTab === "Stories" && <StoriesTab stories={stories.data} loading={stories.loading} error={stories.error} isOwner={isOwner} viewerId={profile.id} onDelete={deleteItem} onTogglePrivacy={togglePrivacy} />}
      {activeTab === "Saved" && (isOwner ? <SavedTab items={saved.data} loading={saved.loading} error={saved.error} /> : <PrivateTab label="saved" />)}
      {activeTab === "Liked" && (isOwner ? <LikedTab items={liked.data} loading={liked.loading} error={liked.error} /> : <PrivateTab label="liked" />)}
    </div>
  </div>;
}

function PrivateTab({ label }: { label: string }) {
  return <div className="flex min-h-[260px] items-center justify-center text-center"><p className="max-w-md font-serif text-lg italic text-gray-600">This user has kept their {label} content private.</p></div>;
}
