import type { Meta, StoryObj } from "@storybook/react-vite";
import Sidebar from "./Sidebar";
import SidebarButton from "../SidebarButton/SidebarButton";

const meta = {
  title: "Atoms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    favoriteArtists: [
      { name: "Artist 1" },
      { name: "Artist 2" },
      { name: "Artist 3" },
    ],
    favoriteTracks: [
      { title: "Track 1" },
      { title: "Track 2" },
      { title: "Track 3" },
    ],
    onArtistClick: (slug: string) => {
      console.log("Artist clicked:", slug);
    },
    onTrackClick: (artistSlug: string, trackSlug: string) => {
      console.log("Track clicked:", artistSlug, trackSlug);
    },
  },
};
