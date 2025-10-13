"use client";
import { Button } from "@mda/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import axios from "axios";
import { useEffect } from "react";
import { setUser, unsetUser } from "../../lib/features/users/userSlice";
import logOut from "../../actions/logout";

const Header = () => {
  const name = useAppSelector((state) => state.user.username);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`,
        { withCredentials: true },
      );
      if (response.data.result === 0) return;
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const logoutSuccessful = await logOut();
      if (logoutSuccessful) {
        dispatch(unsetUser());
        router.push("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300">
      <span className="text-lg font-semibold">Music Discovery App</span>
      <Link href="/discover">
        <Button label="Discover" />
      </Link>
      {name ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm">Hello, {name}!</span>
          <Link href="/settings/user">
            <Button label="Settings" />
          </Link>
          <Button label="Logout" onClick={handleLogout} />
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
