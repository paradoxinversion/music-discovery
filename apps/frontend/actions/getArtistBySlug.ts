import { IArtist } from "@common/types/src/types";
import axiosInstance from "../util/axiosInstance";

/**
 * Get artist by slug
 * @param slug
 * @returns The artist object or null if not found
 */
export default async function getArtistBySlug(
  slug: string,
  includeArt: boolean = false,
): Promise<IArtist | null> {
  try {
    const res = await axiosInstance.get(`/artist/slug/${slug}`, {
      params: { includeArt: includeArt ? "true" : undefined },
    });
    return res.data.data as IArtist | null;
  } catch (error) {
    console.error("Error fetching artist by slug:", error);
    return null;
  }
}
