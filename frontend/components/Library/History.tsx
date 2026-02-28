"use client";

import LibraryCard from "./LibraryCard";

const historyItems = [
    {
        id: 1,
        title: "Concrete Pulse",
        author: "Leo Castelar",
        genre: "modern",
        type: "poem" as const,
        views: "6.3M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    {
        id: 2,
        title: "Beyond the Horizon",
        author: "Sophia Lark",
        genre: "adventure",
        type: "story" as const,
        views: "9.8M",
        likes: "2.4K",
        comments: "410",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
        id: 3,
        title: "Melodies of May",
        author: "Elena Rousseau",
        genre: "lyric",
        type: "poem" as const,
        views: "33M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf",
    },
];

export default function History() {
    return (
        <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">
                History
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {historyItems.map((item) => (
                    <LibraryCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}