"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import RadioGroup from "@/components/ui/RadioGroup";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("monochrome");

  return (
    <div className="space-y-6">
      <SettingSection 
        title="UI Theme" 
        description="Choose how Sisakalam looks to you."
      >
        <SettingItem label="Theme Mode" align="start">
          <RadioGroup 
            name="theme"
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "Use System Preferences" },
            ]}
            value={theme}
            onChange={setTheme}
          />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Accent Color" 
        description="Optional subtle accents for the interface."
      >
        <SettingItem label="Accent Preference" align="start">
          <RadioGroup 
            name="accent"
            options={[
              { value: "monochrome", label: "Monochrome (Default)" },
              { value: "slate", label: "Slate Gray" },
              { value: "charcoal", label: "Charcoal" },
            ]}
            value={accent}
            onChange={setAccent}
          />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
