import type { Meta, StoryObj } from "@storybook/react-vite";
import ArtistExternalLinks from "./ArtistExternalLinks";

const meta = {
  title: "Atoms/ArtistExternalLinks",
  component: ArtistExternalLinks,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ArtistExternalLinks>;
export default meta;
type Story = StoryObj<typeof meta>;

const defaultLinks = {
  Facebook: "https://www.facebook.com/artist",
  Instagram: "https://www.instagram.com/artist",
  Twitter: "https://www.twitter.com/artist",
  YouTube: "https://www.youtube.com/artist",
  Spotify: "https://open.spotify.com/artist/artist",
  "Apple Music": "https://music.apple.com/artist/artist",
  Tidal: "https://tidal.com/artist/artist",
  Bandcamp: "https://bandcamp.com/artist/artist",
  SoundCloud: "https://soundcloud.com/artist/artist",
};

export const List: Story = {
  args: {
    links: defaultLinks,
    containerClasses: "mt-2",
    linkContainerType: "list",
  },
};

export const Cloud: Story = {
  args: {
    links: defaultLinks,
    containerClasses: "mt-2",
    linkContainerType: "cloud",
    hideLinkTitle: false,
  },
};
