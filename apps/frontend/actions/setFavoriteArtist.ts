import axios from "axios";

/**
 * Set a specific artist as a favorite or remove from favorites.
 * @param artistId - The ID of the artist to favorite or unfavorite.
 * @param remove - Whether to remove the artist from favorites.
 * @returns The updated artist data or an error message.
 */
export default async function setFavoriteArtist(
  artistId: string,
  remove: boolean,
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/artist/${artistId}/favorite`,
      { remove },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error setting favorite artist:", error);
    throw error;
  }
}
