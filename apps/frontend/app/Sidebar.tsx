"use client";
import axios from "axios";
import { useAppSelector } from "../lib/hooks";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar as SidebarComponent } from "@mda/components";
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

  const goToArtist = (slug: string) => {
    router.push(`/artists/${slug}`);
  };

  const goToTrack = (artistSlug: string, trackSlug: string) => {
    router.push(`/track/${artistSlug}/${trackSlug}`);
  };
  return (
    <div className=" border-r border-gray-800 md:sticky md:top-0 overflow-y-auto">
      <div className="">
        <p>Bar</p>
      </div>
      <div className="hidden md:block">
        <SidebarComponent
          favoriteArtists={favoriteArtists}
          favoriteTracks={favoriteTracks}
          onArtistClick={goToArtist}
          onTrackClick={goToTrack}
        />
      </div>
    </div>
  );
}
