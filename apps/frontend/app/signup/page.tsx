"use client";
import axios from "axios";
import joi from "joi";
import { useState } from "react";

const loginSchema = joi.object({
  email: joi.string().email().required(),
  username: joi.string().min(3).max(30).required(),
  password: joi.string().min(6).required(),
});

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    // Handle login logic here
    const { error, value } = loginSchema.validate({
      username,
      email,
      password,
    });
    if (error) {
      console.error("Validation error:", error.message);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
        value,
      );
    } catch (error) {
      console.error("Signup error:", error.response.data);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen justify-center py-2">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form
        action={handleSubmit}
        onChange={onChange}
        className="flex flex-col space-y-4 w-80"
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded px-3 py-2"
          //   value={username}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2"
          //   value={password}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
