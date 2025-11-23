import type { Meta, StoryObj } from "@storybook/react-vite";
import ExternalLinkList from "./ExternalLinkList";

const meta = {
  title: "Atoms/ExternalLinkList",
  component: ExternalLinkList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ExternalLinkList>;
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
    title: "Social Links",
  },
};

export const Cloud: Story = {
  args: {
    links: defaultLinks,
    containerClasses: "mt-2",
    linkContainerType: "cloud",
    hideLinkTitle: false,
    title: "Social Links",
  },
};
