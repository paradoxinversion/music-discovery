import { IArtist } from "@common/types/src/types";
import { SidebarButton } from "@mda/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  if (isSimilarArtistsLoading) {
    return <div>Loading...</div>;
  }
  if (similarArtistsError) {
    return <div>Error: {similarArtistsError.message}</div>;
  }
  return (
    <div id="suggestions">
      <h2 className="text-xl font-semibold mt-4">You might also like</h2>
      {similarArtistsData.length > 0 ? (
        <div className="list-disc list-inside">
          {similarArtistsData.map((artist) => (
            <SidebarButton
              label={artist.name}
              key={artist.slug}
              textAlign="left"
              onClick={() => router.push(`/artists/${artist.slug}`)}
            />
          ))}
        </div>
      ) : (
        <p>No similar artists found (yet)</p>
      )}
    </div>
  );
}
