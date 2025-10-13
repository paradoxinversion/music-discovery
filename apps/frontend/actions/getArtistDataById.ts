import axios from "axios";

/**
 * Fetch artist data by ID.
 * @param artistId - The ID of the artist to fetch.
 * @returns The artist data or an error message.
 */
export default async function getArtistById(artistId: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/artists/${artistId}`,
      {
        withCredentials: true,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching artist data:", error);
  }
}
