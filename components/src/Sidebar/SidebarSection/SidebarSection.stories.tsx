import type { Meta, StoryObj } from "@storybook/react-vite";
import SidebarSection from "./SidebarSection";
import SidebarButton from "../SidebarButton/SidebarButton";
import React from "react";

const meta = {
  title: "Atoms/SidebarSection",
  component: SidebarSection,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof SidebarSection>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: "Sidebar Section",
    children: (
      <React.Fragment>
        <SidebarButton label="Sidebar Button" />{" "}
        <SidebarButton label="Another Button" />
      </React.Fragment>
    ),
  },
};
