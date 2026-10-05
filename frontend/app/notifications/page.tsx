
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Bookmark,
  BookOpen,
  CheckCheck,
  Feather,
  Heart,
  LoaderCircle,
  MessageCircle,
  UserPlus,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { apiFetch } from "@/utils/client";
import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
  type NotificationPage,
} from "@/utils/notifications.api";

const filters = [
  { id: "all", label: "All", types: null },
  { id: "stories", label: "Stories", types: ["new_story", "story_like", "story_bookmark"] },
  { id: "poems", label: "Poetry", types: ["new_poem", "poem_like", "poem_bookmark"] },
  { id: "chapters", label: "Chapters", types: ["new_chapter", "chapter_like"] },
  { id: "comments", label: "Comments & reviews", types: ["comment", "reply", "comment_like"] },
  { id: "follows", label: "Follows", types: ["follow"] },
] as const;

function NotificationIcon({ type }: { type: string }) {
  const className = "h-[17px] w-[17px]";

  switch (type) {
    case "new_story":
    case "new_chapter":
      return <BookOpen className={className} strokeWidth={1.7} />;
    case "new_poem":
      return <Feather className={className} strokeWidth={1.7} />;
    case "story_like":
    case "poem_like":
    case "chapter_like":
    case "comment_like":
      return <Heart className={className} strokeWidth={1.7} />;
    case "story_bookmark":
    case "poem_bookmark":
      return <Bookmark className={className} strokeWidth={1.7} />;
    case "comment":
    case "reply":
      return <MessageCircle className={className} strokeWidth={1.7} />;
    case "follow":
      return <UserPlus className={className} strokeWidth={1.7} />;
    default:
      return <Bell className={className} strokeWidth={1.7} />;
  }
}

