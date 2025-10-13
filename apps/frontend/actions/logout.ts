import axios from "axios";

/**
 * Logs out the current user.
 * @returns A boolean indicating whether the logout was successful.
 */
export default async function logOut() {
  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/log-out`,
    { withCredentials: true },
  );
  return result.status === 200;
}
