"use client";

import { useEffect, useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import Switch from "@/components/ui/Switch";
import RadioGroup from "@/components/ui/RadioGroup";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/utils/notifications.api";

const defaultPreferences: NotificationPreferences = {
  new_followers: true,
  story_likes: true,
  poem_likes: true,
  story_bookmarks: true,
  poem_bookmarks: true,
  comments: true,
  replies: true,
  followed_updates: true,
  email_digest_frequency: "daily",
};

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void getNotificationPreferences()
      .then((values) => { if (!cancelled) setPreferences(values); })
      .catch(() => { if (!cancelled) setError("Notification preferences could not be loaded."); });
    return () => { cancelled = true; };
  }, []);

  const updateBoolean = async (key: Exclude<keyof NotificationPreferences, "email_digest_frequency">, value: boolean) => {
    const previous = preferences;
    setPreferences((current) => ({ ...current, [key]: value }));
    setError("");
    try {
      await updateNotificationPreferences({ [key]: value });
    } catch {
      setPreferences(previous);
      setError("Your preference could not be saved. Please try again.");
    }
  };

  const updateEmailFrequency = async (value: string) => {
    if (!["instant", "daily", "weekly", "disabled"].includes(value)) return;
    const frequency = value as NotificationPreferences["email_digest_frequency"];
    const previous = preferences.email_digest_frequency;
    setPreferences((current) => ({ ...current, email_digest_frequency: frequency }));
    setError("");
    try {
      await updateNotificationPreferences({ email_digest_frequency: frequency });
    } catch {
      setPreferences((current) => ({ ...current, email_digest_frequency: previous }));
      setError("Your preference could not be saved. Please try again.");
    }
  };

  const emailOptions = [
    { value: "instant", label: "Instant" },
    { value: "daily", label: "Daily summary" },
    { value: "weekly", label: "Weekly summary" },
    { value: "disabled", label: "Disabled" },
  ];

  return (
    <div className="space-y-6">
      {error && <p role="status" className="text-sm text-red-700">{error}</p>}
      <SettingSection 
        title="In-App Notifications" 
        description="Alerts you receive while using Sisakalam."
      >
        <SettingItem label="New stories, poems & chapters from followed writers">
          <Switch checked={preferences.followed_updates} onChange={(value) => void updateBoolean("followed_updates", value)} />
        </SettingItem>
        <SettingItem label="New Followers">
          <Switch checked={preferences.new_followers} onChange={(value) => void updateBoolean("new_followers", value)} />
        </SettingItem>
        <SettingItem label="Likes on Stories">
          <Switch checked={preferences.story_likes} onChange={(value) => void updateBoolean("story_likes", value)} />
        </SettingItem>
        <SettingItem label="Likes on Poems">
          <Switch checked={preferences.poem_likes} onChange={(value) => void updateBoolean("poem_likes", value)} />
        </SettingItem>
        <SettingItem label="Bookmarks on Stories">
          <Switch checked={preferences.story_bookmarks} onChange={(value) => void updateBoolean("story_bookmarks", value)} />
        </SettingItem>
        <SettingItem label="Bookmarks on Poems">
          <Switch checked={preferences.poem_bookmarks} onChange={(value) => void updateBoolean("poem_bookmarks", value)} />
        </SettingItem>
        <SettingItem label="Comments & Reviews">
          <Switch checked={preferences.comments} onChange={(value) => void updateBoolean("comments", value)} />
        </SettingItem>
        <SettingItem label="Replies to your comments">
          <Switch checked={preferences.replies} onChange={(value) => void updateBoolean("replies", value)} />
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
            value={preferences.email_digest_frequency}
            onChange={(value) => void updateEmailFrequency(value)}
          />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
