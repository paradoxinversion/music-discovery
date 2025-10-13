"use client";
import { useRouter } from "next/navigation";

import { use, useEffect, useState } from "react";
import getArtistById from "../../../../actions/getArtistDataById";
import checkAuthentication from "../../../../actions/checkAuthentication";
import getTracksByArtist from "../../../../actions/getTracksByArtist";
import { Button } from "@mda/components";
import EditArtistForm from "./EditArtistForm";

export default function Page({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const router = useRouter();
  const artistId = use(params).artistId;
  const [artistData, setArtistData] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  useEffect(() => {
    checkAuthentication().then((user) => {
      if (!user) {
        router.push("/login");
      }
    });
  }, []);
  useEffect(() => {
    getArtistById(artistId).then((data) => setArtistData(data));
    getTracksByArtist(artistId).then((data) => setArtistTracks(data.data));
  }, []);
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>
      {artistData ? (
        <div>
          <div id="artist-details">
            <h2 className="text-xl font-semibold">{artistData.name}</h2>
          </div>
          <EditArtistForm artistData={artistData} />
          <div id="artist-tracks" className="mt-4">
            <p>Artist Tracks</p>
            <Button
              label="Add New Track"
              onClick={() =>
                router.push(`/artist/dashboard/${artistId}/add-track`)
              }
            />
            {artistTracks.length > 0 ? (
              <div className="flex flex-col w-full">
                {artistTracks.map((track) => (
                  <div
                    key={track._id}
                    className="flex border p-2 my-2 w-full items-center"
                  >
                    {track.title}
                    <div className="flex-grow" />
                    <div className="space-x-4">
                      <Button
                        label="Edit"
                        onClick={() =>
                          router.push(
                            `/artist/dashboard/${artistId}/edit-track/${track._id}`,
                          )
                        }
                      />
                      <Button label="Delete" onClick={() => {}} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tracks found for this artist.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading artist data...</p>
      )}
    </div>
  );
}
