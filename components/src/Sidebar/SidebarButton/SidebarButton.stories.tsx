import type { Meta, StoryObj } from "@storybook/react-vite";
import SidebarButton from "./SidebarButton";

const meta = {
  title: "Atoms/SidebarButton",
  component: SidebarButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof SidebarButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { label: "Sidebar Button", textAlign: "center" },
};
