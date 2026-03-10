"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import { X } from "lucide-react";

export default function ModerationSettings() {
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, username: "harsh_critic", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" },
    { id: 2, username: "spam_bot_99", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100" },
  ]);

  const [mutedWords, setMutedWords] = useState(["spam", "buy now"]);
  const [newWord, setNewWord] = useState("");

  const unblockUser = (id: number) => {
    setBlockedUsers(blockedUsers.filter(user => user.id !== id));
  };

  const addMutedWord = () => {
    if (newWord && !mutedWords.includes(newWord)) {
      setMutedWords([...mutedWords, newWord]);
      setNewWord("");
    }
  };

  const removeMutedWord = (word: string) => {
    setMutedWords(mutedWords.filter(w => w !== word));
  };

  return (
    <div className="space-y-6">
      <SettingSection 
        title="Blocked Users" 
        description="Manage users you've blocked from interacting with you."
      >
        <div className="py-4 space-y-4">
          {blockedUsers.length > 0 ? (
            blockedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full grayscale" />
                  <span className="text-sm font-medium text-black">@{user.username}</span>
                </div>
                <button 
                  onClick={() => unblockUser(user.id)}
                  className="px-4 py-1.5 text-xs font-bold border border-black rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  Unblock
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No blocked users.</p>
          )}
        </div>
      </SettingSection>

      <SettingSection 
        title="Muted Words" 
        description="Filter comments containing these keywords."
      >
        <div className="py-4 space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Add keyword..."
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
            />
            <button 
              onClick={addMutedWord}
              className="px-6 py-2 text-sm font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {mutedWords.map(word => (
              <span key={word} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-black">
                {word}
                <button onClick={() => removeMutedWord(word)} className="p-0.5 hover:bg-gray-200 rounded-full">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
