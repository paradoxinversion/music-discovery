"use client";

import { use } from "react";
import Link from "next/link";
import setFavoriteArtist from "../../../actions/setFavoriteArtist";
import { useAppSelector } from "../../../lib/hooks";
import { useDispatch } from "react-redux";
import { setFavoriteArtists } from "../../../lib/features/users/userSlice";
import { ImgContainer, SidebarButton } from "@mda/components";
import useSWR from "swr";
import SimilarArtists from "./SimilarArtists";
import getRandomArtists from "../../../actions/getRandomArtists";
import axiosInstance from "../../../util/axiosInstance";
import OtherArtists from "./OtherArtists";
import { ExternalLinkList } from "@mda/components";
import { useRouter } from "next/navigation";
const artistFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data.data);
const similarArtistsFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data.data);
const otherArtistsFetcher = async (exclude: string) =>
  getRandomArtists(exclude);

export default function ArtistPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = use(params).artistId;
  const router = useRouter();
  const {
    data: mainArtistData,
    error: mainArtistDataError,
    isLoading: isMainArtistLoading,
  } = useSWR(`/artist/slug/${artistId}?includeArt=true`, artistFetcher, {
    revalidateOnFocus: false,
  });

  const {
    data: similarArtistsData,
    error: similarArtistsError,
    isLoading: isSimilarArtistsLoading,
  } = useSWR(
    () => {
      return `/artist/${mainArtistData._id}/similar`;
    },
    similarArtistsFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const {
    data: otherArtistsData,
    error: otherArtistsError,
    isLoading: isOtherArtistsLoading,
  } = useSWR(
    () => {
      const exclude = [
        artistId,
        ...similarArtistsData.map((artist) => artist._id),
      ].join(",");
      return `${exclude}`;
    },
    otherArtistsFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const user = useAppSelector((state) => state.user);
  const dispatch = useDispatch();

  const artistFavorited = user.favoriteArtists.includes(mainArtistData?._id);

  const handleFavoriteClick = async () => {
    try {
      const response = await setFavoriteArtist(
        mainArtistData._id,
        artistFavorited,
      );
      console.log("Favorite updated:", response);
      dispatch(setFavoriteArtists(response.data));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  if (isMainArtistLoading) {
    return <div>Loading...</div>;
  }
  if (mainArtistDataError) {
    return (
      <div>
        An error occurred while trying to load the artist. The artist might not
        exist or there was a server error.
      </div>
    );
  }

  return (
    <div id="artist-page" className="flex flex-col lg:flex-row grow py-2 px-4">
      <div id="artist-details" className="mr-8 lg:w-8/12 lg:overflow-y-auto">
        <h1 className="text-2xl font-bold">{mainArtistData.name}</h1>
        <ImgContainer
          src={
            mainArtistData.artistArt
              ? `data:image/jpeg;base64,${mainArtistData.artistArt}`
              : undefined
          }
          alt={mainArtistData.name}
        />
        {user.loggedIn ? (
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
        ) : (
          <p className="italic">Log in to add this artist to your favorites</p>
        )}
        <section id="artist-biography">
          <h2 className="text-xl font-semibold">About this Artist</h2>
          <p>{mainArtistData.biography}</p>
        </section>
        <ExternalLinkList
          links={mainArtistData.links}
          linkContainerType="cloud"
          containerClasses="mb-4 mt-4"
          title="Find me on"
        />
      </div>
      <div className="grow lg:border-l lg:border-gray-300 lg:pl-8 lg:overflow-y-auto">
        <div id="artist-tracks">
          <h2 className="text-xl font-semibold">
            Tracks by {mainArtistData.name}
          </h2>
          {mainArtistData.tracks && mainArtistData.tracks.length > 0 ? (
            <div className="list-disc list-inside">
              {mainArtistData.tracks.map((track) => (
                <SidebarButton
                  label={track.title}
                  key={track._id}
                  textAlign="left"
                  onClick={() =>
                    router.push(`/track/${mainArtistData.slug}/${track.slug}`)
                  }
                />
              ))}
            </div>
          ) : (
            <p>No tracks available.</p>
          )}
        </div>
        <SimilarArtists
          similarArtistsData={similarArtistsData}
          similarArtistsError={similarArtistsError}
          isSimilarArtistsLoading={isSimilarArtistsLoading}
        />
        <OtherArtists
          otherArtistsData={otherArtistsData}
          otherArtistsError={otherArtistsError}
          isOtherArtistsLoading={isOtherArtistsLoading}
        />
      </div>
    </div>
  );
}
