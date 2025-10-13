"use client";
import axios from "axios";
import { useEffect, useState, use } from "react";
import { useAppSelector } from "../../../lib/hooks";
import { useDispatch } from "react-redux";
import { setFavoriteTracks } from "../../../lib/features/users/userSlice";

export default function TrackPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const dispatch = useDispatch();
  const trackId = use(params).trackId;
  const [trackData, setTrackData] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
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
  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tracks/${trackId}`,
        );
        setTrackData(response.data.data);
      } catch (error) {
        console.error("Error fetching track data:", error);
      }
    };

    const fetchSimilarTracks = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tracks/${trackId}/similar`,
        );
        setSimilarTracks(response.data.data);
      } catch (error) {
        console.error("Error fetching similar tracks:", error);
      }
    };

    fetchTrackData();
    fetchSimilarTracks();
  }, [trackId]);
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
    <div className="flex flex-grow h-full">
      <div className="flex flex-grow p-4">
        <div id="track-details" className="mr-8 w-1/3">
          <img
            src="https://picsum.photos/512/512?random=1"
            alt="Album Art"
            className="my-4 h-64 object-cover rounded-lg"
          />
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
          <h1 className="text-2xl font-bold">{trackData.title}</h1>
          {trackData.artistId?.name && (
            <a href={`/artists/${trackData.artistId._id}`}>
              {trackData.artistId.name}
            </a>
          )}
          {trackData.album && <a href="#">{trackData.album}</a>}
          <p>Duration: {formatSecondsToMMSS(trackData.duration)}</p>
        </div>

        <div id="track-external-links" className="w-1/3">
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
        <div id="track-suggestions" className="flex-grow">
          <h2 className="text-xl font-semibold">You might also like:</h2>
          {similarTracks.length > 0 ? (
            <ul className="list-disc list-inside">
              {similarTracks.map((track) => (
                <li key={track._id}>
                  <a href={`/track/${track._id}`}>
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
    </div>
  );
}
