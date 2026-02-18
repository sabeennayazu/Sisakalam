"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";


export default function OurStory() {
  const [loginOpen, setLoginOpen] = useState(false);
  const router = useRouter();

  const [stars, setStars] = useState<
    { size: string; top: string; left: string }[]
  >([]);

  useEffect(() => {
    const s = [...Array(80)].map(() => ({
      size: Math.random() * 3 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
    }));
    setStars(s);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white relative">
      {/* NAVBAR */}
      <header className="w-full border-b border-white/10 bg-[#1A1A1A]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl p-5 flex justify-between items-center">
          <div className="flex flex-col">
            <Link href="/">
              <h1 className="text-4xl font-serif font-bold">Sisakalam</h1>
              <p className="text-sm">Waves of stories for all minds.</p>
            </Link>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="/story" className="hover:underline">
              Our story
            </a>
           

            <button
              onClick={() => setLoginOpen(true)}
              className="px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200"
            >
              Get started
            </button>
          </nav>
        </div>
      </header>

      {/* BACKGROUND STARS */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-70"
              style={{
                width: star.size,
                height: star.size,
                top: star.top,
                left: star.left,
              }}
            ></div>
          ))}
        </div>

        <section className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 py-24 px-8 relative">
          {/* LEFT SECTION */}
          <div>
            <h1 className="text-5xl leading-tight font-serif font-bold mb-10">
              A world woven by words
            </h1>

            <p className="text-gray-300 text-lg leading-8 mb-8">
              Sisakalam is where stories find breath and ideas find light.<br />
              In Nepal, there has never truly been a home for everyday
              storytellers,only shelves for published authors and spaces reserved
              for the certified and celebrated. But what about the quiet writers
              who fill notebooks in the late hours? The readers who search for
              meaning between lines? The amateurs, the dreamers, the young hearts
              who write because it’s the only way to feel understood? For years,
              they have carried their words without a place to set them free.
              Sisakalam was born to change that—to give those voices a home that
              finally listens.
            </p>

            <p className="text-gray-300 text-xl font-medium leading-9 bg-white/10 p-3 mt-4 inline-block">
              Our goal is to create a home for those who live through words,
              <br />
              A place where writers and readers alike can breathe freely, feel
              understood, and know they are not alone. Here, you are seen. Here,
              you are heard. Here, you belong.
            </p>

            <p className="text-gray-300 text-lg leading-8 my-10">
              Here, passion matters more than credentials, and curiosity means
              more than recognition. Sisakalam is a gentle corner of the
              internet—calm, warm, and human—where anyone can write without fear
              and read without limits. It is a sanctuary for expression,
              discovery, and connection. A place where your words aren’t judged
              by popularity, but embraced for their honesty. A place where
              stories grow, where ideas spark, and where the people who once felt
              unseen can finally be heard.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center items-start mt-10 sticky top-0 h-fit">
            <Image
              src="/images/bird.png"
              alt="Story Illustration"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>
        </section>
      </div>

      {/* LOGIN POPUP */}
      <AuthModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
