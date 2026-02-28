"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, User, Plus, Bell } from "lucide-react";

import MegaMenu from "./MegaMenu";
import BrowseMenu from "./BrowseMenu";
import ProfileMenu from "./ProfileMenu";

export type MenuType = "genre" | "browse" | "profile" | null;

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const navRef = useRef<HTMLDivElement>(null);

  /* ---------- CLOSE ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 return (
  <nav
    ref={navRef}
    className="
      fixed top-4 inset-x-0
      z-50
      flex justify-center
      pointer-events-none
    "
  >
    {/* ACTUAL NAVBAR */}
    <div
      className="
        pointer-events-auto
        w-full max-w-6xl
        backdrop-blur-md
        bg-white/70
        border border-gray-200/40
        shadow-lg
        rounded-2xl
        px-8 py-4
      "
    >
      <div className="flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-12">

          <Link href="/" className="font-bold text-xl text-black">
            Sisakalam
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 text-sm hover:text-black transition"
            >
              Home
            </Link>

            {/* Browse */}
            <div
              onMouseEnter={() => setOpenMenu("browse")}
              onMouseLeave={() => setOpenMenu(null)}
              className="relative"
            >
              <button className="flex gap-1 items-center text-gray-700 text-sm hover:text-black transition">
                Browse
                <ChevronDown size={16} strokeWidth={1.5} />
              </button>

              {openMenu === "browse" && <BrowseMenu />}
            </div>

            {/* Genre */}
            <div
              onMouseEnter={() => setOpenMenu("genre")}
              onMouseLeave={() => setOpenMenu(null)}
              className="relative"
            >
              <button className="flex gap-1 items-center text-gray-700 text-sm hover:text-black transition">
                Genre
                <ChevronDown size={16} strokeWidth={1.5} />
              </button>

              {openMenu === "genre" && <MegaMenu />}
            </div>

            <Link
              href="/library"
              className="text-gray-700 text-sm hover:text-black transition"
            >
              Library
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          <input
            placeholder="Search..."
            className="
              border border-gray-200/60
              rounded-full
              px-4 py-2
              text-sm
              bg-white/50
              focus:outline-none
              focus:border-gray-300
              focus:bg-white/80
              transition
            "
          />

          <button className="
            px-5 py-2
            rounded-full
            bg-black text-white
            font-medium text-sm
            hover:bg-gray-900
            transition-all
            shadow-lg shadow-black/20
            hover:shadow-xl hover:shadow-black/30
            flex items-center gap-2
          ">
            <Plus size={18} strokeWidth={1.5}/>
            start writing
          </button>

          <Bell
            size={18}
            strokeWidth={1.5}
            className="text-gray-700 cursor-pointer hover:text-black transition"
          />

          <div
            onMouseEnter={() => setOpenMenu("profile")}
            onMouseLeave={() => setOpenMenu(null)}
            className="relative cursor-pointer"
          >
            <User
              size={18}
              strokeWidth={1.5}
              className="text-gray-700 hover:text-black transition"
            />
            {openMenu === "profile" && <ProfileMenu />}
          </div>

        </div>
      </div>
    </div>
  </nav>
);
}