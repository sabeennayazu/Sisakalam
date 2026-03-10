"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import Switch from "@/components/ui/Switch";
import RadioGroup from "@/components/ui/RadioGroup";

export default function WritingSettings() {
  const [contentType, setContentType] = useState("story");
  const [maturity, setMaturity] = useState("everyone");
  const [autoSave, setAutoSave] = useState("30");
  const [darkModeEditor, setDarkModeEditor] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [editorType, setEditorType] = useState("richText");

  return (
    <div className="space-y-6">
      <SettingSection 
        title="Default Writing Settings" 
        description="Your preferred defaults for new creations."
      >
        <SettingItem label="Default Content Type" align="start">
          <RadioGroup 
            name="contentType"
            options={[
              { value: "story", label: "Story" },
              { value: "poem", label: "Poem" },
            ]}
            value={contentType}
            onChange={setContentType}
          />
        </SettingItem>
        <SettingItem label="Default Maturity Level" align="start">
          <RadioGroup 
            name="maturity"
            options={[
              { value: "everyone", label: "Everyone" },
              { value: "mature", label: "Mature (18+)" },
            ]}
            value={maturity}
            onChange={setMaturity}
          />
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Editor Preferences" 
        description="Customize your writing environment."
      >
        <SettingItem label="Editor Type" align="start">
          <RadioGroup 
            name="editorType"
            options={[
              { value: "markdown", label: "Markdown" },
              { value: "richText", label: "Rich Text" },
            ]}
            value={editorType}
            onChange={setEditorType}
          />
        </SettingItem>
        <SettingItem label="Dark Mode Editor">
          <Switch checked={darkModeEditor} onChange={setDarkModeEditor} />
        </SettingItem>
        <SettingItem label="Focus Mode">
          <Switch checked={focusMode} onChange={setFocusMode} />
        </SettingItem>
        <SettingItem label="Auto Save Interval" align="start">
            <RadioGroup 
                name="autoSave"
                options={[
                    { value: "30", label: "30 seconds" },
                    { value: "60", label: "1 minute" },
                    { value: "300", label: "5 minutes" },
                ]}
                value={autoSave}
                onChange={setAutoSave}
            />
        </SettingItem>
      </SettingSection>
    </div>
  );
}
