"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import RadioGroup from "@/components/ui/RadioGroup";

export default function InteractionSettings() {
  const [commentLevel, setCommentLevel] = useState("everyone");
  const [reviewLevel, setReviewLevel] = useState("full");

  return (
    <div className="space-y-6">
      <SettingSection 
        title="Comments" 
        description="Manage comment settings for your stories and poems."
      >
        <SettingItem label="Global Comment Access" align="start">
          <RadioGroup 
            name="commentLevel"
            options={[
              { value: "everyone", label: "Enable comments (Everyone)" },
              { value: "followers", label: "Followers only" },
              { value: "disabled", label: "Disable comments" },
            ]}
            value={commentLevel}
            onChange={setCommentLevel}
          />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Reviews" 
        description="Control how others rate and review your work."
      >
        <SettingItem label="Review System" align="start">
          <RadioGroup 
            name="reviewLevel"
            options={[
              { value: "ratings", label: "Allow ratings only" },
              { value: "full", label: "Allow rating + review" },
              { value: "disabled", label: "Disable reviews" },
            ]}
            value={reviewLevel}
            onChange={setReviewLevel}
          />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
