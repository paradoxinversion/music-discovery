/**
 * A music track/song.
 */
interface ITrack {
  title: string;
  artistId: string;
  albumId: string;
  duration: number;
  isrc: string;
  genre: string;
}

interface IAlbum {
  title: string;
  artistId: string;
  releaseDate: Date;
  genre: string;
}

interface IArtist {
  name: string;
  genre: string;
  biography: string;
}

interface IUser {
  username: string;
  email: string;
  password: string;
  favoriteTracks: string[];
  favoriteAlbums: string[];
  favoriteArtists: string[];
}

interface IUserSignup {
  username: string;
  email: string;
  password: string;
}

export type { ITrack, IAlbum, IArtist, IUser, IUserSignup };
