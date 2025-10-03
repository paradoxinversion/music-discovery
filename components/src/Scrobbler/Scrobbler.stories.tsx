import type { Meta } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Scrobbler } from "./Scrobbler";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
// export default {
//   title: "Atoms/Scrobbler",
//   component: Scrobbler,
//   parameters: {
//     // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
//     layout: "",
//   },
//   // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
//   tags: ["autodocs"],
//   // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
//   args: {},
// };
const meta = {
  title: "Atoms/Scrobbler",
  component: Scrobbler,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Scrobbler>;
export default meta;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {},
};
