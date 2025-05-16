import { MouseEvent } from "react";

export interface Movie {
  id: number;
  title: string;
  poster_url?: string;
  rating: number;
  release_year: number;
  director: string;
  premium: boolean;
}


export interface MovieCardProps {
  movie: Movie;
  isSupervisor: boolean;
  cardWidth: number;
  isXsScreen: boolean;
  onCardClick: (movieId: number,premium:boolean) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (e: MouseEvent, movieId: number) => void;
}