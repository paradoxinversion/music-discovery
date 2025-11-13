"use client";
import axios from "axios";
import { useAppSelector } from "../lib/hooks";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const getFavorites = async () => {
    if (!user.loggedIn) return;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/favorites`,
      { withCredentials: true },
    );

    setFavoriteArtists(response.data.favorites.favoriteArtists);
    setFavoriteTracks(response.data.favorites.favoriteTracks);
  };

  useEffect(() => {
    getFavorites();
  }, [user]);

  if (
    !user.loggedIn ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return null;
  }
  return (
    <div className="hidden min-w-64 w-64 border-r md:block p-4 space-y-6">
      <div id="sidebar-favorite-artists">
        <p>Favorite Artists</p>
        {favoriteArtists.map((artist) => (
          <div
            key={artist._id}
            className="mt-2 hover:bg-gray-600 cursor-pointer"
          >
            <p
              className="no-underline pl-2"
              onClick={() => router.push(`/artists/${artist.slug}`)}
            >
              {artist.name}
            </p>
          </div>
        ))}
      </div>
      <div id="sidebar-favorite-tracks">
        <p>Favorite Tracks</p>
        {favoriteTracks.map((track) => (
          <div
            key={track._id}
            className="mt-2 hover:bg-gray-600 cursor-pointer"
          >
            <p
              className="no-underline pl-2"
              onClick={() => router.push(`/track/${track._id}`)}
            >
              {track.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
