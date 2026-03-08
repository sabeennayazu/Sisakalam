"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const stories = [
    { id: 1, title: "The Last Librarian", author: "Marcus Thorne", genre: "Sci-Fi", views: "15M", likes: 2100, comments: "1.2K", time: "1 month ago", image: "/images/covers/cover7.jpg" },
    { id: 2, title: "Midnight Express", author: "Vance", genre: "Mystery", views: "8.2M", likes: 1540, comments: "890", time: "2 months ago", image: "/images/covers/cover8.jpg" },
    { id: 3, title: "Echoes of the Forgotten", author: "Elara", genre: "Fantasy", views: "22M", likes: 3200, comments: "2.1K", time: "4 months ago", image: "/images/covers/cover1.jpg" },
    { id: 4, title: "Coffee and Rain", author: "Aries", genre: "Romance", views: "12M", likes: 1100, comments: "450", time: "6 months ago", image: "/images/covers/cover2.jpg" },
];

export default function StoriesTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-3">
                <h2 className="font-serif font-bold text-xl text-black">All Stories</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stories.length} Works</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                {stories.map((story) => (
                    <UniversalCard 
                        key={story.id}
                        id={story.id}
                        title={story.title}
                        author={story.author}
                        genre={story.genre}
                        image={story.image}
                        views={story.views}
                        likes={story.likes}
                        comments={story.comments}
                    />
                ))}
            </div>
        </div>
    );
}
