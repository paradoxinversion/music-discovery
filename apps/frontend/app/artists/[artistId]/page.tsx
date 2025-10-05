"use client";
import axios from "axios";
import { useEffect, useState, use } from "react";
import Link from "next/link";

export default function ArtistPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = use(params).artistId;
  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/artists/${artistId}`,
        );
        setArtistData(response.data.data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    fetchArtistData();
  }, [artistId]);

  if (!artistData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-grow py-2 px-4">
      <div id="artist-details" className="mr-8 w-1/2">
        <h1 className="text-2xl font-bold">{artistData.name}</h1>
        <img
          src={"https://picsum.photos/1024/1024?random=1"}
          alt={artistData.name}
          className="my-4 w-64 h-64 object-cover rounded"
        />
        <p>{artistData.biography}</p>
        <div id="artist-external-links" className="mt-2">
          <h2 className="text-xl font-semibold">Social Links</h2>
          <a
            href={`https://open.spotify.com/artist/${artistId}`}
            target="_blank"
          >
            Listen on Spotify
          </a>
          <br />
          <a
            href={`https://music.apple.com/us/artist/${artistId}`}
            target="_blank"
          >
            Listen on Apple Music
          </a>
        </div>
      </div>
      <div id="suggestions">
        <h2 className="text-xl font-semibold mt-4">You might also like:</h2>
        <ul className="list-disc list-inside">
          <li>
            <a href="#">Suggested Artist 1</a>
          </li>
          <li>
            <a href="#">Suggested Artist 2</a>
          </li>
          <li>
            <a href="#">Suggested Artist 3</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
