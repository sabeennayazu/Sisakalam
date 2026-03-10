"use client";

import SettingSection from "@/components/Settings/SettingSection";
import SettingItem from "@/components/Settings/SettingItem";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const legalLinks = [
  { name: "Terms of Service", href: "/legal/terms" },
  { name: "Privacy Policy", href: "/legal/privacy" },
  { name: "Content Guidelines", href: "/legal/guidelines" },
  { name: "Copyright Policy", href: "/legal/copyright" },
];

export default function LegalSettings() {
  return (
    <div className="space-y-6">
      <SettingSection 
        title="Legal & Policies" 
        description="Read our terms, conditions and policies to understand how we protect you."
      >
        <div className="divide-y divide-gray-100 italic">
          {legalLinks.map((link) => (
            <Link 
                key={link.name} 
                href={link.href}
                className="flex items-center justify-between py-4 group"
            >
              <span className="text-sm font-semibold text-black group-hover:underline">
                {link.name}
              </span>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
            </Link>
          ))}
        </div>
      </SettingSection>

      <div className="mt-20 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              © 2026 Sisakalam Platform. All rights reserved.
          </p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-2">
              Version 1.4.2-noir
          </p>
      </div>
    </div>
  );
}
