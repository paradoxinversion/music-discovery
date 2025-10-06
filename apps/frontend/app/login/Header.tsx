"use client";
import { Button } from "@mda/components";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import axios from "axios";
import { useEffect } from "react";
import { setUser } from "../../lib/features/users/userSlice";

const Header = () => {
  const name = useAppSelector((state) => state.user.username);
  const dispatch = useAppDispatch();
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`,
        { withCredentials: true },
      );
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300 mb-4">
      <span className="text-lg font-semibold">Music Discovery App</span>
      <Link href="/discover">
        <Button label="Discover" />
      </Link>
      {name ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm">Hello, {name}!</span>
          <Link href="/logout">
            <Button label="Logout" />
          </Link>
        </div>
      ) : (
        <div>
          <Link href="/login">
            <Button label="Login" />
          </Link>
          <Link href="/signup">
            <Button label="Sign Up" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
