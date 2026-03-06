import { Eye, Heart, MessageCircle, Bookmark } from "lucide-react";
import LikeButton from "@/components/interactions/LikeButton";
import BookmarkButton from "@/components/interactions/BookmarkButton";

export interface ProfileCardProps {
    id: number;
    title: string;
    author: string;
    genre: string;
    image: string;
    views: string;
    likes: number;
    comments: string;
    type?: "story" | "poem" | string;
    // Selection for Liked Tab
    selectionMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: number) => void;
    // Options
    showBookmark?: boolean;
}

export default function ProfileCard({
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
}: ProfileCardProps) {
    return (
        <div className="min-w-[150px] md:min-w-[180px] lg:min-w-[200px] group cursor-pointer relative m">
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
            <div className={`relative overflow-hidden rounded-lg md:rounded-xl mb-2 md:mb-3 ${selectionMode && isSelected ? "ring-2 ring-black" : ""}`}>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 md:h-56 lg:h-72 object-cover group-hover:scale-105 transition duration-300"
                />
                
                {/* Bookmark Button - Top Right */}
                {showBookmark && !selectionMode && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/20 rounded-full p-1.5 md:p-2 shadow-md hover:shadow-lg transition">
                        <BookmarkButton storyId={id} />
                    </div>
                )}
            </div>

            {/* Genre Badge & Optional Type */}
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-gray-700">
                    {genre}
                </span>
                {type && (
                     <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                         {type}
                     </span>
                )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm md:text-base text-black group-hover:text-black line-clamp-2 leading-snug mb-0.5">
                {title}
            </h3>

            {/* Author */}
            <p className="text-xs md:text-sm text-gray-500 line-clamp-1">
                {author}
            </p>

            {/* Stats (Views, Likes, Comments) */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {views}
                </div>
                <div className="flex items-center gap-3">
                    <LikeButton
                        storyId={id}
                        initialLikes={likes}
                    />
                    <div className="flex items-center gap-1 hover:text-black transition-colors">
                        <MessageCircle size={14} />
                        {comments}
                    </div>
                </div>
            </div>
        </div>
    );
}
