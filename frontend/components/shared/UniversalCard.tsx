import { Ellipsis, Eye, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import LikeButton from "@/components/interactions/LikeButton";
import BookmarkButton from "@/components/interactions/BookmarkButton";
import { formatTags } from "@/utils/content";
import { startCopyLink } from "@/components/loader/UploadModal";

export type ContentType = "story" | "poem" | "essay" | "journal" | string;

export interface UniversalCardProps {
    id: number;
    title: string;
    author: string;
    authorId?: number;
    chapterSlug?: string | null;
    genre: string;
    image: string;
    views: string | number;
    likes: number;
    comments: string | number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    
    // Optional content type indicator
    type?: ContentType;
    
    // Selection mode (used in profile tabs for bulk operations)
    selectionMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: number) => void;
    
    // UI options
    showBookmark?: boolean;
    showStats?: boolean;
    isMature?: boolean;
    status?: "draft" | "published" | string;
    savedAt?: string | Date;
    onEdit?: (event: React.MouseEvent) => void;
    onDelete?: (event: React.MouseEvent) => void;
    
    // Flexible props for future use
    description?: string;
    tags?: string[];
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    children?: React.ReactNode;
    isOwner?: boolean;
    isPrivate?: boolean;
    onDeleteContent?: () => Promise<void> | void;
    onTogglePrivacy?: () => Promise<void> | void;
}

