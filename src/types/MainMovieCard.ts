export interface Movie {
  id: number;
  title: string;
  banner_url?: string;
  poster_url?: string;
  rating: number;
  release_year: number;
  director: string;
  premium: boolean;
}

export interface MovieCardProps {
  movie: Movie;
  userRole: string;
  onCardClick: (movieId: number,premium:boolean) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movieId: number) => void;
}