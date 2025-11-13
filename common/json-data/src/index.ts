import socialPlatformLinks from "./socialPlatformLinks.json";
import musicPlatformLinks from "./musicPlatformLinks.json";
export type SocialPlatformLinks = keyof typeof socialPlatformLinks;
export type MusicPlatformLinks = keyof typeof musicPlatformLinks;
export { socialPlatformLinks, musicPlatformLinks };
