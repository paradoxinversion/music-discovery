import { TrackSubmissionData } from "@common/types/src/types";
import axios from "axios";

/**
 * Submit a new track.
 * @param trackSubmissionData - The data of the track to be submitted.
 * @returns The submitted track data or an error message.
 */
export default async function submitTrack(
  trackSubmissionData: Omit<TrackSubmissionData, "trackArt"> & {
    trackArt?: File;
  },
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks`,
      trackSubmissionData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error submitting track:", error);
    throw error;
  }
}
