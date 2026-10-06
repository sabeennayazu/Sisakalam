"use client";

import { Link2, MapPin, MessageCircle, MoreVertical, Settings } from "lucide-react";
import { LoaderCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ChangeEvent } from "react";
import { followUser, unfollowUser, uploadProfileImage, type Profile } from "@/utils/account.api";
import UserAvatar from "@/components/shared/UserAvatar";
import { announceProfileImageUpdate } from "@/utils/profile-image-events";
import FollowersFollowingModal from "@/components/Profile/FollowersFollowingModal";

type RelationshipMode = "followers" | "following";

interface ProfileHeaderProps {
  profile: Profile;
  isOwner: boolean;
  onProfileChange: (profile: Profile) => void;
}

export default function ProfileHeader({ profile, isOwner, onProfileChange }: ProfileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [relationshipMode, setRelationshipMode] = useState<RelationshipMode | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || uploading) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("The image must be 5 MB or smaller.");
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
      const result = await uploadProfileImage(file);
      const updatedProfile = { ...profile, profile_picture: result.profile_picture };
      onProfileChange(updatedProfile);
      announceProfileImageUpdate({ userId: profile.id, imageUrl: result.profile_picture });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload this image. Please try again.");
    } finally {
      setUploading(false);
    }
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
        <div className="relative">
          <UserAvatar userId={profile.id} username={profile.username} imageUrl={profile.profile_picture} className="h-28 w-28 border border-gray-200" imageClassName="object-cover" fallbackClassName="bg-gray-100 text-3xl font-serif text-gray-400" />
          {uploading && <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white"><LoaderCircle className="h-6 w-6 animate-spin" aria-label="Uploading profile image" /></div>}
          {isOwner && <>
            <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading} aria-label="Upload profile picture" title="Upload profile picture" className="absolute bottom-[-6px] right-0 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-black text-white transition hover:bg-gray-700 disabled:opacity-50"><Plus size={16} /></button>
            <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void uploadAvatar(event)} className="hidden" />
          </>}
        </div>
      </div>
      {uploadError && <p role="alert" className="-mt-3 mb-3 max-w-sm text-xs text-red-700">{uploadError}</p>}
      <h1 className="mb-3 text-3xl font-serif font-bold text-black">{profile.username}</h1>
      {profile.bio && <p className="mb-6 max-w-xl font-serif text-lg italic leading-relaxed text-gray-600">&quot;{profile.bio}&quot;</p>}
      <div className="mb-8 flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {profile.location && <div className="flex items-center gap-1.5"><MapPin size={14} />{profile.location}</div>}
        {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black"><Link2 size={14} />{profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>}
      </div>
      <div className="flex w-full max-w-md items-center justify-center gap-12">
        <Stat label="Followers" value={profile.followers} onClick={() => setRelationshipMode("followers")} />
        <Stat label="Following" value={profile.following} onClick={() => setRelationshipMode("following")} />
        <Stat label="Works" value={profile.works} />
      </div>
      <div className="mt-8 flex items-center gap-4">
      {!isOwner && <>
            <button type="button" onClick={toggleFollow} className="bg-black rounded-full px-10 py-2 text-xs font-bold text-white hover:bg-white hover:text-black hover:border">{profile.is_following ? "Unfollow" : "Follow"}</button>
            <button type="button" className="border border-black bg-white rounded-full px-8 py-2 text-xs font-bold text-black hover:bg-black hover:text-white "><MessageCircle size={14} className="mr-1 inline" /> Message</button>
          </>}
          </div>
      <FollowersFollowingModal
        open={relationshipMode !== null}
        onClose={() => setRelationshipMode(null)}
        mode={relationshipMode ?? "followers"}
        userId={profile.id}
        isOwner={isOwner}
        onFollowerRemoved={() => onProfileChange({ ...profile, followers: Math.max(0, profile.followers - 1) })}
        onFollowingCountChange={(delta) => onProfileChange({ ...profile, following: Math.max(0, profile.following + delta) })}
      />
    </div>
  );
}

function Stat({ label, value, onClick }: { label: string; value: number; onClick?: () => void }) {
  const content = <><span className="text-xl font-bold text-black">{value.toLocaleString()}</span><span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span></>;
  if (onClick) {
    return <button type="button" onClick={onClick} className="flex flex-col items-center rounded px-1 focus-visible:ring-2 focus-visible:ring-black">
      {content}
    </button>;
  }
  return <div className="flex flex-col items-center">{content}</div>;
}
