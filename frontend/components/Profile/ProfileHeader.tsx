"use client";

import { MapPin, Link2 } from "lucide-react";

export default function ProfileHeader() {
    return (
        <div className="flex flex-col items-center justify-center text-center mt-12 mb-10 w-full max-w-3xl mx-auto px-4">
            {/* Avatar Container */}
            <div className="relative mb-6 group cursor-pointer">
                <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200">
                    <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                        alt="Profile Avatar"
                        className="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                    />
                </div>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-serif font-bold text-black mb-3">
                Julian Valerius
            </h1>

            {/* Bio / Tagline */}
            <p className="text-gray-600 font-serif italic text-lg mb-6 leading-relaxed max-w-xl">
                "Capturing the ephemeral beauty of the mundane through modern verse and noir inspired short stories."
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-xs text-gray-500 mb-8 uppercase tracking-wider font-semibold">
                <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    Paris, France
                </div>
                <div className="flex items-center gap-1.5">
                    <Link2 size={14} />
                    <a href="#" className="hover:text-black transition-colors">
                        julianvalerius.com
                    </a>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-black">12.4k</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-black">850</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Following</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-black">42</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Works</span>
                </div>
            </div>
        </div>
    );
}
