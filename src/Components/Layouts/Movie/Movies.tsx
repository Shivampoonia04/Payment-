import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Pagination,
  MenuItem,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom"; // Add useSearchParams
import { fetchMoviesAlll, deleteMovie } from "../../../Utils/Api";
import { MoviesProps } from "../../../types/Movies";
import { toast } from "react-toastify";
import MovieCard from "./MovieCard";

const genreFilters = [
  "All",
  "Romance",
  "Action",
  "Thriller",
  "Drama",
  "Comedy",
  "Si-Fi",
  "Horror",
];

const Movies: React.FC<MoviesProps> = ({ onMovieDelete }) => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Hook to manage query params

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.user?.role || "");
  }, []);

  // Initialize currentPage from URL query parameter on mount
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl >= 1) {
      setCurrentPage(pageFromUrl);
    }
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const genreQuery = selectedGenre === "All" ? "" : selectedGenre;
        const ratingQuery = rating === "All" || rating === "" ? "" : rating;

        const response = await fetchMoviesAlll(
          currentPage,
          genreQuery,
          searchTerm,
          ratingQuery
        );

        if (response?.movies && Array.isArray(response.movies)) {
          setMovies(response.movies);
          setTotalPages(response.meta?.total_pages || 1);
        } else {
          setMovies([]);
          setTotalPages(1);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies.");
        setLoading(false);
      }
    };
    fetchMovies();

    // Update URL with current page
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, selectedGenre, searchTerm, rating, setSearchParams]);

  const handleCardClick = (movieId: number, premium: boolean) => {
    const planType = localStorage.getItem("plan");
    if (premium) {
      if (planType !== "3-months") {
        toast.info("This is a premium movie. Please upgrade your plan.");
        navigate(`/subscription`);
        return;
      }
    }

    navigate(`/movie/${movieId}`);
  };

  const handlePageChange = (event: any, newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditClick = (movie: MoviesProps) => {
    navigate("/admin", { state: { movieId: movie.id, movie } });
  };

  const handleDeleteClick = async (movieId: number) => {
    try {
      await deleteMovie(movieId);
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
      toast.success("Movie Deleted Successfully");
      if (onMovieDelete) {
        onMovieDelete(movieId);
      }
    } catch (error) {
      setError("Failed to delete movie.");
    }
  };

  const selectStyles = {
    minWidth: 120,
    backgroundColor: "black",
    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "gray",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
  };

  return (
    <Box sx={{ px: 2, py: 2, backgroundColor: "black" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
          mb: 3,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <TextField
            select
            label="Genre"
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            SelectProps={{
              native: false,
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                },
              },
            }}
            sx={selectStyles}
          >
            {genreFilters.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Rating"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            SelectProps={{
              native: false,
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                },
              },
            }}
            sx={selectStyles}
          >
            <MenuItem key="All" value="All">
              All
            </MenuItem>
            {[...Array(5)].map((_, i) => {
              const rate = 9 - i;
              return (
                <MenuItem key={rate} value={rate}>
                  {rate}+
                </MenuItem>
              );
            })}
          </TextField>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          size="small"
          sx={{
            minWidth: "200px",
            maxWidth: "300px",
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "#1e1e1e",
              "& fieldset": { borderColor: "gray" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />
      </Box>

      <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
        Explore
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
          {error}
        </Typography>
      ) : !movies || movies.length === 0 ? (
        <Typography
          color="white"
          sx={{ textAlign: "center", mt: 1, mb: 1, fontSize: "1.2rem" }}
        >
          No Movies Found
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              userRole={userRole}
              onCardClick={handleCardClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
            },
            "& .MuiPaginationItem-previousNext": {
              color: "white",
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "white",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Movies;