"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  User,
  Plus,
  Bell,
  PenLine,
  Menu,
  X,
  BookOpen,
  LayoutGrid,
  LogOut,
} from "lucide-react";

import MegaMenu from "./MegaMenu";
import BrowseMenu from "./BrowseMenu";
import ProfileMenu from "./ProfileMenu";
import { logout } from "@/utils/auth";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<"genre" | "browse" | "profile" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  /* Close desktop dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
      >
        <div className="w-full max-w-6xl backdrop-blur-md bg-white/70 border border-gray-200/40 shadow-lg rounded-2xl px-6 py-3">

          {/* DESKTOP */}
          <div className="hidden md:flex justify-between items-center">

            {/* LEFT */}
            <div className="flex items-center gap-12">
              <Link href="/" className="font-bold text-xl text-black flex items-center">
                <PenLine size={18} className="mr-2" />
                Sisakalam
              </Link>

              <div className="flex items-center gap-8">
                <div
                  onMouseEnter={() => setOpenMenu("browse")}
                  onMouseLeave={() => setOpenMenu(null)}
                  className="relative"
                >
                  <button className="flex items-center gap-1 text-sm text-black hover:text-black">
                    Browse <ChevronDown size={16} />
                  </button>
                  {openMenu === "browse" && <BrowseMenu />}
                </div>

                <div
                  onMouseEnter={() => setOpenMenu("genre")}
                  onMouseLeave={() => setOpenMenu(null)}
                  className="relative"
                >
                  <button className="flex items-center gap-1 text-sm text-black hover:text-black">
                    Genre <ChevronDown size={16} />
                  </button>
                  {openMenu === "genre" && <MegaMenu />}
                </div>

                <Link href="/library" className="text-sm text-black hover:text-black">
                  Library
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">
              <input
                placeholder="Search..."
                className="border border-gray-500 rounded-full px-10 py-2 text-sm text-gray-500"
              />

              <button className="px-5 py-2 rounded-full bg-black text-white text-sm flex items-center gap-2 cursor-pointer">
                <Plus size={16} />
                Start Writing
              </button>

              <Bell size={20} className="cursor-pointer text-black" strokeWidth={2} />

              <div
                onMouseEnter={() => setOpenMenu("profile")}
                onMouseLeave={() => setOpenMenu(null)}
                className="relative cursor-pointer"
              >
                <User size={20} className="text-black" strokeWidth={2} />
                {openMenu === "profile" && <ProfileMenu />}
              </div>
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex md:hidden justify-between items-center">

            {/* Logo */}
            <Link href="/" className="font-bold text-lg text-black flex items-center">
              <PenLine size={18} className="mr-2 text-black" strokeWidth={2} />
              Sisakalam
            </Link>

            {/* Search */}
            <input
              placeholder="Search..."
              className="flex-1 mx-4 border border-gray-500 rounded-full px-3 py-1 text-sm text-gray-500"
            />

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(true)}>
              <Menu size={24} className="text-black cursor-pointer" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition ${mobileOpen ? "visible" : "invisible"
          }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex justify-end items-center p-5 border-b">
            <X
              size={22}
              className="cursor-pointer text-black"
              onClick={() => setMobileOpen(false)}
            />
          </div>

          <div className="p-5 space-y-6 text-gray-700">

            <div className="flex items-center gap-3 cursor-pointer">
              <LayoutGrid size={18} className="text-black" />
              Browse
            </div>

            <div className="flex items-center gap-3 cursor-pointer">
              <ChevronDown size={18} className="text-black" />
              Genre
            </div>

            <div className="flex items-center gap-3 cursor-pointer">
              <BookOpen size={18} className="text-black" />
              Library
            </div>

            <div className="flex items-center gap-3 cursor-pointer">
              <User size={18} className="text-black" />
              Profile
            </div>

            {/* Divider */}
            <div className="my-2 h-px bg-gray-200"></div>

            {/* Logout */}
            <div
              onClick={logout}
              className="flex items-center gap-3 cursor-pointer text-red-500 hover:text-red-600"
            >
              <LogOut size={18} />
              Logout
            </div>

          </div>

          <div className="absolute bottom-6 left-0 right-0 px-5">
            <button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full flex items-center justify-center gap-2 shadow-lg">
              <Plus size={16} />
              Start Writing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}