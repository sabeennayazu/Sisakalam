"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import Switch from "@/components/ui/Switch";

export default function CreatorSettings() {
  const [enableTips, setEnableTips] = useState(false);
  const [enableSubs, setEnableSubs] = useState(false);
  
  const [showReads, setShowReads] = useState(true);
  const [showFollowers, setShowFollowers] = useState(true);
  const [showRating, setShowRating] = useState(true);

  return (
    <div className="space-y-6">
      <SettingSection 
        title="Monetization" 
        description="Tools to help you earn from your creativity (Coming Soon)."
      >
        <SettingItem label="Enable Tips" description="Allow readers to send tips on your content.">
          <Switch checked={enableTips} onChange={setEnableTips} disabled />
        </SettingItem>
        <SettingItem label="Enable Subscriptions" description="Offer premium content to your subscribers.">
          <Switch checked={enableSubs} onChange={setEnableSubs} disabled />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Author Stats Visibility" 
        description="Control what performance metrics are visible to readers."
      >
        <SettingItem label="Total Reads">
          <Switch checked={showReads} onChange={setShowReads} />
        </SettingItem>
        <SettingItem label="Follower Count">
          <Switch checked={showFollowers} onChange={setShowFollowers} />
        </SettingItem>
        <SettingItem label="Reviews & Ratings">
          <Switch checked={showRating} onChange={setShowRating} />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
