import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PlayIcon } from "./Icons";

const meta = {
  title: "Atoms/Icons",
  component: PlayIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof PlayIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    size: "medium",
  },
};
