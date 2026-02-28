"use client";

import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react";

const stories = [
    { id: 1, title: "The Last Librarian", genre: "Sci-Fi", reads: "15k", readTime: "45 min read", time: "1 month ago", excerpt: "In a digital world where data streams replace memories, old Marcus still keeps the scent of paper and ink alive in his hidden sanctuary under the neo-city." },
    { id: 2, title: "Midnight Express", genre: "Mystery", reads: "8.2k", readTime: "20 min read", time: "2 months ago", excerpt: "The train never stopped at Station 42, until tonight. Detective Vance knew he had exactly twenty minutes to find the package before the doors opened." },
    { id: 3, title: "Echoes of the Forgotten", genre: "Fantasy", reads: "22k", readTime: "60 min read", time: "4 months ago", excerpt: "The ruins of Eldoria whispered secrets to those who knew how to listen. Elara was the first to hear them in a century." },
    { id: 4, title: "Coffee and Rain", genre: "Romance", reads: "12k", readTime: "15 min read", time: "6 months ago", excerpt: "Two strangers, one umbrella, and a cafe that served the worst espresso in Paris. It was the perfect start to something unexpectedly beautiful." },
];

export default function StoriesTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="font-serif font-bold text-xl text-black">All Stories</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">4 Works</span>
            </div>

            <div className="flex flex-col gap-6">
                {stories.map((story) => (
                    <div key={story.id} className="border border-gray-200 p-6 rounded-md hover:shadow-md transition-shadow group cursor-pointer bg-white flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black border border-gray-300 px-2 py-1 rounded-sm">{story.genre}</span>
                                <span className="text-[10px] text-gray-500 font-medium italic">{story.time}</span>
                            </div>
                            <h3 className="font-bold text-black font-serif text-2xl mb-3 group-hover:underline decoration-1 underline-offset-2">{story.title}</h3>
                            <p className="text-sm text-gray-600 font-serif leading-relaxed mb-4">
                                {story.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-gray-500 pt-2">
                                <div className="flex items-center gap-6 text-xs font-medium">
                                    <div className="flex items-center gap-1.5 text-black"><Clock size={14} /> {story.readTime}</div>
                                    <div className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer"><Heart size={14} /> {story.reads} reads</div>
                                    <div className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer"><MessageCircle size={14} /> Discuss</div>
                                </div>
                                <Bookmark size={16} className="hover:text-black transition-colors cursor-pointer" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
