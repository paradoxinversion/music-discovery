"use client";
import { Button } from "@mda/components";
import { useState } from "react";
import UserVitalSettings from "./UserVitalSettings";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("favorites");
  return (
    <div className="p-4">
      <div className="flex">
        <Button
          label="Artist Settings"
          onClick={() => router.push("/artist/dashboard")}
        />
        <Button
          label="User Favorites"
          onClick={() => setCurrentPage("favorites")}
        />
        <Button label="User Data" onClick={() => setCurrentPage("data")} />
      </div>
      <div>
        {currentPage === "favorites" && <div>User Favorites Content</div>}
        {currentPage === "data" && <UserVitalSettings />}
      </div>
    </div>
  );
}
