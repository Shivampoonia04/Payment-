export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  description: string;
  poster_url?: string;
  banner_url?: string;
  release_year: number;
  director: string;
  premium?: boolean;
}

export interface MoviesProps {
  onMovieDelete?: (movieId: number) => void;
}