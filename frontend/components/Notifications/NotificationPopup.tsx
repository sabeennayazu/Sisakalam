"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Bookmark, BookOpen, Feather, Heart, MessageCircle, UserPlus } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import {
  getRecentNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/utils/notifications.api";

function NotificationIcon({ type }: { type: string }) {
  const className = "h-3.5 w-3.5";
  if (type === "new_story" || type === "new_chapter") return <BookOpen className={className} />;
  if (type === "new_poem") return <Feather className={className} />;
  if (type === "story_bookmark" || type === "poem_bookmark") return <Bookmark className={className} />;
  if (["story_like", "poem_like", "chapter_like", "comment_like"].includes(type)) return <Heart className={className} />;
  if (type === "comment" || type === "reply") return <MessageCircle className={className} />;
  if (type === "follow") return <UserPlus className={className} />;
  return <Bell className={className} />;
}

function timeAgo(value: string) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationPopup() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let markedAllRead = false;
    void getRecentNotifications()
      .then((recent) => {
        if (!cancelled) setNotifications(markedAllRead ? recent.map((item) => ({ ...item, is_read: true })) : recent);
      })
      .catch(() => undefined);
    void markAllNotificationsRead()
      .then(() => {
        if (cancelled) return;
        markedAllRead = true;
        setNotifications((items) => items.map((item) => ({ ...item, is_read: true })));
        setUnreadCount(0);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const markRead = (notification: NotificationItem) => {
    if (notification.is_read) return;
    setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, is_read: true } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
    void markNotificationRead(notification.id).catch(() => undefined);
  };

  const markAllRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, is_read: true })));
    setUnreadCount(0);
    void markAllNotificationsRead().catch(() => undefined);
  };

  return (
    <div className="w-[min(380px,calc(100vw-2rem))] overflow-hidden border border-[#e5e3de] bg-white text-black shadow-[0_12px_40px_rgba(0,0,0,0.14)]">
      <div className="flex items-center justify-between border-b border-[#e9e7e2] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-[17px]">Notifications</h3>
          {unreadCount > 0 && <span className="bg-black px-1.5 py-1 text-[9px] font-semibold uppercase text-white">{unreadCount} new</span>}
        </div>
        <button type="button" onClick={markAllRead} disabled={!unreadCount} className="text-[9px] font-semibold uppercase text-[#65635e] hover:text-black disabled:opacity-40">Mark all read</button>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length ? notifications.map((notification) => (
          <Link key={notification.id} href={notification.target_url ?? "/notifications"} onClick={() => markRead(notification)} className={`flex items-center gap-3 border-b border-[#eeece8] px-4 py-3 hover:bg-[#f6f5f2] ${notification.is_read ? "bg-white" : "bg-[#fffefa]"}`}>
            <div className="relative h-9 w-9 shrink-0 border border-black/10 bg-[#f1f0ec]">
              {notification.target_image ? <Image src={notification.target_image} alt="" width={36} height={36} unoptimized className="h-full w-full object-cover" /> : notification.actor ? <UserAvatar userId={notification.actor.id} username={notification.actor.username} imageUrl={notification.actor.avatar} className="h-full w-full" fallbackClassName="text-[10px]" /> : <span className="flex h-full items-center justify-center text-[10px] font-semibold uppercase">S</span>}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center border border-white bg-black text-white"><NotificationIcon type={notification.type} /></span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[12px] leading-4 text-[#353430]"><span className="font-semibold text-black">{notification.actor?.username ?? "A writer"}</span> {notification.message}{notification.target_title && <span className="font-serif font-semibold text-black"> “{notification.target_title}”</span>}</p>
              <p className="mt-1 text-[10px] uppercase text-[#85827b]">{timeAgo(notification.created_at)}</p>
            </div>
            {!notification.is_read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />}
          </Link>
        )) : (
          <div className="px-5 py-12 text-center">
            <Bell className="mx-auto mb-2 h-5 w-5 text-[#77746e]" strokeWidth={1.5} />
            <p className="font-serif text-sm">No notifications yet</p>
          </div>
        )}
      </div>
      <div className="border-t border-[#e9e7e2] p-2">
        <Link href="/notifications" className="flex h-9 items-center justify-center text-[10px] font-semibold uppercase text-[#65635e] hover:bg-[#f1f0ec] hover:text-black">See all notifications</Link>
      </div>
    </div>
  );
}