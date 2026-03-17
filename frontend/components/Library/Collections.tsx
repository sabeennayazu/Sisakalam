"use client";

import { useState } from "react";
import UniversalCard, { ContentType } from "@/components/shared/UniversalCard";
import { FolderHeart, Plus, MoreVertical, Trash2, Edit2, ChevronLeft } from "lucide-react";

// Types
type PlaylistItem = {
    id: number;
    title: string;
    author: string;
    genre: string;
    image: string;
    views: number;
    likes: number;
    comments: number;
    type: ContentType;
};

type Playlist = {
    id: string;
    name: string;
    items: PlaylistItem[];
};

// Mock Data
const initialPlaylists: Playlist[] = [
    {
        id: "pl_1",
        name: "Late Night Reads",
        items: [
            {
                id: 1,
                title: "Whispers in the Dark",
                author: "Elena Vance",
                genre: "Mystery",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop",
                views: 1205,
                likes: 342,
                comments: 45,
                type: "story"
            },
            {
                id: 2,
                title: "Midnight Sonnet",
                author: "Marcus Aurelius",
                genre: "Poetry",
                image: "https://images.unsplash.com/photo-1507842217343-583f20270319?q=80&w=500&auto=format&fit=crop",
                views: 530,
                likes: 120,
                comments: 12,
                type: "poem"
            }
        ]
    },
    {
        id: "pl_2",
        name: "Sci-Fi Favorites",
        items: [
             {
                id: 3,
                title: "Nebula Dreams",
                author: "Sarah Connor",
                genre: "Sci-Fi",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop",
                views: 8900,
                likes: 1240,
                comments: 320,
                type: "story"
            }
        ]
    },
    {
        id: "pl_3",
        name: "Empty Collection",
        items: []
    }
];

export default function Collections() {
    const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

    // --- Actions ---
    const handleCreatePlaylist = () => {
        const newName = prompt("Enter playlist name:");
        if (newName && newName.trim()) {
            const newPlaylist: Playlist = {
                id: `pl_${Date.now()}`,
                name: newName.trim(),
                items: []
            };
            setPlaylists([...playlists, newPlaylist]);
        }
    };

    const handleRenamePlaylist = (e: React.MouseEvent, id: string, currentName: string) => {
        e.stopPropagation();
        const newName = prompt("Rename playlist:", currentName);
        if (newName && newName.trim()) {
            setPlaylists(playlists.map(pl => 
                pl.id === id ? { ...pl, name: newName.trim() } : pl
            ));
            // Update active playlist name if it's currently open
            if (activePlaylistId === id) {
                // UI will auto update based on playlists state, but we need the new name in the nested view
            }
        }
    };

    const handleDeletePlaylist = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this collection?")) {
            setPlaylists(playlists.filter(pl => pl.id !== id));
            if (activePlaylistId === id) {
                setActivePlaylistId(null);
            }
        }
    };

    const handleRemoveItem = (playlistId: string, itemId: number) => {
        setPlaylists(playlists.map(pl => {
            if (pl.id === playlistId) {
                return {
                    ...pl,
                    items: pl.items.filter(item => item.id !== itemId)
                };
            }
            return pl;
        }));
    };

    // --- Renderers ---
    
    // View 2: Nested Playlist Details
    if (activePlaylistId) {
        const activePlaylist = playlists.find(p => p.id === activePlaylistId);
        
        if (!activePlaylist) {
            setActivePlaylistId(null);
            return null;
        }

        return (
            <div className="w-full">
                <button 
                    onClick={() => setActivePlaylistId(null)}
                    className="flex items-center text-gray-500 hover:text-black mb-6 transition-colors group"
                >
                    <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Collections
                </button>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{activePlaylist.name}</h2>
                        <span className="text-gray-500">
                            {activePlaylist.items.length} {activePlaylist.items.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </div>

                {activePlaylist.items.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <FolderHeart className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">This collection is empty</h3>
                        <p className="text-sm text-gray-500">Add stories and poems to build your playlist.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {activePlaylist.items.map((item) => (
                             <div key={item.id} className="relative group">
                                <UniversalCard
                                    id={item.id}
                                    title={item.title}
                                    author={item.author}
                                    genre={item.genre}
                                    image={item.image}
                                    views={item.views}
                                    likes={item.likes}
                                    comments={item.comments}
                                    type={item.type}
                                    onClick={() => console.log(`Navigate to story/poem ${item.id}`)}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveItem(activePlaylist.id, item.id);
                                        }}
                                        className="mt-3 w-full py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 size={12} />
                                        Remove from Collection
                                    </button>
                                </UniversalCard>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // View 1: List of Playlists
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Collections</h2>
                <button 
                    onClick={handleCreatePlaylist}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    <Plus size={16} />
                    New Collection
                </button>
            </div>

            {playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <FolderHeart className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No playlists yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm">
                        Create your first collection to curate your favorite readings in one place.
                    </p>
                    <button 
                        onClick={handleCreatePlaylist}
                        className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Plus size={18} />
                        Create Collection
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {playlists.map((playlist) => {
                        // Use first item's image as cover, or a fallback
                        const coverImage = playlist.items.length > 0 && playlist.items[0].image 
                            ? playlist.items[0].image 
                            : "https://placehold.co/600x400/f8fafc/94a3b8?text=Empty+Collection";

                        return (
                            <div 
                                key={playlist.id}
                                onClick={() => setActivePlaylistId(playlist.id)}
                                className="group cursor-pointer flex flex-col"
                            >
                                {/* Playlist Cover (Square-ish ratio) */}
                                <div className="relative aspect-[4/3] w-full mb-3 rounded-xl overflow-hidden bg-gray-100">
                                    <img 
                                        src={coverImage} 
                                        alt={playlist.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    {/* Overlay Gradient for contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Sub-actions that appear on hover */}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => handleRenamePlaylist(e, playlist.id, playlist.name)}
                                            className="p-2 bg-white/90 backdrop-blur hover:bg-white text-gray-700 rounded-full shadow-sm transition"
                                            title="Rename Playlist"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDeletePlaylist(e, playlist.id)}
                                            className="p-2 bg-white/90 backdrop-blur hover:bg-red-50 text-red-600 rounded-full shadow-sm transition"
                                            title="Delete Playlist"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Item count badge overlay on hover */}
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        {playlist.items.length} {playlist.items.length === 1 ? 'item' : 'items'}
                                    </div>
                                </div>

                                {/* Playlist Info */}
                                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-black transition-colors">
                                    {playlist.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {playlist.items.length} {playlist.items.length === 1 ? 'item' : 'items'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
