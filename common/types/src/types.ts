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
  trackArt?: string;
  links?: {
    [key in CommonLinkKeyMusic]?: string;
  };
}

type TrackSubmissionData = Pick<
  ITrack,
  "title" | "genre" | "artistId" | "isrc" | "trackArt" | "links"
>;

type EditableTrack = Partial<
  Pick<ITrack, "title" | "genre" | "isrc" | "links" | "trackArt">
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
  /** The artist's name. Must be unique. */
  name: string;
  /** A URL-friendly version of the artist's name. Must be unique. */
  slug: string;
  /** The artist's primary genre. */
  genre: string;
  /** A brief biography of the artist. */
  biography: string;
  /**
   * ID of the user managing this artist's profile.
   */
  managingUserId: string;
  /** A map of social and music platform links. */
  links?: {
    [key in CommonLinkKeySocial]?: string;
  };
  /** List of album IDs associated with the artist. */
  albums?: string[];
  /** List of track IDs associated with the artist. */
  tracks?: string[];
  /** S3 location to the artist's artwork/image. */
  artistArt?: string | null;
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
