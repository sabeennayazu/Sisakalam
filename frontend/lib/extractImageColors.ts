import { Vibrant } from "node-vibrant/browser";

export async function extractImageColors(imageUrl: string) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    return {
      dominant:
        palette.Vibrant?.hex ||
        palette.Muted?.hex ||
        "#1f2937",

      secondary:
        palette.DarkVibrant?.hex ||
        palette.DarkMuted?.hex ||
        "#111827",

      glow:
        palette.LightVibrant?.hex ||
        palette.LightMuted?.hex ||
        "#374151",
    };
  } catch (error) {
    console.error("Color extraction failed", error);

    return {
      dominant: "#1f2937",
      secondary: "#111827",
      glow: "#374151",
    };
  }
}
