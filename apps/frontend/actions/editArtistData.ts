import { EditableArtist } from "@common/types/src/types";
import axios from "axios";

export default async function editArtistData(
  artistId: string,
  artistData: EditableArtist,
) {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/artists/${artistId}`,
    artistData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
}
