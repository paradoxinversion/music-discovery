import useSWR from "swr";
import axiosInstance from "../util/axiosInstance";
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
export default function useAuth() {
  const { data, error, isLoading } = useSWR("/auth/check-auth", fetcher, {
    revalidateOnFocus: false,
  });

  return {
    authenticatedUser: data,
    isLoading,
    error,
  };
}
