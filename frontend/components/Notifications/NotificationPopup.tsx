
"use client";

import Link from "next/link";
import {
  Bell,
  Check,
  Heart,
  MessageCircle,
  BookOpen,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";

type NotificationType =
  | "story"
  | "poem"
  | "chapter"
  | "like"
  | "comment"
  | "follow";

interface Notification {
  id: number;
  type: NotificationType;
  username: string;
  message: string;
  content?: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "story",
    username: "ok",
    message: "posted a new story",
    content: "The Last Rain",
    time: "5m ago",
    read: false,
  },
  {
    id: 2,
    type: "poem",
    username: "bk",
    message: "posted a new poem",
    content: "Letters I Never Sent",
    time: "18m ago",
    read: false,
  },
  {
    id: 3,
    type: "chapter",
    username: "ck",
    message: "posted a new chapter",
    content: "Chapter 7 · The Beginning",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    type: "like",
    username: "maya",
    message: "liked your poem",
    content: "Rain on the Window",
    time: "2h ago",
    read: true,
  },
  {
    id: 5,
    type: "comment",
    username: "arun",
    message: "commented on your story",
    content: "The Forgotten Road",
    time: "4h ago",
    read: true,
  },
];

function NotificationIcon({ type }: { type: NotificationType }) {
  const iconClass = "h-[15px] w-[15px]";

  switch (type) {
    case "story":
      return <BookOpen className={iconClass} strokeWidth={1.7} />;

    case "poem":
      return <BookOpen className={iconClass} strokeWidth={1.7} />;

    case "chapter":
      return <BookOpen className={iconClass} strokeWidth={1.7} />;

    case "like":
      return <Heart className={iconClass} strokeWidth={1.7} />;

    case "comment":
      return <MessageCircle className={iconClass} strokeWidth={1.7} />;

    case "follow":
      return <UserPlus className={iconClass} strokeWidth={1.7} />;

    default:
      return <Bell className={iconClass} strokeWidth={1.7} />;
  }
}

export default function NotificationPopup() {
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="w-[380px] overflow-hidden rounded-2xl border border-black/10 bg-white text-black shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">
            Notifications
          </h3>

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-1.5 text-black/45 transition hover:bg-black/[0.05] hover:text-black"
          aria-label="Notification options"
        >
          <MoreHorizontal className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Notifications */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              href="#"
              className={`group relative flex gap-3 border-b border-black/[0.07] px-5 py-4 transition hover:bg-black/[0.025] ${
                !notification.read ? "bg-black/[0.025]" : "bg-white"
              }`}
            >
              {/* Unread indicator */}
              {!notification.read && (
                <span className="absolute left-2 top-[23px] h-1.5 w-1.5 rounded-full bg-black" />
              )}

              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.025]">
                <NotificationIcon type={notification.type} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-5 text-black/75">
                  <span className="font-semibold text-black">
                    {notification.username}
                  </span>{" "}
                  {notification.message}
                </p>

                {notification.content && (
                  <p className="mt-0.5 truncate text-[12px] font-medium text-black/50">
                    {notification.content}
                  </p>
                )}

                <p className="mt-1.5 text-[11px] text-black/35">
                  {notification.time}
                </p>
              </div>

              {/* Hover arrow */}
              <div className="self-center text-black/20 opacity-0 transition group-hover:opacity-100">
                →
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-black/10">
              <Bell className="h-5 w-5 text-black/40" strokeWidth={1.5} />
            </div>

            <p className="text-sm font-medium">No notifications</p>
            <p className="mt-1 text-xs text-black/40">
              You're all caught up.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-black/10 p-2">
        <Link
          href="/notifications"
          className="flex h-10 items-center justify-center rounded-xl text-[13px] font-medium text-black/60 transition hover:bg-black/[0.05] hover:text-black"
        >
          See all notifications
        </Link>
      </div>
    </div>
  );
}