export default function UniversalCard({
    id,
    title,
    author,
    authorId,
    genre,
    image,
    views,
    likes,
    comments,
    isLiked = false,
    isBookmarked = false,
    type,
    selectionMode = false,
    isSelected = false,
    onToggleSelect,
    showBookmark = true,
    showStats = true,
    isMature = false,
    status = "published",
    savedAt,
    onEdit,
    onDelete,
    description,
    tags,
    onClick,
    children,
    chapterSlug,
    isOwner = false,
    isPrivate = false,
    onDeleteContent,
    onTogglePrivacy,
}: UniversalCardProps) {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    // Convert numeric values to strings if needed
    const formattedViews = typeof views === "number" ? views.toString() : views || "0";
    const formattedComments = typeof comments === "number" ? comments.toString() : comments || "0";
    const isDraft = status === "draft";
    const likeTargetType = type === "story" || type === "poem" ? type : null;
    const bookmarkTargetType = type === "story" || type === "poem" ? type : null;
    const savedTime = savedAt ? formatSavedTime(savedAt) : "just now";
    const destination = status === "draft"
        ? `/write?type=${type}&id=${id}`
        : type === "story"
            ? `/stories/${id}`
            : type === "poem"
                ? `/poems/${id}`
            : null;
    const contentUrl = typeof window === "undefined"
        ? destination ?? ""
        : new URL(type === "story" && chapterSlug ? `/stories/${id}/${chapterSlug}` : destination ?? "", window.location.origin).toString();

    const handleDelete = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (onDeleteContent && window.confirm(`Delete ${title || "this work"}?`)) await onDeleteContent();
    };

    const handleCopyLink = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (contentUrl) startCopyLink(contentUrl);
    };

    const handlePrivacy = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (onTogglePrivacy) await onTogglePrivacy();
        setMenuOpen(false);
    };

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (onClick) {
            onClick(event);
            return;
        }
        if (destination) router.push(destination);
    };

    return (
        <div
            className="group relative w-[150px] shrink-0 cursor-pointer md:w-[180px] lg:w-[200px]"
            onClick={handleCardClick}
            onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && destination) {
                    event.preventDefault();
                    router.push(destination);
                }
            }}
            role={destination ? "link" : undefined}
            tabIndex={destination ? 0 : undefined}
        >
            {/* Selection Checkbox */}
            {selectionMode && onToggleSelect && (
                <div className="absolute top-2 left-2 z-20">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(id)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Cover Image Container */}
            <div
                className={`relative mb-3 overflow-hidden rounded-[20px] md:mb-4 md:rounded-[22px] h-[220px] sm:h-[250px] md:h-[280px] xl:h-[300px] ${
                    selectionMode && isSelected ? "ring-2 ring-black" : ""
                }`}
            >
                {image ? (
                    <img
                        src={image}
                        alt={title || "Content cover"}
                        className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${isPrivate ? "opacity-70" : ""}`}
                    />
                ) : (
                    <div className={`flex h-full items-center justify-center bg-gray-100 px-4 text-center text-sm font-medium text-gray-500 ${isPrivate ? "opacity-70" : ""}`}>
                        {title || "Untitled"}
                    </div>
                )}

                {isPrivate && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><span className="bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-widest text-black">Private</span></div>}

                {/* Bookmark Button - Top Right */}
                {isOwner && !selectionMode && !isDraft && (onDeleteContent || onTogglePrivacy) ? (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3" onClick={(event) => event.stopPropagation()}>
                        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-full bg-black/70 p-2 text-white shadow-md" aria-label="Content actions"><Ellipsis size={18} /></button>
                        {menuOpen && <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl">
                            <button type="button" onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
                            <button type="button" onClick={handleCopyLink} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Copy Link</button>
                            <button type="button" disabled className="w-full px-3 py-2 text-left text-sm text-gray-400">Share</button>
                            <button type="button" onClick={handlePrivacy} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">{isPrivate ? "Public" : "Private"}</button>
                        </div>}
                    </div>
                ) : showBookmark && !selectionMode && !isDraft && bookmarkTargetType && (
                    <div onClick={(event) => event.stopPropagation()} className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/20 rounded-full p-1.5 md:p-2 shadow-md hover:shadow-lg transition">
                        <BookmarkButton targetId={id} targetType={bookmarkTargetType} initialBookmarked={isBookmarked} />
                    </div>
                )}
            </div>

            {/* Genre Badge & Optional Type */}
            <div className="flex items-center gap-2 mb-2">
                {genre && (
                    <span className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 bg-gray-200 rounded-full text-gray-700 truncate">
                        {genre}
                    </span>
                )}
                {type && (
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider whitespace-nowrap">
                        {type}
                    </span>
                )}
                {isMature && (
                    <span className="rounded-2xl bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        NSFW
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm md:text-base text-black group-hover:text-black line-clamp-2 leading-snug mb-1">
                {title || "Untitled"}
            </h3>

            {/* Author */}
            {authorId ? (
                <Link
                    href={`/profile/${encodeURIComponent(author)}`}
                    onClick={(event) => event.stopPropagation()}
                    className="mb-3 block line-clamp-1 text-xs text-gray-500 hover:text-black md:text-sm"
                >
                    {author || "Unknown Author"}
                </Link>
            ) : (
                <p className="mb-3 line-clamp-1 text-xs text-gray-500 md:text-sm">{author || "Unknown Author"}</p>
            )}

            {/* Optional Description */}
            {description && (
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-2">
                    {description}
                </p>
            )}

            {/* Optional Tags */}
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {tags.slice(0, 2).map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-[8px] md:text-[9px] px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full truncate"
                        >
                            {formatTags([tag])}
                        </span>
                    ))}
                </div>
            )}

            {/* Draft management */}
            {isDraft && (
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-[10px] font-medium text-gray-400">Saved {savedTime}</span>
                    <div className="flex items-center gap-1">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onEdit(event);
                                }}
                                className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-black"
                                title="Edit draft"
                                aria-label="Edit draft"
                            >
                                <Pencil size={14} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDelete(event);
                                }}
                                className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                title="Delete draft"
                                aria-label="Delete draft"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Stats (Views, Likes, Comments) */}
            {!isDraft && showStats && (
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pr-2">
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span className="truncate">{formattedViews}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div onClick={(event) => event.stopPropagation()}>
                            {likeTargetType && <LikeButton targetId={id} targetType={likeTargetType} initialLikes={likes} initialLiked={isLiked} />}
                        </div>
                        <div onClick={(event) => event.stopPropagation()} className="flex items-center gap-1 hover:text-black transition-colors">
                            <MessageCircle size={14} />
                            <span className="truncate">{formattedComments}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Children (for custom content) */}
            {children && <div className="mt-2" onClick={(event) => event.stopPropagation()}>{children}</div>}
        </div>
    );
}

function formatSavedTime(value: string | Date) {
    const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "yesterday";
    return `${days} days ago`;
}
