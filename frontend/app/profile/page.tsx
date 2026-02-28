"use client";

import AuthGuard from "@/components/AuthGuard";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTabs from "@/components/Profile/ProfileTabs";

export default function ProfilePage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-white pt-24 pb-12">
                <div className="max-w-6xl mx-auto w-full">
                    <ProfileHeader />
                    <ProfileTabs />
                </div>
            </div>
        </AuthGuard>
    );
}
