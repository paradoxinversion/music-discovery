import { SidebarButton } from "@mda/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  if (isOtherArtistsLoading) {
    return <div>Loading...</div>;
  }
  if (otherArtistsError) {
    return <div>Error: {otherArtistsError.message}</div>;
  }
  return (
    <div id="other-suggestions">
      <h2 className="text-xl font-semibold mt-4">Other Artists</h2>
      {otherArtistsData && otherArtistsData.length > 0 && (
        <ul className="list-disc list-inside">
          {otherArtistsData.map((artist) => (
            <SidebarButton
              label={artist.name}
              key={`other-artist-${artist.slug}`}
              textAlign="left"
              onClick={() => router.push(`/artists/${artist.slug}`)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
