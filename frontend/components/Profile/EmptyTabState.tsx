"use client";

import Link from "next/link";

interface EmptyTabStateProps {
  message: string;
  actionLabel?: string;
}

export default function EmptyTabState({ message, actionLabel }: EmptyTabStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
      <p className="max-w-md font-serif text-lg italic text-gray-600">{message}</p>
      {actionLabel && (
        <Link
          href="/write"
          className="mt-6 rounded-sm bg-black px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
