"use client";

import { useEffect, useRef, useState } from "react";
import WorksTab from "./WorksTab";
import PoemsTab from "./PoemsTab";
import StoriesTab from "./StoriesTab";
import SavedTab from "./SavedTab";
import LikedTab from "./LikedTab";
import {
    getLikedProfileContent,
    getMyPoems,
    getMyStories,
    getSavedProfileContent,
    type ProfileContent,
} from "@/utils/profile.api";

const tabs = ["Works", "Poems", "Stories", "Saved", "Liked"] as const;
type TabName = (typeof tabs)[number];

interface DataState {
    data: ProfileContent[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: DataState = { data: null, loading: false, error: null };

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState<TabName>("Works");
    const [poems, setPoems] = useState<DataState>(initialState);
    const [stories, setStories] = useState<DataState>(initialState);
    const [saved, setSaved] = useState<DataState>(initialState);
    const [liked, setLiked] = useState<DataState>(initialState);
    const poemsRef = useRef(poems);
    const storiesRef = useRef(stories);
    const savedRef = useRef(saved);
    const likedRef = useRef(liked);

    useEffect(() => {
        poemsRef.current = poems;
        storiesRef.current = stories;
        savedRef.current = saved;
        likedRef.current = liked;
    }, [liked, poems, saved, stories]);

    useEffect(() => {
        let cancelled = false;

        const load = async (
            state: DataState,
            setState: (value: DataState) => void,
            fetcher: () => Promise<ProfileContent[]>,
            label: string,
        ) => {
            if (state.data !== null || state.loading) return;

            setState({ data: null, loading: true, error: null });
            try {
                const data = await fetcher();
                if (!cancelled) setState({ data, loading: false, error: null });
            } catch {
                if (!cancelled) setState({ data: null, loading: false, error: `Unable to load your ${label}. Please try again.` });
            }
        };

        if (activeTab === "Works") {
            void load(poemsRef.current, setPoems, getMyPoems, "works");
            void load(storiesRef.current, setStories, getMyStories, "works");
        } else if (activeTab === "Poems") {
            void load(poemsRef.current, setPoems, getMyPoems, "poems");
        } else if (activeTab === "Stories") {
            void load(storiesRef.current, setStories, getMyStories, "stories");
        } else if (activeTab === "Saved") {
            void load(savedRef.current, setSaved, getSavedProfileContent, "saved posts");
        } else {
            void load(likedRef.current, setLiked, getLikedProfileContent, "liked posts");
        }

        return () => {
            cancelled = true;
        };
    }, [activeTab]);

    return (
        <div className="w-full max-w-5xl mx-auto px-4 mb-20">
            {/* Tab Navigation */}
            <div className="flex justify-center border-b border-gray-200 mb-10">
                <nav className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === tab
                                    ? "text-black"
                                    : "text-gray-400 hover:text-gray-800"
                                }`}
                        >
                            {tab}
                            {/* Active Underline */}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "Works" && (
                    <WorksTab
                        poems={poems.data}
                        stories={stories.data}
                        loading={poems.loading || stories.loading}
                        error={poems.error || stories.error}
                    />
                )}
                {activeTab === "Poems" && <PoemsTab poems={poems.data} loading={poems.loading} error={poems.error} />}
                {activeTab === "Stories" && <StoriesTab stories={stories.data} loading={stories.loading} error={stories.error} />}
                {activeTab === "Saved" && <SavedTab items={saved.data} loading={saved.loading} error={saved.error} />}
                {activeTab === "Liked" && <LikedTab items={liked.data} loading={liked.loading} error={liked.error} />}
            </div>
        </div>
    );
}
