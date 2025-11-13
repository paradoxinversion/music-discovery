"use client";
import axios from "axios";
import { use } from "react";
import { useAppSelector } from "../../../../lib/hooks";
import { useDispatch } from "react-redux";
import { setFavoriteTracks } from "../../../../lib/features/users/userSlice";
import { ImgContainer } from "@mda/components";
import axiosInstance from "../../../../util/axiosInstance";
import useSWR from "swr";
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data.data);
export default function TrackPage({
  params,
}: {
  params: Promise<{ artistSlug: string; trackId: string }>;
}) {
  const { artistSlug, trackId } = use(params);
  const { data: trackData } = useSWR(
    `/track/slug/${trackId}/artist/${artistSlug}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const { data: similarTracks } = useSWR(
    () => {
      return `/tracks/${trackData._id}/similar`;
    },
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const trackFavorited = user.favoriteTracks.includes(trackId);

  const likeTrack = async () => {
    try {
      if (!user.loggedIn) {
        throw new Error("User must be logged in to like a track");
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tracks/${trackId}/favorite`,
        {
          userId: user.userId,
          trackId: trackId,
          remove: trackFavorited,
        },
        { withCredentials: true },
      );
      dispatch(setFavoriteTracks(response.data.data));
    } catch (error) {
      console.error("Error liking track:", error);
    }
  };

  function formatSecondsToMMSS(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad with a leading zero if the number is less than 10
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  if (!trackData) {
    return <div>Loading...</div>;
  }

  return (
    <div id="track-page" className="flex flex-col p-4 md:flex-row grow h-full">
      <div id="track-details" className="mr-8 md:w-1/2">
        <h1 className="text-2xl font-bold">{trackData.title}</h1>
        <ImgContainer
          src={`data:image/jpeg;base64,${trackData.trackArt}`}
          alt="Album Art"
        />
        {user.loggedIn ? (
          <div onClick={likeTrack} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`size-5 hover:fill-pink-700 ${trackFavorited ? "fill-pink-600" : "fill-gray-400"}`}
            >
              <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
            </svg>
          </div>
        ) : (
          <p className="italic">Log in to add this track to your favorites</p>
        )}

        {trackData.artistId?.name && (
          <a href={`/artists/${trackData.artistId.slug}`}>
            {trackData.artistId.name}
          </a>
        )}
        {trackData.album && <a href="#">{trackData.album}</a>}
        {trackData.duration && (
          <p>Duration: {formatSecondsToMMSS(trackData.duration)}</p>
        )}
        <div id="track-external-links">
          <h1 className="text-2xl font-bold">Listen on:</h1>
          {trackData.links && Object.keys(trackData.links).length > 0 ? (
            Object.keys(trackData.links).map((key, index) => (
              <div key={index}>
                <a
                  href={trackData.links[key]}
                  target="_blank"
                  className="text-blue-500"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              </div>
            ))
          ) : (
            <p>No external links available.</p>
          )}
        </div>
      </div>

      <div id="track-suggestions" className=" md:w-1/2">
        <h2 className="text-xl font-semibold">You might also like:</h2>
        {similarTracks && similarTracks.length > 0 ? (
          <ul className="list-disc list-inside">
            {similarTracks.map((track) => (
              <li key={track._id}>
                <a href={`/track/${track.artistSlug}/${track.slug}`}>
                  {track.title} by {track?.artistName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No similar tracks found.</p>
        )}
      </div>
    </div>
  );
}
