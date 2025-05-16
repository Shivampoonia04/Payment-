import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Movie, MovieCardProps } from "../../../types/Moviecard";

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isSupervisor,
  cardWidth,
  isXsScreen,
  onCardClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Card
      onClick={() => onCardClick(movie.id, movie.premium)}
      sx={{
        width: cardWidth,
        bgcolor: "#2b2b2b",
        color: "#fff",
        borderRadius: 2,
        overflow: "hidden",
        flexShrink: 0,
        cursor: "pointer",
        position: "relative",
      }}
    >
      {isSupervisor && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEditClick(movie);
            }}
            sx={{
              bgcolor: "rgba(0,0,0,0.7)",
              color: "#fff",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.9)",
                color: "#00bcd4",
              },
              width: isXsScreen ? 28 : 32,
              height: isXsScreen ? 28 : 32,
            }}
          >
            <EditIcon sx={{ fontSize: isXsScreen ? 16 : 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e: React.MouseEvent) => onDeleteClick(e, movie.id)}
            sx={{
              bgcolor: "rgba(0,0,0,0.7)",
              color: "red",
              width: isXsScreen ? 28 : 32,
              height: isXsScreen ? 28 : 32,
            }}
          >
            <DeleteIcon sx={{ fontSize: isXsScreen ? 16 : 18 }} />
          </IconButton>
        </Box>
      )}

      {movie.premium && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1,
            bgcolor: "rgba(0,0,0,0.6)",
            borderRadius: "50%",
            p: 0.8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WorkspacePremiumIcon
            sx={{
              color: "#FFD700",
              fontSize: isXsScreen ? 18 : 24,
            }}
          />
        </Box>
      )}

      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={isXsScreen ? 200 : 250}
          image={
            movie.poster_url ||
            "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title || "Movie poster"}
          sx={{ height: 250, objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            zIndex: 1,
            bgcolor: "rgba(0,0,0,0.6)",
            borderRadius: 1,
            p: 0.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {movie.rating}/10
          </Typography>
          <StarIcon
            sx={{ color: "#FFD700", fontSize: isXsScreen ? 16 : 18, ml: 0.5 }}
          />
        </Box>
      </Box>

      <CardContent>
        <Typography variant="subtitle1" noWrap sx={{ fontWeight: "bold" }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Released Year: {movie.release_year}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Director: {movie.director}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;