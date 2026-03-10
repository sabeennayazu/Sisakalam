"use client";

import SettingsSidebar from "@/components/Settings/SettingsSidebar";
import AuthGuard from "@/components/AuthGuard";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-white pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-serif font-bold text-black mb-2">Settings</h1>
                        <p className="text-gray-500 font-serif italic text-lg">
                            Manage your account and platform preferences.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Sidebar */}
                        <SettingsSidebar />

                        {/* Content */}
                        <main className="flex-1 max-w-3xl">
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
