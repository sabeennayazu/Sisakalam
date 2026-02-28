"use client";

import { useState } from "react";
import CurrentReads from "@/components/Library/CurrentReads";
import Saved from "@/components/Library/Saved";
import History from "@/components/Library/History";

type TabType = "current" | "saved" | "history";

// Dummy data mimicking a JSON API response
const trendingTags = [
    { id: 1, name: "#Poetry", count: 1240, color: "yellow-400" },
    { id: 2, name: "#SciFi", count: 890, color: "blue-400" },
    { id: 3, name: "#Romance", count: 2100, color: "pink-400" },
    { id: 4, name: "#Mystery", count: 670, color: "green-400" },
    { id: 5, name: "#Fantasy", count: 1530, color: "cyan-400" },
    { id: 6, name: "#Horror", count: 410, color: "red-400" },
    { id: 7, name: "#Drama", count: 980, color: "orange-400" },
    { id: 8, name: "#Thriller", count: 760, color: "purple-400" },
];

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<TabType>("current");

    const renderContent = () => {
        switch (activeTab) {
            case "current":
                return <CurrentReads />;
            case "saved":
                return <Saved />;
            case "history":
                return <History />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white flex py-18">
            {/* ================= Sidebar ================= */}
            <aside className="w-64 border-r border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-4">
                    MY LIBRARY
                </h2>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab("current")}
                        className={`w-full text-left text-black px-4 py-2 rounded-lg ${activeTab === "current"
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "hover:bg-gray-300"
                            }`}
                    >
                        Current Reads
                    </button>

                    <button
                        onClick={() => setActiveTab("saved")}
                        className={`w-full text-left text-black px-4 py-2 rounded-lg ${activeTab === "saved"
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "hover:bg-gray-300"
                            }`}
                    >
                        Saved
                    </button>

                    <button
                        onClick={() => setActiveTab("history")}
                        className={`w-full text-left text-black px-4 py-2 rounded-lg ${activeTab === "history"
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "hover:bg-gray-300"
                            }`}
                    >
                        History
                    </button>
                </nav>

                {/* Trending Tags */}
                <div className="mt-10">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">
                        TRENDING TAGS
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {trendingTags.map((tag) => (
                            <span
                                key={tag.id}
                                className={`px-3 py-1 text-sm text-gray-600 bg-${tag.color} rounded-full`}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ================= Main Content ================= */}
            <main className="flex-1 p-8">{renderContent()}</main>
        </div>
    );
}