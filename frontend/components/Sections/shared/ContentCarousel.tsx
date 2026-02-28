"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContentCarouselProps {
  title: string;
  items?: { id: number; title: string; description: string }[];
}

export default function ContentCarousel({ title, items = [] }: ContentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultItems = items.length > 0 ? items : [
    { id: 1, title: "Item 1", description: "Description 1" },
    { id: 2, title: "Item 2", description: "Description 2" },
    { id: 3, title: "Item 3", description: "Description 3" },
    { id: 4, title: "Item 4", description: "Description 4" },
    { id: 5, title: "Item 5", description: "Description 5" },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? defaultItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === defaultItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
