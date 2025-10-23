import type { Meta, StoryObj } from "@storybook/react-vite";
import ImgContainer from "./ImgContainer";

const meta = {
  title: "Atoms/ImgContainer",
  component: ImgContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ImgContainer>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    src: "https://picsum.photos/512/512?random=1",
    alt: "Placeholder Image",
    className: "my-4 h-64 object-cover rounded-lg",
  },
};

export const NoImage: Story = {
  args: {
    className: "my-4 h-64 object-cover rounded-lg",
  },
};
