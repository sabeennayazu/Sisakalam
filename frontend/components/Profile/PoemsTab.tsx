"use client";

import { Heart, MessageCircle, Bookmark } from "lucide-react";

const poems = [
    { id: 1, title: "Echoes of Silence", genre: "Romanticism", likes: "1.2k", comments: "84", time: "2 days ago", excerpt: "In the quiet of the night, words unspoken speak the loudest truths..." },
    { id: 2, title: "Midnight Soliloquy", genre: "Free Verse", likes: "890", comments: "45", time: "1 week ago", excerpt: "A lone shadow drifting across the pavement, searching for a dawn that never comes." },
    { id: 3, title: "Amber Skies", genre: "Nature", likes: "2.3k", comments: "120", time: "3 weeks ago", excerpt: "The sun bleeds gold and crimson, a daily tragedy painted across the horizon." },
    { id: 4, title: "Whispers of the Old World", genre: "Classic", likes: "560", comments: "22", time: "1 month ago", excerpt: "Cobblestones hold the memories of those who walked before the light faded." },
    { id: 5, title: "Fading Footprints", genre: "Modern", likes: "1.5k", comments: "90", time: "2 months ago", excerpt: "We walk on digital sands, leaving traces that the algorithm slowly erases." },
    { id: 6, title: "The Last Autumn Leaf", genre: "Nature", likes: "3.1k", comments: "210", time: "3 months ago", excerpt: "Holding onto the branch with the desperation of a lover refusing to say goodbye." },
];

export default function PoemsTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="font-serif font-bold text-xl text-black">All Poems</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">6 Works</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poems.map((poem) => (
                    <div key={poem.id} className="border border-gray-200 p-6 rounded-md hover:shadow-md transition-shadow group cursor-pointer bg-white flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-gray-100 px-2 py-1 rounded-sm">{poem.genre}</span>
                            <span className="text-[10px] text-gray-500 font-medium italic">{poem.time}</span>
                        </div>
                        <h3 className="font-bold text-black font-serif text-xl mb-3 group-hover:underline decoration-1 underline-offset-2">{poem.title}</h3>
                        <p className="text-sm text-gray-600 italic font-serif line-clamp-3 mb-6 flex-grow">"{poem.excerpt}"</p>
                        <div className="flex items-center justify-between text-gray-400 mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5 hover:text-black transition-colors"><Heart size={14} /> {poem.likes}</div>
                                <div className="flex items-center gap-1.5 hover:text-black transition-colors"><MessageCircle size={14} /> {poem.comments}</div>
                            </div>
                            <Bookmark size={16} className="hover:text-black transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
