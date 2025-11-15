"use client";
import { Button } from "@mda/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import axios from "axios";
import { useEffect } from "react";
import { setUser, unsetUser } from "../../lib/features/users/userSlice";
import logOut from "../../actions/logout";
import { boldonse } from "@/fonts";
import useAuth from "../../swrHooks/useAuth";

const Header = () => {
  const name = useAppSelector((state) => state.user.username);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authenticatedUser } = useAuth();

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
      <span
        className={`text-2xl cursor-pointer hover:text-rose-500 ${boldonse.className}`}
        onClick={() => {
          router.push("/");
        }}
      >
        OffBeat
      </span>
      {name ? (
        <div className="flex items-center space-x-4">
          <Button
            label="Logout"
            category="secondary"
            onClick={() => {
              handleLogout();
            }}
          />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button category="secondary" label="Login" />
          </Link>
          <Link href="/signup">
            <Button category="secondary" label="Sign Up" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
