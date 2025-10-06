import axios from "axios";

export default async function checkAuthentication() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`,
      { withCredentials: true },
    );
    return response.data.user;
  } catch (error) {
    console.error("Error checking auth:", error);
  }
}
