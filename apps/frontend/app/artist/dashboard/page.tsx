"use client";
import { useRouter } from "next/navigation";

import ArtistSignup from "./ArtistSignup";
import { useEffect, useState } from "react";
import checkAuthentication from "../../../actions/checkAuthentication";
import { useAppSelector } from "../../../lib/hooks";
import getManagedArtists from "../../../actions/getManagedArtists";
import { Button } from "@mda/components";

export default function Page() {
  const [managedArtists, setManagedArtists] = useState([]);
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  useEffect(() => {
    checkAuthentication().then((user) => {
      if (!user) {
        router.push("/login");
      }
    });
  }, []);

  useEffect(() => {
    if (user.userId) {
      getManagedArtists(user.userId).then((data) => {
        setManagedArtists(data.data || []);
      });
    }
  }, [user]);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Artist Dashboard</h1>
      <p>
        Welcome to your dashboard, where you can manage your music and profile.
      </p>
      {managedArtists.length === 0 && (
        <div>
          <p>
            You currently aren't managing any artists. Complete the Artist Setup
            form below to get started.
          </p>
          <p>By signing up, you assert that:</p>
          <ul className="list-disc list-inside">
            <li>
              You are the rightful owner or have the necessary rights to manage
              the artist profile.
            </li>
            <li>You have released music under the artist's name.</li>
            <li>You agree to our terms of service and privacy policy.</li>
            <li>You will provide accurate and truthful information.</li>
          </ul>
          <ArtistSignup />
        </div>
      )}
      {managedArtists.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-4 mb-4">Your Managed Artists</h2>
          {managedArtists.map((artist) => (
            <Button
              key={artist._id}
              label={artist.name}
              onClick={() => router.push(`/artist/dashboard/${artist._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
