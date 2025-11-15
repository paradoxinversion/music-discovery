"use client";
import { Button } from "@mda/components";
import { useState } from "react";
import UserVitalSettings from "./UserVitalSettings";
import { useRouter } from "next/navigation";
import useAuth from "../../../swrHooks/useAuth";
import AccessUnauthorized from "../../../commonComponents/AccessUnauthorized";

export default function Page() {
  const { authenticatedUser, isLoading, error } = useAuth();

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("favorites");

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <AccessUnauthorized />;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      <div className="flex space-x-4 mb-4">
        <Button
          label="Artist Settings"
          onClick={() => router.push("/artist/dashboard")}
        />
        <Button label="User Data" onClick={() => setCurrentPage("data")} />
      </div>
      <div>
        {currentPage === "favorites" && <div>User Favorites Content</div>}
        {currentPage === "data" && (
          <UserVitalSettings setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  );
}
