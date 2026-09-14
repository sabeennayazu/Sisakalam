import { Eye, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LikeButton from "@/components/interactions/LikeButton";
import BookmarkButton from "@/components/interactions/BookmarkButton";
import { formatTags } from "@/utils/content";

export type ContentType = "story" | "poem" | "essay" | "journal" | string;

export interface UniversalCardProps {
    id: number;
    title: string;
    author: string;
    authorId?: number;
    genre: string;
    image: string;
    views: string | number;
    likes: number;
    comments: string | number;
    
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
}: UniversalCardProps) {
    const router = useRouter();
    // Convert numeric values to strings if needed
    const formattedViews = typeof views === "number" ? views.toString() : views || "0";
    const formattedComments = typeof comments === "number" ? comments.toString() : comments || "0";
    const isDraft = status === "draft";
    const savedTime = savedAt ? formatSavedTime(savedAt) : "just now";
    const destination = status === "draft"
        ? "/write"
        : type === "story"
            ? `/stories/${id}`
            : type === "poem"
                ? `/poems/${id}`
            : null;

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (onClick) {
            onClick(event);
            return;
        }
        if (destination) router.push(destination);
    };

    return (
        <div
            className="min-w-[150px] md:min-w-[180px] lg:min-w-[200px]  group cursor-pointer relative "
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
                className={`relative overflow-hidden rounded-lg md:rounded-xl mb-3 mr-2 md:mb-4 shrink-0 h-48 md:h-56 lg:h-72 ${
                    selectionMode && isSelected ? "ring-2 ring-black" : ""
                }`}
            >
                {image ? (
                    <img
                        src={image}
                        alt={title || "Content cover"}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100 px-4 text-center text-sm font-medium text-gray-500">
                        {title || "Untitled"}
                    </div>
                )}

                {/* Bookmark Button - Top Right */}
                {showBookmark && !selectionMode && !isDraft && (
                    <div onClick={(event) => event.stopPropagation()} className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/20 rounded-full p-1.5 md:p-2 shadow-md hover:shadow-lg transition">
                        <BookmarkButton storyId={id} />
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
                            <LikeButton storyId={id} initialLikes={likes} />
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
