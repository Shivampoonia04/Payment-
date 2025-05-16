import React, { useState, useEffect } from "react";
import MainCarousel from "./MainCarousel";
import HomeCarousel from "./HomeCarousel";
import { fetchMovies, fetchMoviesAll } from "../../../Utils/Api";
import { Box, CircularProgress } from "@mui/material";
import { Movie, MoviesResponse } from '../../../types/MainCarousel';


const MovieContainer = () => {
  const [mainMovies, setMainMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const mainData: Movie[] = await fetchMovies();

        let allMovies: Movie[] = [];
        let page = 1;
        let totalPages = Infinity;
        while (allMovies.length < 20 && page <= totalPages) {
          const { movies, pagination }: MoviesResponse = await fetchMoviesAll(page);
          allMovies = [...allMovies, ...movies];
          totalPages = pagination.totalPages;
          page++;
        }

        const topRated = allMovies
          .filter((movie) => movie.rating >= 8)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);

        const latest = allMovies
          .filter((movie) => Number(movie.release_year) >= 2016)
          .sort((a, b) => Number(b.release_year) - Number(a.release_year))
          .slice(0, 10);

        setMainMovies(mainData);
        setTopRatedMovies(topRated);
        setLatestMovies(latest);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          bgcolor: "black",
          color: "white",
          mt:"3px"
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <>
      <MainCarousel movies={mainMovies} />
      <HomeCarousel genre="Top Rated" movies={topRatedMovies} />
      <HomeCarousel genre="Latest Released" movies={latestMovies} />
    </>
  );
};

export default MovieContainer;