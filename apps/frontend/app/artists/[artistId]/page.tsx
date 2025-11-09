"use client";

import axios from "axios";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import setFavoriteArtist from "../../../actions/setFavoriteArtist";
import { useAppSelector } from "../../../lib/hooks";
import { useDispatch } from "react-redux";
import { setFavoriteArtists } from "../../../lib/features/users/userSlice";
import { ImgContainer } from "@mda/components";

export default function ArtistPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = use(params).artistId;
  const [artistData, setArtistData] = useState(null);
  const [similarArtists, setSimilarArtists] = useState([]);
  const [otherArtists, setOtherArtists] = useState([]);
  const user = useAppSelector((state) => state.user);
  const dispatch = useDispatch();
  const artistFavorited = user.favoriteArtists.includes(artistId);
  const handleFavoriteClick = async () => {
    try {
      const response = await setFavoriteArtist(artistId, artistFavorited);
      console.log("Favorite updated:", response);
      dispatch(setFavoriteArtists(response.data));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

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
        <ImgContainer
          src={`data:image/jpeg;base64,${artistData.artistArt}`}
          alt={artistData.name}
        />
        <div onClick={handleFavoriteClick} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`size-5 hover:fill-pink-700 ${artistFavorited ? "fill-pink-600" : "fill-gray-400"}`}
          >
            <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
          </svg>
        </div>

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
      <div className="w-1/3">
        <div id="suggestions">
          <h2 className="text-xl font-semibold mt-4">You might also like:</h2>
          {similarArtists.length > 0 ? (
            <ul className="list-disc list-inside">
              {similarArtists.map((artist) => (
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
              {otherArtists.map((artist) => (
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
