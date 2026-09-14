"use client";

import { Link2, MapPin, MessageCircle, MoreVertical, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { followUser, unfollowUser, type Profile } from "@/utils/account.api";

interface ProfileHeaderProps {
  profile: Profile;
  isOwner: boolean;
  onProfileChange: (profile: Profile) => void;
}

export default function ProfileHeader({ profile, isOwner, onProfileChange }: ProfileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  const shareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${profile.username}'s profile`, url });
    } else {
      await navigator.clipboard?.writeText(url);
      setSharing(true);
      window.setTimeout(() => setSharing(false), 1800);
    }
  };

  const toggleFollow = async () => {
    const result = profile.is_following ? await unfollowUser(profile.username) : await followUser(profile.username);
    onProfileChange({ ...profile, is_following: result.is_following, followers: result.followers });
  };

  return (
    <div className="mt-12 mb-10 flex w-full  flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute -top-4 -right-24 flex items-center gap-2 md:-right-32 lg:-right-40">
          
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Profile options">{isOwner ? <Settings size={20} /> : <MoreVertical size={20} />}</button>
          {menuOpen && <div className="absolute right-0 top-full z-10 mt-2 w-52 rounded-xl border border-gray-300 bg-white py-2 text-left shadow-xl">
            {isOwner ? <>
              <Link href="/profile/edit" className="block px-4 py-2.5 text-sm text-black hover:bg-gray-200">Edit Profile</Link>
              <Link href="/settings/account" className="block px-4 py-2.5 text-sm text-black hover:bg-gray-200">Settings</Link>
            </> : <>
              <button type="button" className="block w-full px-4 py-2.5 text-left text-sm text-black hover:bg-gray-300">Block</button>
              <button type="button" onClick={shareProfile} className="block w-full px-4 py-2.5 text-left text-black text-sm hover:bg-gray-100">{sharing ? "Profile link copied" : "Share Profile"}</button>
              <button type="button" className="block w-full px-4 py-2.5 text-left text-sm text-black hover:bg-gray-100">Report</button>
              <button type="button" className="block w-full px-4 py-2.5 text-left text-sm text-black hover:bg-gray-100">About This Account</button>
            </>}
          </div>}
        </div>
        <div className="h-28 w-28 overflow-hidden rounded-full border border-gray-200">
          {profile.profile_picture ? <img src={profile.profile_picture} alt={`${profile.username}'s profile`} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gray-100 text-3xl font-serif font-bold text-gray-400">{profile.username.charAt(0).toUpperCase()}</div>}
        </div>
      </div>
      <h1 className="mb-3 text-3xl font-serif font-bold text-black">{profile.username}</h1>
      {profile.bio && <p className="mb-6 max-w-xl font-serif text-lg italic leading-relaxed text-gray-600">&quot;{profile.bio}&quot;</p>}
      <div className="mb-8 flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {profile.location && <div className="flex items-center gap-1.5"><MapPin size={14} />{profile.location}</div>}
        {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black"><Link2 size={14} />{profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>}
      </div>
      <div className="flex w-full max-w-md items-center justify-center gap-12">
        <Stat label="Followers" value={profile.followers} />
        <Stat label="Following" value={profile.following} />
        <Stat label="Works" value={profile.works} />
      </div>
      <div className="mt-8 flex items-center gap-4">
      {!isOwner && <>
            <button type="button" onClick={toggleFollow} className="bg-black rounded-full px-10 py-2 text-xs font-bold text-white hover:bg-white hover:text-black hover:border">{profile.is_following ? "Unfollow" : "Follow"}</button>
            <button type="button" className="border border-black bg-white rounded-full px-8 py-2 text-xs font-bold text-black hover:bg-black hover:text-white "><MessageCircle size={14} className="mr-1 inline" /> Message</button>
          </>}
          </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="flex flex-col items-center"><span className="text-xl font-bold text-black">{value.toLocaleString()}</span><span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span></div>;
}
