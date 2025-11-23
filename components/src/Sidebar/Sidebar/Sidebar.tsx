import SidebarButton from "../SidebarButton/SidebarButton";
import SidebarSection from "../SidebarSection/SidebarSection";

export interface SidebarProps {
  favoriteTracks: any[];
  favoriteArtists: any[];
  onArtistClick: (slug: string) => void;
  onTrackClick: (artistSlug: string, trackSlug: string) => void;
  buttonTextAlign?: "left" | "center" | "right";
}

const Sidebar = ({
  favoriteTracks,
  favoriteArtists,
  onArtistClick,
  onTrackClick,
  buttonTextAlign = "left",
}: SidebarProps) => {
  return (
    <div className="w-full md:min-w-64 md:w-64 md:block space-y-6 overflow-y-auto">
      <SidebarSection title="Favorite Artists">
        {favoriteArtists.map((artist) => (
          <SidebarButton
            textAlign={buttonTextAlign}
            key={artist._id}
            label={artist.name}
            onClick={() => onArtistClick(artist.slug)}
          />
        ))}
      </SidebarSection>
      <SidebarSection title="Favorite Tracks">
        {favoriteTracks.map((track) => (
          <SidebarButton
            textAlign={buttonTextAlign}
            key={track._id}
            label={track.title}
            onClick={() => onTrackClick(track.artistSlug, track.slug)}
          />
        ))}
      </SidebarSection>
    </div>
  );
};

export default Sidebar;
