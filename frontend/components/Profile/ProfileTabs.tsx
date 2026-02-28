"use client";

import { useState } from "react";
import WorksTab from "./WorksTab";
import PoemsTab from "./PoemsTab";
import StoriesTab from "./StoriesTab";
import SavedTab from "./SavedTab";
import AboutTab from "./AboutTab";

const tabs = ["Works", "Poems", "Stories", "Saved", "About"];

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState("Works");

    return (
        <div className="w-full max-w-5xl mx-auto px-4 mb-20">
            {/* Tab Navigation */}
            <div className="flex justify-center border-b border-gray-200 mb-10">
                <nav className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === tab
                                    ? "text-black"
                                    : "text-gray-400 hover:text-gray-800"
                                }`}
                        >
                            {tab}
                            {/* Active Underline */}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "Works" && <WorksTab />}
                {activeTab === "Poems" && <PoemsTab />}
                {activeTab === "Stories" && <StoriesTab />}
                {activeTab === "Saved" && <SavedTab />}
                {activeTab === "About" && <AboutTab />}
            </div>
        </div>
    );
}
