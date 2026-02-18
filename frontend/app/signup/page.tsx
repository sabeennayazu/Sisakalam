"use client";

import { useState } from "react";
import Link from "next/link";
import SignupModal from "@/components/SignupModal";

export default function SignupPage() {
  const [signupOpen, setSignupOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F9F5EE] text-[#191919]">
      {/* NAVBAR */}
      <header className="w-full border-b border-black/10">
        <div className="mx-auto max-w-7xl p-5 flex justify-between items-center">
          <div className="flex flex-col">
            <Link href={"/"}>
              <h1 className="text-4xl font-serif font-bold">Sisakalam</h1>
              <p className="text-sm">Waves of stories for all minds.</p>
            </Link>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/story" className="hover:underline">
              Our story
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-900"
            >
              Back Home
            </Link>
          </nav>
        </div>
      </header>

      {/* SIGNUP MODAL */}
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
    </div>
  );
}
