"use client";
import axios from "axios";
import joi from "joi";
import { useEffect, useState } from "react";
import checkAuthentication from "../../actions/checkAuthentication";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../lib/hooks";
import { setUser } from "../../lib/features/users/userSlice";

const loginSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  password: joi.string().min(6).required(),
});

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "password") setPassword(value);
  };
  const handleSubmit = async (e) => {
    const { error, value } = loginSchema.validate({
      username,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/log-in`,
        value,
        {
          withCredentials: true,
        },
      );
      dispatch(setUser(res.data.user));
      router.push("/discover");
    } catch (error) {
      console.error("Login error:", error.response.data);
    }
  };

  useEffect(() => {
    checkAuthentication().then((user) => {
      if (user) {
        dispatch(setUser(user));
        router.push("/discover");
      }
    });
  }, []);
  return (
    <div className="flex flex-col items-center min-h-screen justify-center py-2">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form
        action={handleSubmit}
        onChange={onChange}
        className="flex flex-col space-y-4 w-80"
      >
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
