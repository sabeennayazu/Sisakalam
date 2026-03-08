"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const savedItems = [
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
        title: "The Midnight Train",
        author: "James Holloway",
        genre: "mystery",
        type: "story" as const,
        views: "18M",
        likes: "3.1K",
        comments: "890",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    },
    {
        id: 3,
        title: "Wilder Whispers",
        author: "Arlo Finch",
        genre: "nature",
        type: "poem" as const,
        views: "12M",
        likes: "1.2K",
        comments: "1.2K",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
];

export default function Saved() {
    return (
        <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-8">
                Saved
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                {savedItems.map((item) => (
                    <UniversalCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        author={item.author}
                        genre={item.genre}
                        image={item.image}
                        views={item.views}
                        likes={parseInt(item.likes)}
                        comments={item.comments}
                        type={item.type}
                    />
                ))}
            </div>
        </section>
    );
}

const savedItemsGrid = `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8`;