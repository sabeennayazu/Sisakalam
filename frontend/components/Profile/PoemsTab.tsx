"use client";

import ProfileCard from "./ProfileCard";

const poems = [
    { id: 1, title: "Echoes of Silence", author: "Clara M. Thorne", genre: "Romanticism", views: "45M", likes: 1200, comments: "1.2K", time: "2 days ago", image: "/images/covers/cover1.jpg" },
    { id: 2, title: "Wilder Whispers", author: "Arlo Finch", genre: "Nature", views: "12M", likes: 1200, comments: "1.2K", time: "1 week ago", image: "/images/covers/cover2.jpg" },
    { id: 3, title: "The Unseen Thread", author: "S. J. Sterling", genre: "Free Verse", views: "8.4M", likes: 1200, comments: "1.2K", time: "3 weeks ago", image: "/images/covers/cover3.jpg" },
    { id: 4, title: "Ode to the Summit", author: "Gregory Vance", genre: "Epic", views: "2.1M", likes: 1200, comments: "1.2K", time: "1 month ago", image: "/images/covers/cover4.jpg" },
    { id: 5, title: "Melodies of May", author: "Elena Rousseau", genre: "Lyric", views: "33M", likes: 1200, comments: "1.2K", time: "2 months ago", image: "/images/covers/cover5.jpg" },
    { id: 6, title: "Concrete Pulse", author: "Leo Castelar", genre: "Modern", views: "6.3M", likes: 1200, comments: "1.2K", time: "3 months ago", image: "/images/covers/cover6.jpg" },
];

export default function PoemsTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="font-serif font-bold text-xl text-black">All Poems</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{poems.length} Works</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {poems.map((poem) => (
                    <ProfileCard 
                        key={poem.id}
                        id={poem.id}
                        title={poem.title}
                        author={poem.author}
                        genre={poem.genre}
                        image={poem.image}
                        views={poem.views}
                        likes={poem.likes}
                        comments={poem.comments}
                    />
                ))}
            </div>
        </div>
    );
}
