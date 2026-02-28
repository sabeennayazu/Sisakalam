"use client";

import { Eye, Heart, Share2, MessageCircle, Bookmark } from "lucide-react";

export default function WorksTab() {
    return (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT COLUMN: Featured Work & Latest */}
            <div className="flex-1">
                <h2 className="font-serif font-bold text-xl text-black mb-6 border-b border-gray-200 pb-2">
                    Featured Work
                </h2>

                {/* Featured Card */}
                <div className="mb-12 group cursor-pointer">
                    <div className="w-full h-[300px] overflow-hidden rounded-md mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Featured Work"
                            className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded-sm">
                            Editor's Choice
                        </span>
                        <span className="text-xs text-gray-500 font-medium">12 min read • Jan 2024</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-black mb-2 group-hover:underline decoration-1 underline-offset-4">
                        The Silence of the Seine
                    </h3>
                    <p className="text-gray-600 font-serif italic mb-4">
                        "A collection of thoughts gathered while walking along the river banks at midnight, where the only sound is the echo of our own history..."
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5"><Heart size={14} /> 1.2k</div>
                        <div className="flex items-center gap-1.5"><MessageCircle size={14} /> 84</div>
                        <div className="flex items-center gap-1.5"><Eye size={14} /> 5.8k</div>
                    </div>
                </div>

                {/* Latest Publications */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                    <h2 className="font-serif font-bold text-xl text-black">Latest Publications</h2>
                    <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">View All Archive</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="border border-gray-200 p-5 rounded-md hover:shadow-md transition-shadow group cursor-pointer bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800 bg-gray-100 px-2 py-1 rounded-sm">Poem</span>
                            <span className="text-[10px] text-gray-400 font-medium italic">Published 2 days ago</span>
                        </div>
                        <h4 className="font-bold text-black font-serif text-lg mb-2 group-hover:underline decoration-1 underline-offset-2">Amber Skies at Dusk</h4>
                        <p className="text-xs text-gray-600 italic font-serif line-clamp-3 mb-6">"The sun retires in a cloak of gold, whispered promises of secrets untold..."</p>
                        <div className="flex items-center justify-between text-gray-400 mt-auto">
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1"><Heart size={12} /> 422</div>
                                <div className="flex items-center gap-1"><MessageCircle size={12} /> 18</div>
                            </div>
                            <Bookmark size={14} className="hover:text-black transition-colors" />
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="border border-gray-200 p-5 rounded-md hover:shadow-md transition-shadow group cursor-pointer bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800 bg-gray-100 px-2 py-1 rounded-sm">Short Story</span>
                            <span className="text-[10px] text-gray-400 font-medium italic">Published 1 week ago</span>
                        </div>
                        <h4 className="font-bold text-black font-serif text-lg mb-2 group-hover:underline decoration-1 underline-offset-2">The Last Librarian</h4>
                        <p className="text-xs text-gray-600 italic font-serif line-clamp-3 mb-6">In a digital world, old Marcus still keeps the scent of paper and ink alive in his hidden sanctuary.</p>
                        <div className="flex items-center justify-between text-gray-400 mt-auto">
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1"><Heart size={12} /> 850</div>
                                <div className="flex items-center gap-1"><MessageCircle size={12} /> 34</div>
                            </div>
                            <Bookmark size={14} className="hover:text-black transition-colors" />
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="border border-gray-200 p-5 rounded-md hover:shadow-md transition-shadow group cursor-pointer bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800 bg-gray-100 px-2 py-1 rounded-sm">Essay</span>
                            <span className="text-[10px] text-gray-400 font-medium italic">Published 2 weeks ago</span>
                        </div>
                        <h4 className="font-bold text-black font-serif text-lg mb-2 group-hover:underline decoration-1 underline-offset-2">On Melancholy & Art</h4>
                        <p className="text-xs text-gray-600 italic font-serif line-clamp-3 mb-6">Why the saddest moments in history often produce the most enduring masterpieces of literature.</p>
                        <div className="flex items-center justify-between text-gray-400 mt-auto">
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1"><Heart size={12} /> 612</div>
                                <div className="flex items-center gap-1"><MessageCircle size={12} /> 22</div>
                            </div>
                            <Bookmark size={14} className="hover:text-black transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Analytics */}
            <div className="w-full lg:w-[320px]">
                <h2 className="font-serif font-bold text-xl text-black mb-6 border-b border-gray-200 pb-2">
                    Recent Analytics
                </h2>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
                    {/* Stat 1 */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 border-dashed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-black">
                                <Eye size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Views</p>
                                <p className="text-xl font-bold text-black">48.5k</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-black shrink-0">+12%</span>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 border-dashed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-black">
                                <Heart size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Engagement</p>
                                <p className="text-xl font-bold text-black">8.2k</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-black">+5%</span>
                    </div>

                    {/* Stat 3 */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-black">
                                <Share2 size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Story Shares</p>
                                <p className="text-xl font-bold text-black">1.4k</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Stable</span>
                    </div>

                    <button className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors">
                        View Deep Dive
                    </button>
                </div>
            </div>

        </div>
    );
}
