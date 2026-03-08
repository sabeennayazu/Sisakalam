"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const savedItems = [
    { id: 1, title: "The Art of Doing Nothing", author: "William Reyes", type: "essay", genre: "Lifestyle", views: "1.2M", likes: 800, comments: "200", time: "Saved 2 days ago", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Ode to the Concrete Jungle", author: "Sylvia Vance", type: "poem", genre: "Modern", views: "4.5M", likes: 1100, comments: "450", time: "Saved 1 week ago", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "The Last Train to Paris", author: "Julian Valerius", type: "story", genre: "Historical", views: "8.1M", likes: 2300, comments: "1.1K", time: "Saved 2 weeks ago", image: "https://images.unsplash.com/photo-1512411516279-d102eacb1380?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Wanderlust Excerpts", author: "Clara Thorne", type: "journal", genre: "Travel", views: "500K", likes: 450, comments: "89", time: "Saved 1 month ago", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "The Art of Doing Nothing", author: "William Reyes", type: "essay", genre: "Lifestyle", views: "1.2M", likes: 800, comments: "200", time: "Saved 2 days ago", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Ode to the Concrete Jungle", author: "Sylvia Vance", type: "poem", genre: "Modern", views: "4.5M", likes: 1100, comments: "450", time: "Saved 1 week ago", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 7, title: "The Last Train to Paris", author: "Julian Valerius", type: "story", genre: "Historical", views: "8.1M", likes: 2300, comments: "1.1K", time: "Saved 2 weeks ago", image: "https://images.unsplash.com/photo-1512411516279-d102eacb1380?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 8, title: "Wanderlust Excerpts", author: "Clara Thorne", type: "journal", genre: "Travel", views: "500K", likes: 450, comments: "89", time: "Saved 1 month ago", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
];

export default function SavedTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-3">
                <h2 className="font-serif font-bold text-xl text-black">Reading List</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{savedItems.length} Items</span>
            </div>

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
                        likes={item.likes}
                        comments={item.comments}
                        type={item.type}
                        showBookmark={true} // It's saved, so keep bookmark visible
                    />
                ))}
            </div>
        </div>
    );
}
