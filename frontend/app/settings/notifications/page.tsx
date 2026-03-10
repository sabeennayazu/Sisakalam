"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import Switch from "@/components/ui/Switch";
import RadioGroup from "@/components/ui/RadioGroup";

export default function NotificationSettings() {
  const [inAppFollowers, setInAppFollowers] = useState(true);
  const [inAppLikesStories, setInAppLikesStories] = useState(true);
  const [inAppLikesPoems, setInAppLikesPoems] = useState(true);
  const [inAppComments, setInAppComments] = useState(true);
  const [inAppReplies, setInAppReplies] = useState(true);
  
  const [emailDigest, setEmailDigest] = useState("daily");

  const emailOptions = [
    { value: "instant", label: "Instant" },
    { value: "daily", label: "Daily summary" },
    { value: "weekly", label: "Weekly summary" },
    { value: "disabled", label: "Disabled" },
  ];

  return (
    <div className="space-y-6">
      <SettingSection 
        title="In-App Notifications" 
        description="Alerts you receive while using Sisakalam."
      >
        <SettingItem label="New Followers">
          <Switch checked={inAppFollowers} onChange={setInAppFollowers} />
        </SettingItem>
        <SettingItem label="Likes on Stories">
          <Switch checked={inAppLikesStories} onChange={setInAppLikesStories} />
        </SettingItem>
        <SettingItem label="Likes on Poems">
          <Switch checked={inAppLikesPoems} onChange={setInAppLikesPoems} />
        </SettingItem>
        <SettingItem label="Comments & Reviews">
          <Switch checked={inAppComments} onChange={setInAppComments} />
        </SettingItem>
        <SettingItem label="Replies to your comments">
          <Switch checked={inAppReplies} onChange={setInAppReplies} />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Email Notifications" 
        description="Control how often you receive emails."
      >
        <SettingItem label="Email Frequency" align="start">
          <RadioGroup 
            name="emailDigest"
            options={emailOptions}
            value={emailDigest}
            onChange={setEmailDigest}
          />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
