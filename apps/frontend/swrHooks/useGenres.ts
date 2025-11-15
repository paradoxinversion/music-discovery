import useSWR from "swr";
import axiosInstance from "../util/axiosInstance";
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
export default function useGenres() {
  const { data, error, isLoading } = useSWR("/genre", fetcher, {
    revalidateOnFocus: false,
  });

  return {
    genres: data,
    genresLoading: isLoading,
    genreLoadError: error,
  };
}
