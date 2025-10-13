import axios from "axios";

export default async function deleteTrack(trackId: string) {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/tracks/${trackId}`,
    {
      withCredentials: true,
    },
  );
  return response;
}
