"use client";

import { useState } from "react";
import UniversalCard, { ContentType } from "@/components/shared/UniversalCard";
import { Edit2, Trash2 } from "lucide-react";

// Mock draft data
const initialDrafts = [
    {
        id: 101,
        title: "The Silent Echo",
        author: "Alex Writer",
        genre: "Sci-Fi",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=700&fit=crop",
        type: "story" as ContentType,
        lastEdited: "2 mins ago",
    },
    {
        id: 102,
        title: "", // Empty title for fallback testing
        author: "Alex Writer",
        genre: "Poetry",
        image: "", // Empty image for fallback testing
        type: "poem" as ContentType,
        lastEdited: "1 hour ago",
    },
    {
        id: 103,
        title: "A Gentle Reminder",
        author: "Alex Writer",
        genre: "Essay",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=500&h=700&fit=crop",
        type: "essay" as ContentType,
        lastEdited: "Yesterday",
    },
];

export default function Drafts() {
    const [drafts, setDrafts] = useState(initialDrafts);

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    };

    const handleEdit = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        console.log(`Open edit mode for draft ${id}`);
        // Add navigation or modal logic here
    };

    if (drafts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Edit2 className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No drafts available
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                    Start writing something new. Your drafts will safely be saved here.
                </p>
                <button className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors">
                    Start Writing
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Drafts</h2>
                <div className="flex gap-4 items-center">
                    <span className="text-sm text-gray-500">
                        {drafts.length} {drafts.length === 1 ? "draft" : "drafts"}
                    </span>
                    <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2">
                        <option value="recent">Sort by: Last edited</option>
                        <option value="name">Sort by: A-Z</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {drafts.map((draft) => (
                    <div key={draft.id} className="relative group">
                        <UniversalCard
                            id={draft.id}
                            title={draft.title || "<No Title>"} // Title fallback
                            author={draft.author}
                            genre={draft.genre}
                            image={draft.image || "https://placehold.co/500x700/e2e8f0/64748b?text=No+Image"} // specific grey dummy image fallback
                            views={0} // Irrelevant since stats are hidden
                            likes={0}
                            comments={0}
                            type={draft.type}
                            showStats={false} // Hide likes, comments, views
                            showBookmark={false}
                            onClick={() => console.log(`Open ${draft.id}`)}
                        >
                            <div className="flex items-center justify-between mt-3 px-1 border-t border-gray-100 pt-3">
                                <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full inline-block">
                                    Saved {draft.lastEdited}
                                </span>
                                
                                {/* Action Buttons overlay that appears on hover / or explicitly */}
                                <div className="flex gap-2">
                                     <button
                                        onClick={(e) => handleEdit(e, draft.id)}
                                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                                        title="Edit Draft"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, draft.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Draft"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </UniversalCard>
                    </div>
                ))}
            </div>
        </div>
    );
}
