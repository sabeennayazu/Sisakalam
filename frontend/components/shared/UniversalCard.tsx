import { Eye, Heart, MessageCircle } from "lucide-react";
import LikeButton from "@/components/interactions/LikeButton";
import BookmarkButton from "@/components/interactions/BookmarkButton";

export type ContentType = "story" | "poem" | "essay" | "journal" | string;

export interface UniversalCardProps {
    id: number;
    title: string;
    author: string;
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
    
    // Flexible props for future use
    description?: string;
    tags?: string[];
    href?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export default function UniversalCard({
    id,
    title,
    author,
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
    description,
    tags,
    onClick,
    children,
}: UniversalCardProps) {
    // Convert numeric values to strings if needed
    const formattedViews = typeof views === "number" ? views.toString() : views || "0";
    const formattedComments = typeof comments === "number" ? comments.toString() : comments || "0";

    return (
        <div
            className="min-w-[150px] md:min-w-[180px] lg:min-w-[200px]  group cursor-pointer relative "
            onClick={onClick}
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
                <img
                    src={image || "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=700&fit=crop"}
                    alt={title || "Content cover"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                            "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=700&fit=crop";
                    }}
                />

                {/* Bookmark Button - Top Right */}
                {showBookmark && !selectionMode && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/20 rounded-full p-1.5 md:p-2 shadow-md hover:shadow-lg transition">
                        <BookmarkButton storyId={id} />
                    </div>
                )}
            </div>

            {/* Genre Badge & Optional Type */}
            <div className="flex items-center gap-2 mb-2">
                {genre && (
                    <span className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-gray-700 truncate">
                        {genre}
                    </span>
                )}
                {type && (
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider whitespace-nowrap">
                        {type}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm md:text-base text-black group-hover:text-black line-clamp-2 leading-snug mb-1">
                {title || "Untitled"}
            </h3>

            {/* Author */}
            <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mb-3">
                {author || "Unknown Author"}
            </p>

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
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Stats (Views, Likes, Comments) */}
            {showStats && (
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pr-2">
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span className="truncate">{formattedViews}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LikeButton storyId={id} initialLikes={likes} />
                        <div className="flex items-center gap-1 hover:text-black transition-colors">
                            <MessageCircle size={14} />
                            <span className="truncate">{formattedComments}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Children (for custom content) */}
            {children && <div className="mt-2">{children}</div>}
        </div>
    );
}
