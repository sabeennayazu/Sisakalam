'use client';

import Image from 'next/image';

interface Author {
  id: string;
  name: string;
  profile_image: string;
}

interface HeroSectionProps {
  title: string;
  synopsis: string;
  author: Author;
  image: string;
  likes: number;
  views: number;
  bookmarks: number;
}

export default function HeroSection({
  title,
  synopsis,
  author,
  image,
  likes,
  views,
  bookmarks,
}: HeroSectionProps) {
  return (
    <section className="mb-16 flex flex-col items-center">
      {/* Story Cover */}
      <div className="relative mb-8 h-64 w-48 overflow-hidden rounded-lg shadow-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Story Title */}
      <h1 className="mb-6 text-4xl font-bold text-gray-900">{title}</h1>

      {/* Author Info */}
      <div className="mb-8 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={author.profile_image}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{author.name}</p>
          <p className="text-xs text-gray-500">Author</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-8 text-center">
        <div>
          <p className="text-base font-bold text-gray-900">
            {(views / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-gray-500">Views</p>
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">
            {(likes / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">
            {(bookmarks / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-gray-500">Bookmarks</p>
        </div>
      </div>

      {/* Synopsis */}
      <div className="max-w-2xl">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Synopsis</h2>
        <p className="line-clamp-4 text-sm text-gray-700">{synopsis}</p>
      </div>

      {/* Divider */}
      <div className="my-10 w-full border-t border-gray-200" />
    </section>
  );
}
