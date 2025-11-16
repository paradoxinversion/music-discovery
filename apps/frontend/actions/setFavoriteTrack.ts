import axiosInstance from "../util/axiosInstance";

export default async function setFavoriteTrack(
  trackId: string,
  remove: boolean,
) {
  try {
    const response = await axiosInstance.post(
      `/tracks/${trackId}/favorite`,
      {
        trackId,
        remove,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error liking track:", error);
  }
}
