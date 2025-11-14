"use client";
import { useRouter } from "next/navigation";

import { use, useEffect, useState } from "react";
import getArtistById from "../../../../actions/getArtistDataById";
import getTracksByArtist from "../../../../actions/getTracksByArtist";
import { Button } from "@mda/components";
import EditArtistForm from "./EditArtistForm";
import deleteTrack from "../../../../actions/deleteTrack";

export default function Page({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const router = useRouter();
  const artistId = use(params).artistId;
  const [artistData, setArtistData] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [editArtistData, setEditArtistData] = useState(false);
  useEffect(() => {
    getArtistById(artistId, true).then((data) => setArtistData(data));
    getTracksByArtist(artistId).then((data) => setArtistTracks(data.data));
  }, []);
  const handleDeleteTrack = async (trackId: string) => {
    const response = await deleteTrack(trackId);
    if (response.status === 200) {
      setArtistTracks((prevTracks) =>
        prevTracks.filter((track) => track._id !== trackId),
      );
    }
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>
      {artistData ? (
        <div>
          <div id="artist-details" className="mb-4">
            <h2 className="text-xl font-semibold">{artistData.name}</h2>
          </div>
          <div className="flex gap-4">
            <Button
              label="Go to Artist Page"
              onClick={() => router.push(`/artists/${artistData.slug}`)}
            />
            {!editArtistData && (
              <Button
                label="Edit Artist Details"
                onClick={() => setEditArtistData(true)}
              />
            )}
          </div>
          {editArtistData && (
            <EditArtistForm
              artistId={artistId}
              artistData={artistData}
              setArtistDataAction={setArtistData}
              setEditArtistDataAction={setEditArtistData}
            />
          )}
          <div id="artist-tracks" className="mt-4">
            <p className="text-xl font-semibold mb-4">Artist Tracks</p>
            <Button
              label="Add New Track"
              onClick={() =>
                router.push(`/artist/dashboard/${artistId}/add-track`)
              }
            />
            {artistTracks.length > 0 ? (
              <div className="flex flex-col w-full mt-4 border border-gray-700 rounded-md p-2">
                {artistTracks.map((track) => (
                  <div
                    key={track._id}
                    className="flex p-2 my-2 w-full items-center  hover:bg-gray-800 rounded-md"
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
