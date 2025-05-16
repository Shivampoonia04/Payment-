export interface Movie {
  id?: number;
  title: string;
  genre: string;
  rating: number | string;
  poster_url: string | File;
  banner_url: string | File;
  release_year: number;
  director: string;
  description: string;
}

export const genres: string[] = [
  "Action",
  "Romance",
  "Thriller",
  "Drama",
  "Comedy",
  "Sci-Fi",
  "Horror",
];
