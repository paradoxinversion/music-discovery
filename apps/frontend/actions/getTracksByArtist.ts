import axios from "axios";

/**
 * Fetch tracks by artist ID.
 * @param artistId - The ID of the artist whose tracks are to be fetched.
 * @returns An array of tracks or an error message.
 */
export default async function getTracksByArtist(artistId: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/artist/${artistId}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tracks by artist:", error);
    throw error;
  }
}
