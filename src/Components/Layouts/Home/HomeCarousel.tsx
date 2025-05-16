import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { deleteMovie } from "../../../Utils/Api";
import MovieCard from "./MovieCard";
import { Movie, HomeCarouselProps } from "../../../types/HomeCarousel";
import { toast } from "react-toastify";

const HomeCarousel: React.FC<HomeCarouselProps> = ({
  genre,
  movies,
  onMovieDelete,
}) => {
  const [scrollX, setScrollX] = useState<number>(0);
  const [maxScroll, setMaxScroll] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [isSupervisor, setIsSupervisor] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsSupervisor(user.user?.role === "supervisor");
  }, []);

  const getCardWidth = (): number => {
    if (isXsScreen) return 150;
    if (isSmScreen) return 180;
    if (isMdScreen) return 200;
    return 220;
  };

  const CARD_WIDTH: number = getCardWidth();
  const CARD_GAP: number = isXsScreen ? 8 : 16;
  const SCROLL_AMOUNT: number = CARD_WIDTH + CARD_GAP;

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalWidth = movies.length * (getCardWidth() + CARD_GAP);
        const scrollableWidth = totalWidth - containerWidth;
        setMaxScroll(scrollableWidth > 0 ? scrollableWidth : 0);
      }
    };

    updateMaxScroll();
    setScrollX(0);

    const handleResize = () => {
      updateMaxScroll();
      setScrollX((prev) => Math.min(prev, maxScroll));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [movies.length, isXsScreen, maxScroll]);

  const handleScrollLeft = () => {
    setScrollX((prev) => Math.max(prev - SCROLL_AMOUNT, 0));
  };

  const handleScrollRight = () => {
    setScrollX((prev) => Math.min(prev + SCROLL_AMOUNT, maxScroll));
  };

  useEffect(() => {
    if (!isXsScreen && containerRef.current) {
      containerRef.current.scrollTo({ left: scrollX, behavior: "smooth" });
    }
  }, [scrollX, isXsScreen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const threshold = 100;
    if (touchStart - touchEnd > threshold) handleScrollRight();
    if (touchStart - touchEnd < -threshold) handleScrollLeft();
  };

  const handleCardClick = (movieId: number, premium: boolean) => {
    const planType = localStorage.getItem("plan");
    if (premium && planType !== "3-months") {
      toast.info("This is a premium movie. Please upgrade your plan.");
      navigate("/subscription");
    } else {
      navigate(`/movie/${movieId}`);
    }
  };

  const handleEditClick = (movie: Movie) => {
    navigate("/admin", { state: { movieId: movie.id, movie } });
  };

  const handleDeleteMovie = async (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await deleteMovie(movieId);
        if (onMovieDelete) {
          onMovieDelete(movieId);
        }
      } catch (error) {
        console.error("Failed to delete movie:", error);
        alert("Failed to delete the movie. Please try again.");
      }
    }
  };

  const isAtStart = scrollX <= 0;
  const isAtEnd = scrollX >= maxScroll - 15;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        py: { xs: 2, sm: 3, md: 1 },
        bgcolor: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4, md: 6 },
          mb: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          {genre}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#00bcd4",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "underline",
            "&:hover": { color: "#03a9f4" },
          }}
          onClick={() => navigate(`/movies`)}
        >
          See All
        </Typography>
      </Box>

      {movies.length === 0 ? (
        <Typography
          color="white"
          align="center"
          sx={{ py: { xs: 3, md: 6 }, px: 2 }}
        >
          No movies found for {genre}.
        </Typography>
      ) : (
        <Box sx={{ position: "relative" }}>
          {!isXsScreen && (
            <IconButton
              onClick={handleScrollLeft}
              disabled={isAtStart}
              sx={{
                position: "absolute",
                top: "50%",
                left: { xs: 0, sm: 10 },
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "#fff",
                opacity: isAtStart ? 0.5 : 1,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
              size={isSmScreen ? "small" : "medium"}
            >
              <ArrowBackIosNewIcon fontSize={isSmScreen ? "small" : "medium"} />
            </IconButton>
          )}

          <Box
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{
              display: "flex",
              gap: `${CARD_GAP}px`,
              pl: { xs: 2, sm: 4, md: 6 },
              pr: { xs: 2, sm: 0 },
              overflowX: isXsScreen ? "auto" : "hidden",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              pb: 1,
            }}
          >
            {movies.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isSupervisor={isSupervisor}
                cardWidth={CARD_WIDTH}
                isXsScreen={isXsScreen}
                onCardClick={handleCardClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteMovie}
              />
            ))}
          </Box>

          {!isXsScreen && (
            <IconButton
              onClick={handleScrollRight}
              disabled={isAtEnd}
              sx={{
                position: "absolute",
                top: "50%",
                right: { xs: 0, sm: 10 },
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "#fff",
                opacity: isAtEnd ? 0.5 : 1,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
              size={isSmScreen ? "small" : "medium"}
            >
              <ArrowForwardIosIcon fontSize={isSmScreen ? "small" : "medium"} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HomeCarousel;