import axiosInstance from "../util/axiosInstance";

export default async function getSimilarArtists(id: string) {
  try {
    const response = await axiosInstance.get(`/artist/${id}/similar`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching similar artists:", error);
  }
}
