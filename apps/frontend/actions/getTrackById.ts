import axios from "axios";

/**
 * Fetch track data by ID.
 * @param trackId - The ID of the track to fetch.
 * @returns The track data or an error message.
 */
export default async function getTrackById(trackId: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/${trackId}?withLinks=true`,
      {
        withCredentials: true,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching track by ID:", error);
    throw error;
  }
}
