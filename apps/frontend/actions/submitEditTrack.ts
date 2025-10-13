import { EditableTrack } from "@common/types/src/types";
import axios from "axios";

/**
 * Submit edits to a track.
 * @param trackId - The ID of the track to edit.
 * @param data - The edited track data.
 * @returns The updated track data or an error message.
 */
export default async function submitEditTrack(
  trackId: string,
  data: EditableTrack,
) {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/${trackId}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response;
  } catch (error) {
    console.error("Error editing track:", error);
    throw error;
  }
}
