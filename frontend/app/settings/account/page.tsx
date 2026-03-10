"use client";

import { useState } from "react";
import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import Switch from "@/components/ui/Switch";

export default function AccountSettings() {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="space-y-6">
      <SettingSection 
        title="Email & Password" 
        description="Manage your account's security and contact information."
      >
        <SettingItem 
          label="Email Address" 
          description="julian.valerius@example.com"
        >
          <button className="text-sm font-semibold text-black hover:underline">Change</button>
        </SettingItem>
        <SettingItem 
          label="Password" 
          description="Last changed 3 months ago"
        >
          <button className="text-sm font-semibold text-black hover:underline">Change</button>
        </SettingItem>
        <SettingItem 
          label="Email Verification" 
          description="Your email is verified."
        >
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 uppercase tracking-wider">
            Verified
          </span>
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Security" 
        description="Additional layers of protection for your account."
      >
        <SettingItem 
          label="Two-Factor Authentication" 
          description="Secure your account with 2FA."
        >
          <Switch checked={twoFactor} onChange={setTwoFactor} />
        </SettingItem>
        <SettingItem 
          label="Active Sessions" 
          description="You are currently logged in on 2 devices."
        >
          <button className="text-sm font-semibold text-black hover:underline">View Sessions</button>
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Connected Accounts" 
        description="Connect your social accounts for easier login."
      >
        <SettingItem label="Google" description="Not connected">
          <button className="text-sm font-semibold text-black hover:underline font-serif">Connect</button>
        </SettingItem>
        <SettingItem label="GitHub" description="Connected as @jvalerius">
          <button className="text-sm font-semibold text-red-600 hover:underline">Disconnect</button>
        </SettingItem>
      </SettingSection>

      <SettingSection 
        title="Danger Zone" 
        description="Actions that can affect your account permanently."
        danger
      >
        <SettingItem 
          label="Deactivate Account" 
          description="Temporarily hide your profile and content."
        >
          <button className="text-sm font-semibold text-black hover:underline">Deactivate</button>
        </SettingItem>
        <SettingItem 
          label="Delete Account" 
          description="Permanently remove all your data."
        >
          <button className="text-sm font-semibold text-red-600 hover:underline">Delete Account</button>
        </SettingItem>
      </SettingSection>
    </div>
  );
}
