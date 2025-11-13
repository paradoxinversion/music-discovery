import { IArtist } from "@common/types/src/types";
import Link from "next/link";

interface SimilarArtistsProps {
  similarArtistsData?: IArtist[];
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
            <li key={`similar-artist-${artist.slug}`}>
              <Link href={`/artists/${artist.slug}`}>{artist.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No similar artists found (yet)</p>
      )}
    </div>
  );
}
