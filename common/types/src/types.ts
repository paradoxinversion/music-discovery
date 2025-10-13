/**
 * Common types for the music streaming service.
 */
type CommonLinkKeyMusic =
  | "soundcloud"
  | "spotify"
  | "youtube"
  | "appleMusic"
  | "bandcamp";

/**
 * Common social media and website links.
 */
type CommonLinkKeySocial =
  | "facebook"
  | "instagram"
  | "twitterX"
  | "tiktok"
  | "website"
  | "bluesky";

/**
 * A music track/song.
 */
interface ITrack {
  title: string;
  artistId: string;
  albumId: string;
  duration?: number;
  isrc?: string;
  genre: string;
  managingUserId: string;
  links?: {
    [key in CommonLinkKeyMusic]?: string;
  };
}

type TrackSubmissionData = Pick<
  ITrack,
  "title" | "genre" | "artistId" | "isrc"
>;

type EditableTrack = Partial<
  Pick<ITrack, "title" | "genre" | "isrc" | "links">
>;

/**
 * A music album.
 */
interface IAlbum {
  title: string;
  artistId: string;
  releaseDate: Date;
  genre: string;
  managingUserId: string;
  links?: {
    [key in CommonLinkKeyMusic]?: string;
  };
}

type EditableAlbum = Partial<Omit<IAlbum, "artistId">>;

/**
 * A music artist/band.
 */
interface IArtist {
  name: string;
  genre: string;
  biography: string;
  /**
   * ID of the user managing this artist's profile.
   */
  managingUserId: string;
  links?: {
    [key in CommonLinkKeySocial]?: string;
  };
  albums?: string[];
  tracks?: string[];
}

type EditableArtist = Partial<Omit<IArtist, "managingUserId">>;

/**
 * A user of the service.
 */
interface IUser {
  username: string;
  email: string;
  password: string;
  favoriteTracks: string[];
  favoriteAlbums: string[];
  favoriteArtists: string[];
}

/**
 * Data required for user signup.
 */
interface IUserSignup {
  username: string;
  email: string;
  password: string;
}

export type {
  ITrack,
  IAlbum,
  IArtist,
  IUser,
  IUserSignup,
  CommonLinkKeyMusic,
  CommonLinkKeySocial,
  EditableArtist,
  EditableAlbum,
  TrackSubmissionData,
  EditableTrack,
};
