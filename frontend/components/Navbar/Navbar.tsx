"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Plus,
  Bell,
  PenLine,
  Menu,
  X,
  BookOpen,
  LayoutGrid,
  LogOut,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ProfileMenu from "./ProfileMenu";
import NotificationPopup from "@/components/Notifications/NotificationPopup";
import SearchPopup from "@/components/search/SearchPopup";
import UserAvatar from "@/components/shared/UserAvatar";
import { logout, isAuthenticated } from "@/utils/auth";
import { getUnreadCount } from "@/utils/notifications.api";
import { getCurrentUser, type Profile } from "@/utils/account.api";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<"profile" | "notifications" | "search" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // null = auth not checked yet
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* Check authentication on mount and listen for changes */
  useEffect(() => {
    const checkAuth = () => setIsAuth(isAuthenticated());
    checkAuth(); // initial check

    // Listen for custom auth change events or storage changes (login/logout)
    window.addEventListener("authChange", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!isAuth) return;

    let active = true;
    const refreshUnreadCount = () => {
      void getUnreadCount()
        .then(({ unread_count }) => { if (active) setUnreadCount(unread_count); })
        .catch(() => undefined);
    };
    refreshUnreadCount();
    const interval = window.setInterval(refreshUnreadCount, 60_000);
    window.addEventListener("focus", refreshUnreadCount);
    window.addEventListener("sisakalam:notifications-updated", refreshUnreadCount);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshUnreadCount);
      window.removeEventListener("sisakalam:notifications-updated", refreshUnreadCount);
    };
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth) return;
    let active = true;
    void getCurrentUser().then((profile) => {
      if (active) setCurrentProfile(profile);
    }).catch(() => undefined);
    const handleProfileImageUpdate = (event: Event) => {
      const { detail } = event as CustomEvent<{ userId: number; imageUrl: string }>;
      setCurrentProfile((profile) => profile?.id === detail.userId
        ? { ...profile, profile_picture: detail.imageUrl }
        : profile);
    };
    window.addEventListener("sisakalam:profile-picture-updated", handleProfileImageUpdate);
    return () => {
      active = false;
      window.removeEventListener("sisakalam:profile-picture-updated", handleProfileImageUpdate);
    };
  }, [isAuth]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setOpenMenu(null);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Only render navbar if auth check completed and user is authenticated
  if (isAuth === null) return null; // auth not yet determined
  if (!isAuth) return null; // user not logged in

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
              <Link
                href="/home"
                className="font-bold text-xl text-black flex items-center"
              >
                <PenLine size={18} className="mr-2" />
                Sisakalam
              </Link>

              <div className="flex items-center gap-8">
                <Link href="/stories" className="text-sm text-black">
                  Stories
                </Link>
                <Link href="/poems" className="text-sm text-black">
                  Poems
                </Link>
                <Link href="/library" className="text-sm text-black">
                  Library
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <form onSubmit={submitSearch} className="flex h-9 w-44 items-center gap-2 rounded-full border border-gray-300 bg-white px-3 xl:w-56">
                  <Search size={15} className="shrink-0 text-gray-500" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setOpenMenu("search")}
                    onKeyDown={(event) => { if (event.key === "Escape") setOpenMenu(null); }}
                    placeholder="Search..."
                    aria-label="Search stories, poems, and users"
                    className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
                  />
                </form>
                {openMenu === "search" && <div className="absolute left-0 top-full z-50 mt-2"><SearchPopup query={searchQuery} onClose={() => setOpenMenu(null)} /></div>}
              </div>

              <Link href="/write">
                <button className="px-5 py-2 rounded-full bg-black text-white text-sm flex items-center gap-2 cursor-pointer hover:bg-white hover:text-black border border-black transition-all duration-200">
                  <Plus size={16} />
                  Start Writing
                </button>
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
                  aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
                  aria-expanded={openMenu === "notifications"}
                  className="flex items-center text-black"
                >
                  <Bell size={20} className="cursor-pointer" strokeWidth={2} />
                  {unreadCount > 0 && <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold leading-none text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                </button>
                {openMenu === "notifications" && (
                  <div className="absolute right-0 top-full z-50 mt-3">
                    <NotificationPopup />
                  </div>
                )}
              </div>

              <div
                onMouseEnter={() => setOpenMenu("profile")}
                onMouseLeave={() => setOpenMenu(null)}
                className="relative cursor-pointer"
              >
                {currentProfile ? <UserAvatar userId={currentProfile.id} username={currentProfile.username} imageUrl={currentProfile.profile_picture} className="h-8 w-8 border border-gray-300" fallbackClassName="bg-white text-gray-700 text-sm" /> : <User size={20} className="text-black" strokeWidth={2} />}
                {openMenu === "profile" && <ProfileMenu />}
              </div>
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex md:hidden justify-between items-center">
            <Link
              href="/home"
              className="font-bold text-lg text-black flex items-center"
            >
              <PenLine size={18} className="mr-2 text-black" strokeWidth={2} />
              Sisakalam
            </Link>

            <div className="relative mx-3 min-w-0 flex-1">
              <form onSubmit={submitSearch} className="flex h-8 items-center gap-2 rounded-full border border-gray-300 bg-white px-3">
                <Search size={14} className="shrink-0 text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setOpenMenu("search")}
                  onKeyDown={(event) => { if (event.key === "Escape") setOpenMenu(null); }}
                  placeholder="Search..."
                  aria-label="Search stories, poems, and users"
                  className="min-w-0 flex-1 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-500"
                />
              </form>
              {openMenu === "search" && <div className="absolute left-0 top-full z-50 mt-2"><SearchPopup query={searchQuery} onClose={() => setOpenMenu(null)} /></div>}
            </div>

            <button onClick={() => setMobileOpen(true)}>
              <Menu size={24} className="text-black cursor-pointer" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
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
            <Link href="/stories" className="flex items-center gap-3 cursor-pointer" onClick={() => setMobileOpen(false)}>
              <BookOpen size={18} className="text-black" />
              Stories
            </Link>

            <Link href="/poems" className="flex items-center gap-3 cursor-pointer" onClick={() => setMobileOpen(false)}>
              <PenLine size={18} className="text-black" />
              Poems
            </Link>

            <Link href="/library" className="flex items-center gap-3 cursor-pointer" onClick={() => setMobileOpen(false)}>
              <LayoutGrid size={18} className="text-black" />
              Library
            </Link>

            <div className="flex items-center gap-3 cursor-pointer">
              <User size={18} className="text-black" />
              Profile
            </div>

            <div className="my-2 h-px bg-gray-200"></div>

            <div
              onClick={() => {
                logout();
                setIsAuth(false); // immediately hide navbar on logout
              }}
              className="flex items-center gap-3 cursor-pointer text-red-500 hover:text-red-600"
            >
              <LogOut size={18} />
              Logout
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-5">
            <Link href="/write">
              <button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full flex items-center justify-center gap-2 shadow-lg">
                <Plus size={16} />
                Start Writing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}