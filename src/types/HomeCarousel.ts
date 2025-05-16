export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  release_year: number
  director: string;
  description?: string;
  poster_url?: string;
  banner_url?: string;
  duration?: number;
  premium?: boolean;
}

export interface HomeCarouselProps {
  genre: string;
  movies: Movie[] ;
  onMovieDelete?: (movieId: number) => void;
}
