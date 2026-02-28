"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal"; // <-- ADD THIS IMPORT

export default function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#191919] relative">
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
            <a href="/story" className="hover:underline">Our story</a>

            <button
              onClick={() => setLoginOpen(true)}
              className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-900"
            >
              Get started
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 py-24 px-8">
        {/* LEFT TEXT */}
        <div className="flex flex-col justify-center">
          <h1 className="text-7xl leading-tight font-serif font-bold mb-6">
            A World built with words
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Discover stories. Create your own. Express yourself, expand your mind.
          </p>

          <button
            onClick={() => setLoginOpen(true)}
            className="w-40 px-4 py-3 rounded-full bg-black text-white hover:bg-gray-900 text-lg"
          >
            Start reading
          </button>
        </div>

        {/* RIGHT ARTWORK */}
        <div className="relative flex justify-center items-center">
          <Image
            src="/images/books.png"
            alt="Artwork"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 py-6 text-sm text-gray-600">
        <div className="mx-auto w-full flex pr-4 justify-end">
          <p className="text-sm font-sans">
            Created by: <a href="/">Sabeen Nayazu</a>
          </p>
        </div>
      </footer>

      {/* LOGIN POPUP */}
      <AuthModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
