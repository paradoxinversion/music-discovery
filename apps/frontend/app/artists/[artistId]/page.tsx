"use client";
import axios from "axios";
import { useEffect, useState, use } from "react";

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
    <div className="flex flex-col items-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">{artistData.name}</h1>
      <p>Genre: {artistData.genre}</p>
      <p>Bio: {artistData.biography}</p>
      <div id="artist-external-links">
        <a href={`https://open.spotify.com/artist/${artistId}`} target="_blank">
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
