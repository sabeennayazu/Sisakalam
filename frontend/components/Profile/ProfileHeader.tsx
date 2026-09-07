"use client";

import { useEffect, useState } from "react";
import { MapPin, Link2, Settings } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/utils/account.api";
import type { Profile } from "@/utils/account.api";

export default function ProfileHeader() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);

                const data = await getCurrentUser();
                setProfile(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center text-center mt-12 mb-10 w-full max-w-3xl mx-auto px-4">

                {/* Avatar skeleton */}
                <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse mb-6" />

                {/* Name skeleton */}
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-4" />

                {/* Bio skeleton */}
                <div className="w-96 max-w-full h-5 bg-gray-200 rounded animate-pulse mb-6" />

                {/* Meta skeleton */}
                <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mb-8" />

                {/* Stats skeleton */}
                <div className="flex gap-12">
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    // Error state
    if (error || !profile) {
        return (
            <div className="flex items-center justify-center mt-12 mb-10">
                <p className="text-sm text-red-500">
                    {error || "Profile not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center mt-12 mb-10 w-full max-w-3xl mx-auto px-4">

            {/* Avatar Container */}
            <div className="relative mb-6 group cursor-pointer">

                {/* Settings Icon and Dropdown */}
                <div className="absolute -top-4 -right-24 md:-right-32 lg:-right-40 group/settings">

                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
                    >
                        <Settings size={20} strokeWidth={2} />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover/settings:opacity-100 group-hover/settings:visible transition-all duration-200 z-10 py-2">

                        <Link
                            href="/profile/edit"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors font-medium"
                        >
                            Edit Profile
                        </Link>

                        <Link
                            href="/settings/account"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors font-medium"
                        >
                            Settings
                        </Link>

                    </div>
                </div>

                {/* Profile Image */}
                <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200">

                    {profile.profile_picture ? (
                        <img
                            src={profile.profile_picture}
                            alt={`${profile.username}'s profile`}
                            className="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-3xl font-serif font-bold text-gray-400">
                                {profile.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                </div>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-serif font-bold text-black mb-3">
                {profile.username}
            </h1>

            {/* Bio */}
            {profile.bio && (
                <p className="text-gray-600 font-serif italic text-lg mb-6 leading-relaxed max-w-xl">
                    &quot;{profile.bio}&quot;
                </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-xs text-gray-500 mb-8 uppercase tracking-wider font-semibold">

                {/* Location */}
                {profile.location && (
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {profile.location}
                    </div>
                )}

                {/* Website */}
                {profile.website && (
                    <div className="flex items-center gap-1.5">
                        <Link2 size={14} />

                        <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-black transition-colors"
                        >
                            {profile.website
                                .replace(/^https?:\/\//, "")
                                .replace(/\/$/, "")}
                        </a>
                    </div>
                )}

            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 w-full max-w-md mx-auto">

                {/* Followers */}
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-black">
                        {profile.followers.toLocaleString()}
                    </span>

                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                        Followers
                    </span>
                </div>

                {/* Following */}
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-black">
                        {profile.following.toLocaleString()}
                    </span>

                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                        Following
                    </span>
                </div>

                {/* Works */}
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-black">
                        {profile.works.toLocaleString()}
                    </span>

                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                        Works
                    </span>
                </div>

            </div>
        </div>
    );
}