function dateGroup(value: string) {
  const date = new Date(value);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.floor((startToday.getTime() - startDate.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "Earlier this week";
  return "Earlier";
}

function relativeTime(value: string) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

function actionLabel(notification: NotificationItem) {
  if (notification.type === "new_story") return "Read story";
  if (notification.type === "new_poem") return "Read poem";
  if (notification.type === "new_chapter") return "Continue reading";
  if (notification.type === "follow") return "View profile";
  if (["comment", "reply", "comment_like"].includes(notification.type)) return "Open conversation";
  return "View work";
}

function NotificationRow({
  notification,
  onRead,
  onDismiss,
  onFollowBack,
}: {
  notification: NotificationItem;
  onRead: (id: number) => void;
  onDismiss: (id: number) => void;
  onFollowBack: (username: string) => void;
}) {
  const destination = notification.target_url ?? "/notifications";
  return (
    <article className={`group relative flex min-h-[76px] items-center gap-3 border-b border-[#e9e7e2] px-3 py-3 transition-colors hover:bg-[#f2f0eb] sm:gap-4 sm:px-4 ${notification.is_read ? "bg-white" : "bg-[#fffefa]"}`}>
      {!notification.is_read && <span aria-label="Unread" className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black" />}
      <div className="relative ml-2 h-10 w-10 shrink-0 border border-black/15 bg-[#f1f0ec] sm:ml-1">
        {notification.target_image ? (
          <Image src={notification.target_image} alt="" width={40} height={40} unoptimized className="h-full w-full object-cover" />
        ) : notification.actor?.avatar ? (
          <Image src={notification.actor.avatar} alt="" width={40} height={40} unoptimized className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase text-black/55">{notification.actor?.username.slice(0, 2) ?? "S"}</div>
        )}
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center border border-white bg-black text-white"><NotificationIcon type={notification.type} /></span>
      </div>
      <Link href={destination} onClick={() => onRead(notification.id)} className="min-w-0 flex-1">
        <p className="truncate text-[13px] leading-5 text-[#292825]">
          <span className="mr-1 font-semibold text-black">{notification.actor?.username ?? "A writer"}</span>
          {notification.message}
          {notification.target_title && <span className="ml-1 font-serif font-semibold text-black">“{notification.target_title}”</span>}
        </p>
        <p className="mt-1 text-[10px] uppercase text-[#85827b]">{relativeTime(notification.created_at)}</p>
      </Link>
      <div className="flex shrink-0 items-center gap-1.5">
        {notification.type === "follow" && notification.actor && <button type="button" onClick={() => onFollowBack(notification.actor!.username)} className="hidden h-8 items-center bg-black px-3 text-[9px] font-semibold uppercase text-white hover:bg-[#343330] sm:inline-flex">Follow back</button>}
        <Link href={destination} onClick={() => onRead(notification.id)} className="hidden h-8 items-center bg-black px-3 text-[9px] font-semibold uppercase text-white hover:bg-[#343330] sm:inline-flex">{actionLabel(notification)}</Link>
        <button type="button" onClick={() => onDismiss(notification.id)} title="Dismiss notification" aria-label="Dismiss notification" className="flex h-8 w-8 items-center justify-center text-black/45 hover:bg-black/5 hover:text-black"><X className="h-4 w-4" /></button>
      </div>
    </article>
  );
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getNotifications(), getUnreadCount()])
      .then(([page, unread]) => {
        if (cancelled) return;
        setNotifications(page.results);
        setNextPage(page.next);
        setUnreadCount(unread.unread_count);
      })
      .catch(() => { if (!cancelled) setError("Notifications could not be loaded. Please try again."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const visibleNotifications = useMemo(() => {
    const filter = filters.find((item) => item.id === activeFilter);
    if (!filter?.types) return notifications;
    return notifications.filter((item) => (filter.types as readonly string[]).includes(item.type));
  }, [activeFilter, notifications]);

  const groupedNotifications = useMemo(() => {
    const groups = new Map<string, NotificationItem[]>();
    visibleNotifications.forEach((item) => {
      const group = dateGroup(item.created_at);
      groups.set(group, [...(groups.get(group) ?? []), item]);
    });
    return ["Today", "Yesterday", "Earlier this week", "Earlier"]
      .filter((group) => groups.has(group))
      .map((group) => ({ label: group, items: groups.get(group) ?? [] }));
  }, [visibleNotifications]);

  const handleRead = (id: number) => {
    const notification = notifications.find((item) => item.id === id);
    if (!notification || notification.is_read) return;
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, is_read: true } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
    void markNotificationRead(id).catch(() => undefined);
  };

  const handleMarkAllRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, is_read: true })));
    setUnreadCount(0);
    void markAllNotificationsRead().catch(() => undefined);
  };

  const handleDismiss = (id: number) => {
    const notification = notifications.find((item) => item.id === id);
    setNotifications((items) => items.filter((item) => item.id !== id));
    if (notification && !notification.is_read) setUnreadCount((count) => Math.max(0, count - 1));
    void deleteNotification(id).catch(() => undefined);
  };

  const handleFollowBack = (username: string) => {
    void apiFetch(`/accounts/users/${encodeURIComponent(username)}/follow/`, { method: "POST" }).catch(() => undefined);
  };

  const loadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const pageNumber = Number(new URL(nextPage).searchParams.get("page") ?? 2);
      const page: NotificationPage = await getNotifications(pageNumber);
      setNotifications((items) => [...items, ...page.results]);
      setNextPage(page.next);
    } catch {
      setError("Older notifications could not be loaded.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f7f4] pt-24 text-[#171715] md:pt-28">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-[1500px]">
        <aside className="hidden w-[220px] shrink-0 border-r border-[#e8e6e1] px-5 py-6 lg:block">
          <p className="mb-4 text-[9px] font-medium uppercase text-[#85827b]">Filing index</p>
          <nav className="space-y-1" aria-label="Notification categories">
            {filters.map((filter) => {
              const count = filter.types ? notifications.filter((item) => (filter.types as readonly string[]).includes(item.type)).length : notifications.length;
              return <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`flex w-full items-center justify-between px-2.5 py-2 text-left text-[10px] uppercase transition ${activeFilter === filter.id ? "bg-[#e9e7e2] text-black" : "text-[#65635e] hover:bg-[#efede8]"}`}><span>{filter.label}</span><span className="text-[9px] text-[#77746e]">{count}</span></button>;
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 px-4 pb-12 sm:px-7 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dedcd6] py-4">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-[29px] leading-none">Notifications</h1>
              {unreadCount > 0 && <span className="bg-black px-2 py-1 text-[9px] font-semibold uppercase text-white">{unreadCount} new</span>}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleMarkAllRead} disabled={!unreadCount} className="inline-flex h-9 items-center gap-1.5 px-2 text-[9px] font-semibold uppercase text-[#45443f] hover:bg-[#eeece7] disabled:opacity-40 sm:px-3"><CheckCheck className="h-3.5 w-3.5" /> Mark all as read</button>
              <Link href="/settings/notifications" className="inline-flex h-9 items-center gap-1.5 bg-[#efede8] px-2.5 text-[9px] font-semibold uppercase text-[#45443f] hover:bg-[#e7e4de] sm:px-3"><SlidersHorizontal className="h-3.5 w-3.5" /> Preferences</Link>
            </div>
          </header>

          <nav className="flex gap-1.5 overflow-x-auto border-b border-[#dedcd6] py-4 lg:hidden" aria-label="Notification filters">
            {filters.map((filter) => <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`shrink-0 px-3 py-2 text-[9px] font-semibold uppercase ${activeFilter === filter.id ? "bg-black text-white" : "bg-[#eeece7] text-[#5e5b55]"}`}>{filter.label}</button>)}
          </nav>

          <div className="hidden border-b border-[#dedcd6] py-4 lg:flex lg:gap-1.5">
            {filters.map((filter) => <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`px-3 py-1.5 text-[9px] font-semibold uppercase ${activeFilter === filter.id ? "bg-black text-white" : "bg-[#eeece7] text-[#5e5b55] hover:bg-[#e7e4de]"}`}>{filter.label} <span className="ml-1 opacity-65">{filter.types ? notifications.filter((item) => (filter.types as readonly string[]).includes(item.type)).length : notifications.length}</span></button>)}
          </div>

          {error && <p role="status" className="border-b border-[#dedcd6] py-3 text-sm text-[#8b332b]">{error}</p>}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-[#77746e]"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading notifications</div>
          ) : groupedNotifications.length ? (
            <div>
              {groupedNotifications.map((group) => <section key={group.label} className="mt-5">
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="font-serif text-[14px] font-semibold">{group.label}</h2>
                  <span className="bg-[#eeece7] px-1.5 py-1 text-[8px] font-medium uppercase text-[#77746e]">{group.items.length} events</span>
                  <span className="h-px flex-1 bg-[#dedcd6]" />
                </div>
                <div className="border-t border-[#e9e7e2]">
                  {group.items.map((notification) => <NotificationRow key={notification.id} notification={notification} onRead={handleRead} onDismiss={handleDismiss} onFollowBack={handleFollowBack} />)}
                </div>
              </section>)}
              {nextPage && <div className="flex justify-center py-7"><button type="button" onClick={loadMore} disabled={loadingMore} className="inline-flex items-center gap-2 border border-[#d7d4cd] px-4 py-2 text-[10px] font-semibold uppercase hover:bg-white disabled:opacity-50">{loadingMore && <LoaderCircle className="h-3 w-3 animate-spin" />} Load older notifications</button></div>}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Bell className="mb-3 h-6 w-6 text-[#77746e]" strokeWidth={1.5} />
              <h2 className="font-serif text-lg">No notifications yet</h2>
              <p className="mt-1 max-w-xs text-xs leading-5 text-[#77746e]">Updates from writers you follow and readers of your work will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
