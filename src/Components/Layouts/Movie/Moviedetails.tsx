import React, { useState } from "react";
import {
  Typography,
  Button,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
  Container,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { toggleWishList } from "../../../Utils/Api";
import { MovieDetailsProps } from "../../../types/MovieDetails";

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [inWatchlist, setInWatchlist] = useState(movie?.inWatchlist || false);
  const [loading, setLoading] = useState(false);

  const handleToggleWishlist = async () => {
    if (!movie) return;
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      await toggleWishList(movie.id, token);
      setInWatchlist((prev) => !prev);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!movie) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          color: "white",
          minHeight: "80vh",
        }}
      >
        <Typography color="white">No movie data available.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 1, md: 2 }, bgcolor: "black" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 0, sm: 3, md: 4 },
          alignItems: { xs: "center", sm: "flex-start" },
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "0 0 auto", md: "0 0 auto" },
            width: { xs: "100%", sm: "45%", md: "40%" },
            maxWidth: { xs: "100%", sm: "500px", md: "600px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: { xs: 1, sm: 0 },
          }}
        >
          <Box
            component="img"
            src={movie.banner_url }
            alt={movie.title}
            sx={{
              width: "100%",
              height: "auto",
              aspectRatio: "16/9",
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: { sm: "scale(1.02)" },
                boxShadow: { sm: "0 8px 40px rgba(0,0,0,0.2)" },
              },
            }}
          />

          <Box
            sx={{
              width: "100%",
              mt: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "white",
              }}
            >
              Cast
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 1, sm: 1 },
                justifyContent: "center",
              }}
            >
              {["Brad Pitt", "Edward Norton", "Helena Bonham Carter"].map((actor: string, index: number) => (
                <Chip
                  key={index}
                  label={actor}
                  size={isMobile ? "medium" : "medium"}
                  sx={{
                    bgcolor: "#374151",
                    color: "white",
                    mb: 0.3,
                    py: 0.5,
                    px: 0.5,
                    borderRadius: "16px",
                    fontWeight: "medium",
                    "&:hover": { bgcolor: "#4B5563" },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 0%" },
            width: { xs: "100%", sm: "auto" },
            color: "white",
            padding: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h3"}
            fontWeight="bold"
            gutterBottom
            sx={{
              mt: { xs: 1, sm: 0 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {movie.title}
          </Typography>

          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color="gray"
            gutterBottom
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            Directed by: {movie.director || "Unknown"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, sm: 2 },
              mt: 1,
              width: "100%",
              mb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Typography fontWeight="medium">Rating:</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  {movie.rating ? `${movie.rating}/10` : "N/A"}
                </Typography>
                {movie.rating && (
                  <StarIcon sx={{ color: "yellow", fontSize: 18, ml: 0.5 }} />
                )}
              </Box>
            </Box>

            <Typography sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <span style={{ fontWeight: "medium" }}>Genre:</span>{" "}
              {movie.genre || "N/A"}
            </Typography>

            <Typography sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <span style={{ fontWeight: "medium" }}>Year Released:</span>{" "}
              {movie.release_year ? movie.release_year.toString() : "N/A"}
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 1,
              mb: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: { xs: 1.6, sm: 1.7 },
              textAlign: { xs: "center", sm: "left" },
              px: { xs: 2, sm: 0 },
            }}
          >
            {movie.description || "No description available."}
          </Typography>

          <Box
            sx={{
              textAlign: { xs: "center", sm: "left" },
              py: { xs: 0, sm: 0 },
            }}
          >
            <Typography sx={{ fontWeight: "medium" }}>
              Duration:{" "}
              <span style={{ fontWeight: "normal" }}>
                {movie.duration ? `${movie.duration} Min` : "N/A"}
              </span>
            </Typography>
          </Box>
          <Box
            sx={{
              mt: { xs: 1, sm: 1 },
              mb: { xs: 0, sm: 1 },
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Button
              onClick={handleToggleWishlist}
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                fontSize: { xs: "0.7rem", sm: "1rem" },
                px: { xs: 2, sm: 2 },
                py: { xs: 1, sm: 1 },
                bgcolor: inWatchlist ? "#DC2626" : "#2563EB",
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                "&:hover": {
                  bgcolor: inWatchlist ? "#B91C1C" : "#1E40AF",
                },
              }}
            >
              {loading
                ? <CircularProgress size={20} sx={{ color: "white" }} />
                : inWatchlist
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MovieDetails;