import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { PlayIcon } from "@heroicons/react/24/outline";
import { IconButton } from "./IconButton";

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    icon: <PlayIcon className="size-6" />,
    onClick: fn(),
  },
};
