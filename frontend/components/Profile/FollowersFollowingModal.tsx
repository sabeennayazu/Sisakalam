"use client";

import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import UserAvatar from "@/components/shared/UserAvatar";
import { followUser, getFollowers, getFollowing, removeFollower, unfollowUser, type RelationshipUser } from "@/utils/account.api";

type Mode = "followers" | "following";
type RelationshipStatus = "following" | "not_following";

interface RelationshipEntry extends RelationshipUser {
  relationshipStatus: RelationshipStatus;
}

interface FollowersFollowingModalProps {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  userId: string | number;
  isOwner: boolean;
  onFollowerRemoved?: () => void;
  onFollowingCountChange?: (delta: number) => void;
}

export default function FollowersFollowingModal({
  open,
  onClose,
  mode,
  userId,
  isOwner,
  onFollowerRemoved,
  onFollowingCountChange,
}: FollowersFollowingModalProps) {
  const [users, setUsers] = useState<RelationshipEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (!open) return;

    let active = true;
    setSearchQuery("");
    setError("");
    setLoading(true);
    const fetchUsers = mode === "followers" ? getFollowers(userId) : getFollowing(userId);
    void fetchUsers
      .then((result) => {
        if (!active) return;
        setUsers(result.map((user) => ({
          ...user,
          relationshipStatus: user.is_following ? "following" : "not_following",
        })));
      })
      .catch((fetchError: unknown) => {
        if (active) setError(fetchError instanceof Error ? fetchError.message : "Unable to load users. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [mode, open, userId]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return users;
    return users.filter((user) => user.username.toLocaleLowerCase().includes(query)
      || user.display_name.toLocaleLowerCase().includes(query));
  }, [searchQuery, users]);

  const removeUser = async (user: RelationshipEntry) => {
    if (!isOwner || pendingIds.has(user.id)) return;
    setError("");
    setPendingIds((current) => new Set(current).add(user.id));
    try {
      await removeFollower(userId, user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      onFollowerRemoved?.();
    } catch (actionError: unknown) {
      setError(actionError instanceof Error ? actionError.message : "Unable to remove this follower. Please try again.");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(user.id);
        return next;
      });
    }
  };

  const toggleFollowing = async (user: RelationshipEntry) => {
    if (pendingIds.has(user.id)) return;
    const wasFollowing = user.relationshipStatus === "following";
    setError("");
    setPendingIds((current) => new Set(current).add(user.id));
    try {
      if (wasFollowing) {
        await unfollowUser(user.username);
      } else {
        await followUser(user.username);
      }
      setUsers((current) => current.map((item) => item.id === user.id
        ? { ...item, relationshipStatus: wasFollowing ? "not_following" : "following" }
        : item));
      if (isOwner) onFollowingCountChange?.(wasFollowing ? -1 : 1);
    } catch (actionError: unknown) {
      setError(actionError instanceof Error ? actionError.message : "Unable to update this relationship. Please try again.");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(user.id);
        return next;
      });
    }
  };

  const title = mode === "followers" ? "Followers" : "Following";
  const emptyMessage = mode === "followers" ? "No followers yet" : "Not following anyone yet";

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={title}
      contentClassName="relative flex max-h-[calc(100dvh-2rem)] min-h-0 w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#202124] p-0 text-white shadow-2xl animate-in zoom-in-95 duration-200"
      closeButtonClassName="absolute right-3 top-2 z-10 flex h-9 w-9 items-center justify-center text-white transition hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      <div className="relative flex h-[min(560px,calc(100dvh-2rem))] min-h-0 flex-col">
        <header className="flex h-[52px] shrink-0 items-center justify-center border-b border-white/10 px-14">
          <h2 className="text-base font-semibold">{title}</h2>
        </header>

        <div className="shrink-0 px-4 py-3">
          <label className="flex h-10 items-center gap-3 rounded-xl bg-[#343536] px-4 text-gray-400 focus-within:ring-1 focus-within:ring-white/40">
            <Search size={19} aria-hidden="true" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              aria-label={`Search ${title.toLocaleLowerCase()}`}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
            />
          </label>
        </div>

        {error && <p role="alert" className="mx-4 mb-2 rounded-lg bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3" aria-live="polite">
          {loading ? (
            <div className="flex h-full min-h-32 items-center justify-center" role="status" aria-label={`Loading ${title.toLocaleLowerCase()}`}>
              <LoaderCircle className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length ? (
            <ul className="divide-y divide-white/4">
              {filteredUsers.map((user) => {
                const isPending = pendingIds.has(user.id);
                const following = user.relationshipStatus === "following";
                return (
                  <li key={user.id} className="flex min-h-[74px] items-center gap-3 py-2.5">
                    <UserAvatar
                      userId={user.id}
                      username={user.username}
                      imageUrl={user.profile_picture}
                      className="h-14 w-14 border border-white/10"
                      imageClassName="object-cover"
                      fallbackClassName="bg-[#e5e7eb] text-xl text-gray-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-100">{user.username}</p>
                      <p className="mt-0.5 truncate text-sm text-gray-400">{user.display_name}</p>
                    </div>
                    {mode === "followers" ? (
                      isOwner && <button
                        type="button"
                        onClick={() => void removeUser(user)}
                        disabled={isPending}
                        className="min-w-[94px] rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                      >{isPending ? "Removing..." : "Remove"}</button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void toggleFollowing(user)}
                        disabled={isPending}
                        className={`min-w-[94px] rounded-lg px-3 py-2 text-sm font-semibold text-white transition disabled:cursor-wait disabled:opacity-60 ${following ? "bg-red-600 hover:bg-red-700" : "bg-[#292b2e] hover:bg-[#3a3c40]"}`}
                      >{isPending ? "Saving..." : following ? "Unfollow" : "Follow"}</button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="flex h-full min-h-32 items-center justify-center px-4 text-center text-sm text-gray-400">
              {searchQuery.trim() ? "No users found" : emptyMessage}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}