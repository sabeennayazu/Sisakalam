"use client";

import LibraryCard from "./LibraryCard";

const currentReads = [
    {
        id: 1,
        title: "Echoes of Silence",
        author: "Clara M. Thorne",
        genre: "romanticism",
        type: "poem" as const,
        views: "45M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    },
    {
        id: 2,
        title: "Wilder Whispers",
        author: "Arlo Finch",
        genre: "nature",
        type: "poem" as const,
        views: "12M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    {
        id: 3,
        title: "The Unseen Thread",
        author: "S. J. Sterling",
        genre: "free verse",
        type: "poem" as const,
        views: "8.4M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    },
    {
        id: 4,
        title: "Ode to the Summit",
        author: "Gregory Vance",
        genre: "epic",
        type: "story" as const,
        views: "2.1M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
        id: 5,
        title: "Melodies of May",
        author: "Elena Rousseau",
        genre: "lyric",
        type: "poem" as const,
        views: "33M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf",
    },
    {
        id: 6,
        title: "Concrete Pulse",
        author: "Leo Castelar",
        genre: "modern",
        type: "story" as const,
        views: "6.3M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
];

export default function CurrentReads() {
    return (
        <section className="w-full">
            <h2 className="text-xl md:text-2xl font-semibold text-black mb-6">
                Current Reads
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentReads.map((item) => (
                    <LibraryCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}