"use client";

import { Bookmark, Eye, Heart } from "lucide-react";

const savedItems = [
    { id: 1, title: "The Art of Doing Nothing", author: "William Reyes", type: "Essay", time: "Saved 2 days ago", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Ode to the Concrete Jungle", author: "Sylvia Vance", type: "Poem", time: "Saved 1 week ago", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "The Last Train to Paris", author: "Julian Valerius", type: "Story", time: "Saved 2 weeks ago", image: "https://images.unsplash.com/photo-1512411516279-d102eacb1380?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Wanderlust Excerpts", author: "Clara Thorne", type: "Journal", time: "Saved 1 month ago", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
];

export default function SavedTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="font-serif font-bold text-xl text-black">Reading List</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">4 Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedItems.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-md mb-3 h-[200px]">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover grayscale transition duration-300 group-hover:scale-105 group-hover:grayscale-0"
                            />
                            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded-sm">
                                {item.type}
                            </span>
                        </div>

                        <h3 className="mt-2 font-serif font-bold text-black text-lg line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                            {item.title}
                        </h3>

                        <p className="text-xs text-gray-600 font-serif italic mb-2">
                            By {item.author}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 pt-3 border-t border-gray-100">
                            <span>{item.time}</span>
                            <Bookmark size={14} className="hover:text-black transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
