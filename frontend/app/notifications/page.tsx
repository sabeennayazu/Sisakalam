
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Check,
  Heart,
  MessageCircle,
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
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "story",
    username: "ok",
    message: "posted a new story",
    content: "The Last Rain",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "poem",
    username: "bk",
    message: "posted a new poem",
    content: "Letters I Never Sent",
    time: "18 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "chapter",
    username: "ck",
    message: "posted a new chapter",
    content: "The Forgotten Road · Chapter 7",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    type: "like",
    username: "maya",
    message: "liked your poem",
    content: "Rain on the Window",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "comment",
    username: "arun",
    message: "commented on your story",
    content: "The Forgotten Road",
    time: "4 hours ago",
    read: true,
  },
  {
    id: 6,
    type: "follow",
    username: "sita",
    message: "started following you",
    time: "6 hours ago",
    read: true,
  },
  {
    id: 7,
    type: "like",
    username: "rohan",
    message: "liked your poem",
    content: "Things We Never Said",
    time: "Yesterday",
    read: true,
  },
];

function NotificationIcon({ type }: { type: NotificationType }) {
  const className = "h-[17px] w-[17px]";

  switch (type) {
    case "story":
    case "poem":
    case "chapter":
      return <BookOpen className={className} strokeWidth={1.7} />;

    case "like":
      return <Heart className={className} strokeWidth={1.7} />;

    case "comment":
      return <MessageCircle className={className} strokeWidth={1.7} />;

    case "follow":
      return <UserPlus className={className} strokeWidth={1.7} />;

    default:
      return <Bell className={className} strokeWidth={1.7} />;
  }
}

function NotificationRow({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <Link
      href="#"
      className={`group relative flex gap-4 border-b border-black/[0.08] px-5 py-5 transition hover:bg-black/[0.025] sm:px-7 ${
        !notification.read ? "bg-black/[0.025]" : "bg-white"
      }`}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute left-2.5 top-[28px] h-1.5 w-1.5 rounded-full bg-black sm:left-3.5" />
      )}

      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.025]">
        <NotificationIcon type={notification.type} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] leading-6 text-black/70">
              <span className="font-semibold text-black">
                {notification.username}
              </span>{" "}
              {notification.message}
            </p>

            {notification.content && (
              <p className="mt-0.5 text-[13px] font-medium text-black/45">
                {notification.content}
              </p>
            )}

            <p className="mt-2 text-[11px] text-black/35">
              {notification.time}
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => event.preventDefault()}
            className="shrink-0 rounded-lg p-1.5 text-black/25 opacity-0 transition hover:bg-black/[0.06] hover:text-black group-hover:opacity-100"
            aria-label="Notification options"
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function NotificationPage() {
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <button
            type="button"
            className="text-xs font-medium text-black/45 transition hover:text-black"
          >
            Mark all as read
          </button>
        </div>

        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10">
              <Bell className="h-5 w-5" strokeWidth={1.6} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em]">
                Notifications
              </h1>

              <p className="mt-0.5 text-xs text-black/40">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount === 1 ? "" : "s"
                    }`
                  : "You're all caught up"}
              </p>
            </div>
          </div>
        </div>

        {/* Notification list */}
        <section className="overflow-hidden rounded-2xl border border-black/10">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-black/10">
                <Bell
                  className="h-6 w-6 text-black/40"
                  strokeWidth={1.5}
                />
              </div>

              <h2 className="text-sm font-semibold">
                No notifications yet
              </h2>

              <p className="mt-1 max-w-xs text-xs leading-5 text-black/40">
                When someone interacts with your work or follows you,
                notifications will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
