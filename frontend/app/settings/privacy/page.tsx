"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import Switch from "@/components/ui/Switch";
import RadioGroup from "@/components/ui/RadioGroup";

export default function PrivacySettings() {
  const [showInSearch, setShowInSearch] = useState(true);
  const [hideFromEngines, setHideFromEngines] = useState(false);
  const [hideFollowers, setHideFollowers] = useState(false);

  const [commentsStories, setCommentsStories] = useState("everyone");
  const [commentsPoems, setCommentsPoems] = useState("everyone");
  const [messages, setMessages] = useState("registered");
  const [tags, setTags] = useState("followers");

  const permissionOptions = [
    { value: "everyone", label: "Everyone" },
    { value: "registered", label: "Registered users" },
    { value: "followers", label: "Followers only" },
    { value: "noone", label: "No one" },
  ];

  return (
    <div className="space-y-6">
      <SettingSection 
        title="Profile Privacy" 
        description="Control who can see your profile and activity."
      >
        <SettingItem 
          label="Show in Search" 
          description="Appear in Sisakalam search results."
        >
          <Switch checked={showInSearch} onChange={setShowInSearch} />
        </SettingItem>
        <SettingItem 
          label="Hide from Search Engines" 
          description="Prevent Google and others from indexing your profile."
        >
          <Switch checked={hideFromEngines} onChange={setHideFromEngines} />
        </SettingItem>
        <SettingItem 
          label="Hide Followers List" 
          description="Make your followers list private."
        >
          <Switch checked={hideFollowers} onChange={setHideFollowers} />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Interaction Permissions" 
        description="Control who can interact with you and your content."
      >
        <SettingItem label="Comment on Stories" align="start">
          <RadioGroup 
            name="commentsStories"
            options={permissionOptions}
            value={commentsStories}
            onChange={setCommentsStories}
          />
        </SettingItem>
        <SettingItem label="Comment on Poems" align="start">
          <RadioGroup 
            name="commentsPoems"
            options={permissionOptions}
            value={commentsPoems}
            onChange={setCommentsPoems}
          />
        </SettingItem>
        <SettingItem label="Send Messages" align="start">
          <RadioGroup 
            name="messages"
            options={permissionOptions}
            value={messages}
            onChange={setMessages}
          />
        </SettingItem>
        <SettingItem label="Tag You" align="start">
          <RadioGroup 
            name="tags"
            options={permissionOptions}
            value={tags}
            onChange={setTags}
          />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
