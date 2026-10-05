"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { profileImageUpdateEvent, type ProfileImageUpdate } from "@/utils/profile-image-events";

interface UserAvatarProps {
  userId: number;
  username: string;
  imageUrl?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

export default function UserAvatar({
  userId,
  username,
  imageUrl,
  className = "h-9 w-9",
  imageClassName = "object-cover",
  fallbackClassName = "bg-gray-200 text-gray-600",
}: UserAvatarProps) {
  const [updatedImages, setUpdatedImages] = useState<Record<number, string>>({});
  const [brokenImage, setBrokenImage] = useState<string | null>(null);
  const displayedImage = updatedImages[userId] ?? imageUrl ?? null;
  const imageFailed = displayedImage !== null && brokenImage === displayedImage;

  useEffect(() => {
    const handleProfileImageUpdate = (event: Event) => {
      const { detail } = event as CustomEvent<ProfileImageUpdate>;
      if (detail.userId === userId) {
        setUpdatedImages((current) => ({ ...current, [userId]: detail.imageUrl }));
      }
    };
    window.addEventListener(profileImageUpdateEvent, handleProfileImageUpdate);
    return () => window.removeEventListener(profileImageUpdateEvent, handleProfileImageUpdate);
  }, [userId]);

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`} role="img" aria-label={`${username}'s profile image`}>
      {displayedImage && !imageFailed ? (
        <Image
          src={displayedImage}
          alt=""
          width={160}
          height={160}
          unoptimized
          className={`h-full w-full ${imageClassName}`}
          onError={() => setBrokenImage(displayedImage)}
        />
      ) : (
        <span aria-hidden="true" className={`flex h-full w-full items-center justify-center font-semibold uppercase ${fallbackClassName}`}>
          {username.trim().charAt(0) || "?"}
        </span>
      )}
    </span>
  );
}