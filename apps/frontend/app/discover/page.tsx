"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ResourceTile, ResourceTileList } from "@mda/components";
import { unbounded } from "@/fonts";

export default function Page() {
  const router = useRouter();

  const [tracks, setTracks] = useState([]);
  const fetchRandomTracks = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/random`,
    );
    setTracks(response.data.data);
  };
  useEffect(() => {
    fetchRandomTracks();
  }, []);

  return (
    <div className="flex h-full flex-grow">
      <div className="flex-grow md:px-4 py-2">
        <header className="px-4">
          <h1 className={`text-3xl font-bold mb-2 ${unbounded.className}`}>
            Discover something you'll love
          </h1>
        </header>
        <div>
          <ResourceTileList
            resourceTiles={tracks.map((track) => (
              <ResourceTile
                key={track._id}
                mainText={track.title}
                subText={track.artistName}
                imageUrl={track.trackArt}
                onClick={() =>
                  router.push(`/track/${track.artistSlug}/${track.slug}`)
                }
              />
            ))}
          />
          <div className="flex mt-4 justify-center">
            <Button
              label="Refresh"
              onClick={() => {
                fetchRandomTracks();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
