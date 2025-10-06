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
  const [similarArtists, setSimilarArtists] = useState([]);
  const [otherArtists, setOtherArtists] = useState([]);
  const fetchSimilarArtists = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/artist/${id}/similar`,
      );
      setSimilarArtists(response.data.data);
    } catch (error) {
      console.error("Error fetching similar artists:", error);
    }
  };
  const fetchOtherArtists = async () => {
    try {
      const exclude = [
        artistId,
        ...similarArtists.map((artist) => artist._id),
      ].join(",");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/artists/random?exclude=${exclude}`,
      );
      setOtherArtists(response.data.data);
    } catch (error) {
      console.error("Error fetching other artists:", error);
    }
  };
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
    fetchSimilarArtists(artistId);
    fetchOtherArtists();
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
      <div>
        <div id="suggestions">
          <h2 className="text-xl font-semibold mt-4">You might also like:</h2>
          {similarArtists.length > 0 ? (
            <ul className="list-disc list-inside">
              {similarArtists.map((artist: any) => (
                <li key={artist._id}>
                  <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading suggestions...</p>
          )}
        </div>
        <div id="other-suggestions">
          <h2 className="text-xl font-semibold mt-4">Other artists:</h2>
          {otherArtists.length > 0 ? (
            <ul className="list-disc list-inside">
              {otherArtists.map((artist: any) => (
                <li key={artist._id}>
                  <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading suggestions...</p>
          )}
        </div>
      </div>
    </div>
  );
}
