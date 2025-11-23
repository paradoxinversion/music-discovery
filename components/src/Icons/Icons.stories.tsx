import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./Icons";

const meta = {
  title: "Atoms/Icons",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    size: "medium",
    icon: "Apple Music",
  },
};
