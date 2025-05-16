import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { MovieCardProps } from "../../../types/MainMovieCard";

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  userRole,
  onCardClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Box
      onClick={() => onCardClick(movie.id, movie.premium)}
      sx={{
        position: "relative",
        width: { xs: "100%", sm: "45%", md: "30%", lg: "18%" },
        height: { xs: "90vh",sm:"50vh", md: "60vh" },
        bgcolor: "#2b2b2b",
        color: "#fff",
        cursor: "pointer",
        overflow: "hidden",
        border: "none",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      {movie.premium && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "50%",
            padding: "1px",
          }}
        >
          <WorkspacePremiumIcon sx={{ color: "gold" }} />
        </Box>
      )}

      {userRole === "supervisor" && (
        <>
          <IconButton
            sx={{
              width: "2rem",
              height: "2rem",
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(movie);
            }}
          >
            <EditIcon sx={{ fontSize: "xl", color: "white" }} />
          </IconButton>
          <IconButton
            sx={{
              width: "2rem",
              height: "2rem",
              position: "absolute",
              top: 8,
              right: 45,
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(movie.id);
            }}
          >
            <DeleteIcon sx={{ fontSize: "xl", color: "red" }} />
          </IconButton>
        </>
      )}

      <Card
        sx={{
          boxShadow: "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ position: "relative", height:{xs:"75%" ,sm:"70%" }}}>
          <CardMedia
            component="img"
            image={movie.banner_url || movie.poster_url}
            alt={movie.title}
            sx={{ height: "100%", objectFit: {xs:"fit",sm:"cover"} }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
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
              sx={{ color: "yellow", fontSize: 18, ml: 0.5 }}
            />
          </Box>
        </Box>
        <CardContent
          sx={{
            color: "white",
            backgroundColor: "black",
            height: "40%",
            py: 0.4,
            px: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle1" noWrap fontWeight="bold">
            {movie.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.1 }}>
            Year: {movie.release_year}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.1 }}>
            Director: {movie.director}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MovieCard;