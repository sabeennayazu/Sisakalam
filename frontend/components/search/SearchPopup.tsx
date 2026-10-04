"use client";
import Link from "next/link";
import { Search, BookOpen, User, Clock, ArrowRight, X } from "lucide-react";
interface SearchResult {
  id: number;
  type: "story" | "poem" | "user";
  title: string;
  subtitle?: string;
  author?: string;
}
interface SearchPopupProps {
  query?: string;
  onClose?: () => void;
}
const results: SearchResult[] = [
  {
    id: 1,
    type: "story",
    title: "The Last Rain",
    author: "ok",
    subtitle: "A story about memories and things left unsaid.",
  },
  {
    id: 2,
    type: "poem",
    title: "Letters I Never Sent",
    author: "bk",
    subtitle: "Poem",
  },
  { id: 3, type: "user", title: "Sabin Nayaju", subtitle: "@sabinnayaju" },
  {
    id: 4,
    type: "story",
    title: "The Forgotten Road",
    author: "ck",
    subtitle: "Chapter 7 · The Beginning",
  },
];
function ResultIcon({ type }: { type: SearchResult["type"] }) {
  if (type === "user") {
    return <User size={16} strokeWidth={1.7} />;
  }
  return <BookOpen size={16} strokeWidth={1.7} />;
}
function ResultItem({ result }: { result: SearchResult }) {
  const href =
    result.type === "user"
      ? `/profile/${result.id}`
      : result.type === "story"
        ? `/stories/${result.id}`
        : `/poems/${result.id}`;
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.035]"
    >
      {" "}
      {/* Icon */}{" "}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white">
        {" "}
        <ResultIcon type={result.type} />{" "}
      </div>{" "}
      {/* Content */}{" "}
      <div className="min-w-0 flex-1">
        {" "}
        <p className="truncate text-[13px] font-medium text-black">
          {" "}
          {result.title}{" "}
        </p>{" "}
        {result.type === "user" ? (
          <p className="mt-0.5 truncate text-[11px] text-black/40">
            {" "}
            {result.subtitle}{" "}
          </p>
        ) : (
          <p className="mt-0.5 truncate text-[11px] text-black/40">
            {" "}
            {result.author && `by ${result.author}`}{" "}
            {result.author && result.subtitle && " · "} {result.subtitle}{" "}
          </p>
        )}{" "}
      </div>{" "}
      <ArrowRight
        size={15}
        strokeWidth={1.6}
        className="shrink-0 text-black/20 opacity-0 transition-opacity group-hover:opacity-100"
      />{" "}
    </Link>
  );
}
export default function SearchPopup({ query = "", onClose }: SearchPopupProps) {
  const trimmedQuery = query.trim();
  return (
    <div className="w-[380px] overflow-hidden rounded-2xl border border-black/10 bg-white text-black shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      {" "}
      {/* Header */}{" "}
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
        {" "}
        <Search
          size={17}
          strokeWidth={1.8}
          className="shrink-0 text-black/45"
        />{" "}
        <p className="min-w-0 flex-1 truncate text-[13px] text-black/60">
          {" "}
          {trimmedQuery || "Search Sisakalam"}{" "}
        </p>{" "}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-black/35 transition hover:bg-black/[0.05] hover:text-black"
            aria-label="Close search"
          >
            {" "}
            <X size={15} strokeWidth={1.8} />{" "}
          </button>
        )}{" "}
      </div>{" "}
      {/* Recent searches when nothing is typed */}{" "}
      {!trimmedQuery ? (
        <div>
          {" "}
          <div className="flex items-center justify-between px-4 py-3">
            {" "}
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/35">
              {" "}
              Recent searches{" "}
            </p>{" "}
            <button
              type="button"
              className="text-[11px] text-black/40 transition hover:text-black"
            >
              {" "}
              Clear{" "}
            </button>{" "}
          </div>{" "}
          <div className="border-t border-black/[0.07]">
            {" "}
            {["romance", "poetry", "Nepal", "short stories"].map((search) => (
              <button
                key={search}
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-black/[0.035]"
              >
                {" "}
                <Clock
                  size={14}
                  strokeWidth={1.7}
                  className="text-black/35"
                />{" "}
                <span className="text-[13px] text-black/70">
                  {" "}
                  {search}{" "}
                </span>{" "}
              </button>
            ))}{" "}
          </div>{" "}
          <div className="border-t border-black/10 p-2">
            {" "}
            <Link
              href="/search"
              className="flex h-10 items-center justify-center rounded-xl text-[12px] font-medium text-black/55 transition hover:bg-black/[0.05] hover:text-black"
            >
              {" "}
              Open search{" "}
            </Link>{" "}
          </div>{" "}
        </div>
      ) : (
        /* Search results */ <div>
          {" "}
          {/* Stories */}{" "}
          <div className="px-4 pb-2 pt-4">
            {" "}
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-black/35">
              {" "}
              Results{" "}
            </p>{" "}
          </div>{" "}
          <div className="border-t border-black/[0.07]">
            {" "}
            {results.map((result) => (
              <ResultItem key={`${result.type}-${result.id}`} result={result} />
            ))}{" "}
          </div>{" "}
          {/* Footer */}{" "}
          <div className="border-t border-black/10 p-2">
            {" "}
            <Link
              href={`/search?q=${encodeURIComponent(trimmedQuery)}`}
              className="flex h-10 items-center justify-center gap-2 rounded-xl text-[12px] font-medium text-black/60 transition hover:bg-black/[0.05] hover:text-black"
            >
              {" "}
              View all results <ArrowRight size={14} strokeWidth={1.7} />{" "}
            </Link>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
