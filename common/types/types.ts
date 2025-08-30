/**
 * A music track/song.
 */
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  isrc: string;
  genre: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  genre: string;
  trackCount: number;
}

interface Artist {
  id: string;
  name: string;
  genre: string;
  biography: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  favoriteTracks: Track[];
  favoriteAlbums: Album[];
  favoriteArtists: Artist[];
}

export { Track, Album, Artist, User };
