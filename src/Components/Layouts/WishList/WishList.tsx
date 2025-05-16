import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Card,
  IconButton,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { getWishlistMovies, toggleWishList } from "../../../Utils/Api";
import { Movie } from "../../../types/WishList";
import { toast } from "react-toastify";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4361ee",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#000000",
      paper: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
});

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getWishlistMovies();
        const movieData = response.movies || response;
        setMovies(movieData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load movies");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = async (movieId: number) => {
    let token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await toggleWishList(movieId, token);
      toast.success("Movie removed form WishList");
      setMovies(movies.filter((currMovie) => currMovie.id !== movieId));
      console.log("Wishlist toggled:", response);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="40vh"
          bgcolor="#000000"
        >
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="40vh"
          bgcolor="#000000"
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: "#000000", minHeight: "40vh", pb: 2 }}>
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ bgcolor: "#000000" }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              aria-label="back"
              sx={{ mr: 1, color: "white" }}
              onClick={() => navigate("/")}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "white" }}
            >
              WatchList
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ mt: 2 }}>
          {movies.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="30vh"
            >
              <Typography color="white">
                Your wishlist is empty
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {movies.map((movie) => (
                <Card
                  key={movie.id}
                  sx={{
                    display: "flex",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    bgcolor: "#000000",
                    border: "1px solid #333",
                  }}
                >
                  <Box
                    sx={{
                      width: "35%",
                      height: "150px",
                      position: "relative",
                    }}
                  >
                    <Box
                      component="img"
                      src={movie.poster_url}
                      alt={movie.title}
                      sx={{
                        margin: "auto",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px 0 0 12px",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      width: "65%",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#6a8cff",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        fontSize: "0.7rem",
                      }}
                    >
                      {movie.genre.toUpperCase()}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        lineHeight: 1.2,
                        mt: 0.5,
                        color: "white",
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Box
                      sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.75rem",
                        }}
                      >
                        {movie.director}, {movie.release_year}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: "bold",
                          color: "#e0e0e0",
                        }}
                      >
                        {movie.duration} Min
                      </Typography>
                    </Box>

                    {movie.premium && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 13,
                          right: 40,
                          bgcolor: "rgba(218, 165, 32, 0.9)",
                          color: "white",
                          fontSize: "0.6rem",
                          py: 0.2,
                          px: 0.8,
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        PREMIUM
                      </Box>
                    )}

                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#888",
                        p: 0.5,
                      }}
                      
                      aria-label="delete"
                      onClick={() => handleDeleteClick(movie.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default WishlistPage;