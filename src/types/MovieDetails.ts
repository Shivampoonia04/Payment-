export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  release_year: number | string;
  director: string;
  description?: string;
  poster_url?: string;
  banner_url?: string;
  duration?: number;
  premium?: boolean;
  inWatchlist?: boolean;
}

export interface MovieDetailsProps {
  movie: Movie | null;
}