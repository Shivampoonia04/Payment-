import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Card,
  CardMedia,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import { Movie, MainCarouselProps } from '../../../types/MainCarousel';

const MainCarousel: React.FC<MainCarouselProps> = ({ movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const nextSlide = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleMovieDetailsClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const prevSlide = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  if (movies.length === 0) {
    return (
      <Box textAlign="center" color="white" mt={2} mb={2} fontSize="1.5rem">
        No movies available.
      </Box>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "auto", sm: "100vh", md: "90vh" },
        minHeight: { xs: "100vh", sm: "100vh" },
        overflow: "hidden",
        bgcolor: "black",
        color: "white",
        // m:"auto"
        // mt:"10px",
        // ml:"6px",
        // mr:"6px"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${currentMovie.banner_url})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 2,
          zIndex: 1,
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%)",
          },
        }}
      />

      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          py: { xs: 4, sm: 5, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          flex={1}
          pr={{ xs: 0, md: 4 }}
          textAlign={{ xs: "center", md: "left" }}
          mt={{ xs: 8, md: 0 }}
        >
          <Typography
            variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              lineHeight: 1.2,
              mb: { xs: 1, md: 2 },
            }}
          >
            {currentMovie.title}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            mt={2}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Typography variant="body1">Genre: {currentMovie.genre}</Typography>
            <Typography variant="body1">
              Year: {currentMovie.release_year}
            </Typography>
            <Typography variant="body1">
              Rating: {currentMovie.rating}/10{" "}
              <StarIcon sx={{ color: "#FFD700", fontSize: 18, ml: 0.5 }} />
            </Typography>
          </Stack>

          <Typography
            mt={2}
            variant="body2"
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              maxWidth: { xs: "100%", md: "80%" },
              mx: { xs: "auto", md: 0 },
            }}
          >
            {currentMovie.description || "No description available."}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            mt={4}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<InfoIcon />}
              sx={{
                fontSize: { xs: 1, md: 3 },
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.5 },
              }}
              onClick={() => handleMovieDetailsClick(currentMovie.id)}
            >
              More Info
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.5 },
              }}
            >
              + WishList
            </Button>
          </Stack>
        </Box>

        <Card
          sx={{
            width: { xs: "85%", sm: "60%", md: 300 },
            height: { xs: "auto", sm: "80%", md: "100%" },
            mt: { xs: 4, md: 0 },
            mb: { xs: 4, md: 0 },
            boxShadow: 6,
          }}
        >
          <CardMedia
            component="img"
            image={currentMovie.banner_url}
            alt={currentMovie.title}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Card>
      </Container>

      <IconButton
        onClick={prevSlide}
        aria-label="previous-slide"
        sx={{
          position: "absolute",
          left: { xs: 5, md: 20 },
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          zIndex: 3,
          bgcolor: "rgba(0,0,0,0.5)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ArrowBackIosNewIcon fontSize={isMobile ? "medium" : "large"} />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        aria-label="next-slide"
        sx={{
          position: "absolute",
          right: { xs: 5, md: 20 },
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          zIndex: 3,
          bgcolor: "rgba(0,0,0,0.5)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ArrowForwardIosIcon fontSize={isMobile ? "medium" : "large"} />
      </IconButton>

      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "center",
          position: "absolute",
          bottom: 70,
          width: "100%",
          zIndex: 3,
          gap: 1,
          py: 1,
        }}
      >
        {movies.map((_: Movie, idx: number) => (
          <Box
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            data-testid={`pagination-dot-${idx}`}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: idx === currentIndex ? "primary.main" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
          p: { xs: 1, sm: 2 },
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 2,
        }}
      >
        {["NETFLIX", "DISNEY+", "prime video", "Vidio", "Apple TV+", "viu"].map(
          (service: string) => (
            <Box
              key={service}
              sx={{
                backgroundColor: "#333",
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 },
                borderRadius: 1,
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              }}
            >
              {service}
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default MainCarousel;