"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UniversalCard, { ContentType } from "@/components/shared/UniversalCard";
import { deletePoem, getDrafts as getPoemDrafts } from "@/utils/poems.api";
import { deleteStory, getDrafts as getStoryDrafts } from "@/utils/stories.api";
import { getMediaUrl } from "@/utils/api";
import { Edit2 } from "lucide-react";

interface DraftRecord {
    id: number;
    title: string;
    content?: string;
    synopsis?: string;
    author_name?: string | null;
    genre_name?: string | null;
    image?: string | null;
    is_mature?: boolean;
    status: "draft";
    tags?: string[];
    tag_names?: string[];
    created_at: string;
    updated_at: string;
}

interface LibraryDraft extends DraftRecord {
    type: ContentType;
}

const asDrafts = (response: unknown): DraftRecord[] => {
    if (Array.isArray(response)) return response as DraftRecord[];
    if (response && typeof response === "object" && "results" in response && Array.isArray(response.results)) {
        return response.results as DraftRecord[];
    }
    return [];
};

const mapDraft = (draft: DraftRecord, type: ContentType): LibraryDraft => ({
    ...draft,
    type,
});

export default function Drafts() {
    const router = useRouter();
    const [drafts, setDrafts] = useState<LibraryDraft[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDrafts = async () => {
        try {
            setLoading(true);
            setError(null);
            const [poemsResponse, storiesResponse] = await Promise.all([getPoemDrafts(), getStoryDrafts()]);
            setDrafts([
                ...asDrafts(poemsResponse).filter((draft) => draft.status === "draft").map((draft) => mapDraft(draft, "poem")),
                ...asDrafts(storiesResponse).filter((draft) => draft.status === "draft").map((draft) => mapDraft(draft, "story")),
            ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Unable to load your drafts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadDrafts();
    }, []);

    const openDraft = (draft: LibraryDraft) => {
        router.push(`/write?type=${draft.type}&id=${draft.id}`);
    };

    const handleDelete = async (event: React.MouseEvent, draft: LibraryDraft) => {
        event.stopPropagation();
        try {
            if (draft.type === "poem") await deletePoem(draft.id);
            else await deleteStory(draft.id);
            setDrafts((current) => current.filter((item) => !(item.id === draft.id && item.type === draft.type)));
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this draft.");
        }
    };

    if (loading) return <div className="py-16 text-center text-sm text-gray-500">Loading your drafts...</div>;

    if (error) return <div className="py-16 text-center text-sm text-red-500">{error}</div>;

    if (drafts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    <Edit2 className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No drafts available</h3>
                <p className="mb-6 max-w-sm text-gray-500">Start writing something new. Your drafts will safely be saved here.</p>
                <button onClick={() => router.push("/write")} className="rounded-lg bg-black px-6 py-2.5 font-medium text-white transition-colors hover:bg-black/90">
                    Start Writing
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Drafts</h2>
                <span className="text-sm text-gray-500">{drafts.length} {drafts.length === 1 ? "draft" : "drafts"}</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-items-center gap-6 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {drafts.map((draft) => (
                    <UniversalCard
                        key={`${draft.type}-${draft.id}`}
                        id={draft.id}
                        title={draft.title || "Untitled"}
                        author={draft.author_name ?? "You"}
                        genre={draft.genre_name ?? ""}
                        image={getMediaUrl(draft.image ?? null)}
                        views={0}
                        likes={0}
                        comments={0}
                        type={draft.type}
                        status={draft.status}
                        savedAt={draft.updated_at}
                        isMature={draft.is_mature ?? false}
                        showStats={false}
                        showBookmark={false}
                        onClick={() => openDraft(draft)}
                        onEdit={(event) => {
                            event.stopPropagation();
                            openDraft(draft);
                        }}
                        onDelete={(event) => void handleDelete(event, draft)}
                    />
                ))}
            </div>
        </div>
    );
}
