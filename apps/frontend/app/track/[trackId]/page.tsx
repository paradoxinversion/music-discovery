import { Scrobbler } from "@mda/components";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;

  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Track Name</h1>
      <a href="#">Artist Name</a>
      <a href="#">Album Name</a>
      <p>Release Date: YYYY-MM-DD</p>
      <p>Duration: MM:SS</p>
      <img
        src="https://picsum.photos/512/512?random=1"
        alt="Album Art"
        className="h-64 object-cover rounded-lg"
      />
      <div id="track-external-links">
        <a href={`https://open.spotify.com/track/${trackId}`} target="_blank">
          Listen on Spotify
        </a>
        <br />
        <a href={`https://music.apple.com/us/album/${trackId}`} target="_blank">
          Listen on Apple Music
        </a>
      </div>
      <div id="suggestions">
        <h2 className="text-xl font-semibold mt-4">You might also like:</h2>
        <ul className="list-disc list-inside">
          <li>
            <a href="#">Suggested Track 1 by Artist A</a>
          </li>
          <li>
            <a href="#">Suggested Track 2 by Artist B</a>
          </li>
          <li>
            <a href="#">Suggested Track 3 by Artist C</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
