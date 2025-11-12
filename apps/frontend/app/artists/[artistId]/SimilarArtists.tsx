import Link from "next/link";

interface SimilarArtistsProps {
  similarArtistsData?: any;
  similarArtistsError?: any;
  isSimilarArtistsLoading?: boolean;
}

export default function SimilarArtists({
  similarArtistsData,
  similarArtistsError,
  isSimilarArtistsLoading,
}: SimilarArtistsProps) {
  if (isSimilarArtistsLoading) {
    return <div>Loading...</div>;
  }
  if (similarArtistsError) {
    return <div>Error: {similarArtistsError.message}</div>;
  }
  return (
    <div id="suggestions">
      <h2 className="text-xl font-semibold mt-4">You might also like:</h2>
      {similarArtistsData.length > 0 ? (
        <ul className="list-disc list-inside">
          {similarArtistsData.map((artist) => (
            <li key={artist._id}>
              <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading suggestions...</p>
      )}
    </div>
  );
}
