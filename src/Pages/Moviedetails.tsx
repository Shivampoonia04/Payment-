import React, { useState, useEffect } from "react";
import MovieDetails from "../Components/Layouts/Movie/Moviedetails";
import HomeCarousel from "../Components/Layouts/Home/HomeCarousel";
import { fetchMovieDetails, fetchMoviesAll } from "../Utils/Api";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

interface Movie {
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
}

const Moviedetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (!movieId) {
          setErrorMessage("Movie ID is missing from the URL.");
          setLoading(false);
          return;
        }

        setLoading(true);
        const movieData: Movie = await fetchMovieDetails(Number(movieId));

        let allMovies: Movie[] = [];
        let page = 1;
        let totalPages = Infinity;

        while (allMovies.length < 10 && page <= totalPages) {
          const {
            movies,
            pagination,
          }: { movies: Movie[]; pagination: { totalPages: number } } =
            await fetchMoviesAll(page);

          allMovies = [...allMovies, ...movies];
          totalPages = pagination.totalPages;
          page++;
        }

        const genres =
          movieData.genre
            ?.toLowerCase()
            .split(",")
            .map((g) => g.trim()) || [];

        const filtered = allMovies
          .filter((movie) =>
            genres.some((g) => movie.genre.toLowerCase().includes(g))
          )
          .slice(0, 10);

        setMovie(movieData);
        setRelatedMovies(filtered);
      } catch (error) {
        setErrorMessage("No Movies");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [movieId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
          bgcolor: "black",
          color: "white",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (errorMessage || !movie) {
    return (
      <Box
        sx={{
          bgcolor: "black",
          color: "white",
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography variant="h6">{errorMessage || "Movie not found."}</Typography>
      </Box>
    );
  }

  return (
    <>
      <MovieDetails movie={movie} />
      <HomeCarousel genre="Related Movies" movies={relatedMovies} />
    </>
  );
};

export default Moviedetails;
