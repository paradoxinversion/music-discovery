import axios from "axios";

/**
 * Fetch the managed artists for a specific user.
 * @param userId - The ID of the user whose managed artists are to be fetched.
 * @returns An array of managed artists or an error message.
 */
export default async function getManagedArtists(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch managed artists");
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/managed-artists`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching managed artists:", error);
    return [];
  }
}
