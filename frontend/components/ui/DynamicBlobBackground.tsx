"use client";

import React, { useState, useEffect } from "react";
import { Vibrant } from "node-vibrant/browser";

interface BlobColors {
  color1: string;
  color2: string;
  color3: string;
}

interface DynamicBlobBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
}

export default function DynamicBlobBackground({
  imageUrl,
  children,
}: DynamicBlobBackgroundProps) {
  const [colors, setColors] = useState<BlobColors>({
    color1: "rgb(31, 41, 55)",
    color2: "rgb(17, 24, 39)",
    color3: "rgb(55, 65, 81)",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function extractColors() {
      try {
        const palette = await Vibrant.from(imageUrl).getPalette();

        if (!isMounted) return;

        // Extract RGB values from hex colors
        const vibrant = palette.Vibrant?.hex || "#1f2937";
        const darkVibrant = palette.DarkVibrant?.hex || "#111827";
        const lightVibrant = palette.LightVibrant?.hex || "#374151";

        const color1 = hexToRgb(vibrant);
        const color2 = hexToRgb(darkVibrant);
        const color3 = hexToRgb(lightVibrant);

        setColors({
          color1,
          color2,
          color3,
        });
      } catch (error) {
        console.error("Color extraction failed:", error);
        // Keep default colors
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    extractColors();

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return (
    <div className="relative overflow-hidden">
      {/* Blob 1 - Top Left */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-multiply animate-blob"
        style={{ backgroundColor: colors.color1 }}
      />

      {/* Blob 2 - Top Right */}
      <div
        className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-3xl opacity-30 mix-blend-multiply animate-blob"
        style={{
          backgroundColor: colors.color2,
          animationDelay: "2s",
        }}
      />

      {/* Blob 3 - Bottom Center */}
      <div
        className="absolute bottom-[-20%] left-[20%] w-[450px] h-[450px] rounded-full blur-3xl opacity-30 mix-blend-multiply animate-blob"
        style={{
          backgroundColor: colors.color3,
          animationDelay: "4s",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return "rgb(31, 41, 55)";
}
