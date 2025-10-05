"use client";
import axios from "axios";
import { useEffect, useState, use } from "react";

export default function TrackPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const trackId = use(params).trackId;
  const [trackData, setTrackData] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);

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
    <div className="flex flex-grow py-2 px-4">
      <div id="track-details" className="mr-8 w-1/3">
        <img
          src="https://picsum.photos/512/512?random=1"
          alt="Album Art"
          className="my-4 h-64 object-cover rounded-lg"
        />
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
        <a href={`https://open.spotify.com/track/${trackId}`} target="_blank">
          Spotify
        </a>
        <br />
        <a href={`https://music.apple.com/us/album/${trackId}`} target="_blank">
          Apple Music
        </a>
      </div>
      <div id="track-suggestions">
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
  );
}
