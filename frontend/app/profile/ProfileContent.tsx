"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTabs from "@/components/Profile/ProfileTabs";
import { getCurrentUser, getUserProfile, type Profile } from "@/utils/account.api";

export default function ProfileContent({ username }: { username?: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const viewer = await getCurrentUser();
        const viewed = username ? await getUserProfile(username) : viewer;
        if (!cancelled) {
          setCurrentUser(viewer);
          setProfile(viewed);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Profile not found.");
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [username]);

  const isOwner = Boolean(profile && currentUser && profile.id === currentUser.id);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="mx-auto w-full max-w-6xl">
          {error ? (
            <div className="py-24 text-center text-sm text-red-500">Profile not found.</div>
          ) : !profile || !currentUser ? (
            <div className="py-24 text-center text-sm text-gray-500">Loading profile...</div>
          ) : (
            <>
              <ProfileHeader profile={profile} isOwner={isOwner} onProfileChange={setProfile} />
              <ProfileTabs profile={profile} isOwner={isOwner} />
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}