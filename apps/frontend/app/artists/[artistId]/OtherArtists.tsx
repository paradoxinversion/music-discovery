import Link from "next/link";

interface OtherArtistsProps {
  otherArtistsData?: any;
  otherArtistsError?: any;
  isOtherArtistsLoading?: boolean;
}

export default function OtherArtists({
  otherArtistsData,
  otherArtistsError,
  isOtherArtistsLoading,
}: OtherArtistsProps) {
  if (isOtherArtistsLoading) {
    return <div>Loading...</div>;
  }
  if (otherArtistsError) {
    return <div>Error: {otherArtistsError.message}</div>;
  }
  return (
    <div id="other-suggestions">
      <h2 className="text-xl font-semibold mt-4">Other artists:</h2>
      {otherArtistsData && otherArtistsData.length > 0 && (
        <ul className="list-disc list-inside">
          {otherArtistsData.map((artist) => (
            <li key={`other-artist-${artist.slug}`}>
              <Link href={`/artists/${artist.slug}`}>{artist.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
