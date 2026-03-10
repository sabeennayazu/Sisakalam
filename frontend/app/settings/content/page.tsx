"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import Switch from "@/components/ui/Switch";
import RadioGroup from "@/components/ui/RadioGroup";

export default function ContentSettings() {
  const [matureFilter, setMatureFilter] = useState("warning");
  const [fontSize, setFontSize] = useState("medium");
  const [readingTheme, setReadingTheme] = useState("sepia");
  const [privateLibrary, setPrivateLibrary] = useState(false);

  return (
    <div className="space-y-6">
      <SettingSection 
        title="Mature Content Filter" 
        description="Control how mature content is displayed to you."
      >
        <SettingItem label="Filter Level" align="start">
          <RadioGroup 
            name="matureFilter"
            options={[
              { value: "hide", label: "Hide mature content" },
              { value: "warning", label: "Show with warning" },
              { value: "show", label: "Show normally" },
            ]}
            value={matureFilter}
            onChange={setMatureFilter}
          />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Reading Preferences" 
        description="Adjust the reading experience to your liking."
      >
        <SettingItem label="Font Size" align="start">
            <RadioGroup 
                name="fontSize"
                options={[
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                ]}
                value={fontSize}
                onChange={setFontSize}
            />
        </SettingItem>
        <SettingItem label="Reading Theme" align="start">
            <RadioGroup 
                name="readingTheme"
                options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "sepia", label: "Sepia" },
                ]}
                value={readingTheme}
                onChange={setReadingTheme}
            />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Library Settings" 
        description="Manage your library's visibility."
      >
        <SettingItem label="Private Library">
          <Switch checked={privateLibrary} onChange={setPrivateLibrary} />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
