import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { addMovie, updateMovie } from "../../Utils/Api";
import { Movie, genres } from "../../types/AdminPanel";
import { toast } from "react-toastify";

const AdminPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, movie } = location.state || {};

  const [formData, setFormData] = useState<Movie>({
    id: undefined,
    title: "",
    genre: "",
    rating: "",
    poster_url: "",
    banner_url: "",
    release_year: new Date().getFullYear(),
    director: "",
    description: "",
  });

  const [preview, setPreview] = useState<{
    poster_url?: string;
    banner_url?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Movie, string>>>(
    {}
  );

  const isEditMode = !!movieId;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (isEditMode && movie) {
      setFormData({
        id: movie.id,
        title: movie.title || "",
        genre: movie.genre || "",
        rating: movie.rating || "",
        poster_url: movie.poster_url || "",
        banner_url: movie.banner_url || "",
        release_year: movie.release_year || new Date().getFullYear(),
        director: movie.director || "",
        description: movie.description || "",
      });

      setPreview({
        poster_url:
          typeof movie.poster_url === "string" ? movie.poster_url : "",
        banner_url:
          typeof movie.banner_url === "string" ? movie.banner_url : "",
      });
    }
  }, [isEditMode, movie, movieId]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Movie, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.genre) {
      newErrors.genre = "Genre is required";
    }

    if (!formData.rating) {
      newErrors.rating = "Rating is required";
    } else {
      const ratingNum = Number(formData.rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
        newErrors.rating = "Rating must be between 1 and 10";
      }
    }

    if (!formData.release_year) {
      newErrors.release_year = "Release year is required";
    } else if (
      formData.release_year < 1900 ||
      formData.release_year > currentYear
    ) {
      newErrors.release_year = `Year must be between 1900 and ${currentYear}`;
    }

    if (!formData.director.trim()) {
      newErrors.director = "Director is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating" || name === "release_year" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "poster_url" | "banner_url"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreview((prev) => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("genre", formData.genre);
      data.append("rating", formData.rating.toString());
      data.append("release_year", formData.release_year.toString());
      data.append("director", formData.director);
      data.append("description", formData.description);

      if (formData.poster_url instanceof File) {
        data.append("poster", formData.poster_url);
      }

      if (formData.banner_url instanceof File) {
        data.append("banner", formData.banner_url);
      }

      if (isEditMode && formData.id !== undefined) {
        await updateMovie(formData.id, data);
      } else {
        await addMovie(data);
        toast.success("Movie Added Successfully");
      }

      setTimeout(() => navigate("/movies"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    input: { color: "white" },
    textarea: { color: "#fff" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "gray" },
      "&:hover fieldset": { borderColor: "#fff" },
    },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
  };

  return (
    <Container
      maxWidth={isMobile ? "sm" : "md"}
      sx={{ mt: 3,mb:4, py: 0, backgroundColor: "black" }}
    >
      <Paper
        elevation={3}
        sx={{ p: 1, backgroundColor: "black", color: "#fff" ,
          boxShadow:"0px 4px 8px white"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            width: "100%",
          }}
        >
          <IconButton
            onClick={() => navigate("/movies")}
            sx={{ color: "#fff", mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Typography variant="h5">
              {isEditMode ? "Edit Movie" : "Add New Movie"}
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyle}
          />
          {errors.title && (
            <Typography color="error" variant="caption">
              {errors.title}
            </Typography>
          )}

          <Box>
            <label
              htmlFor="genre"
              style={{ color: "#ccc", display: "block", marginBottom: 4 }}
            >
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "black",
                color: "#fff",
                border: "1px solid gray",
              }}
            >
              <option value="">Select Genre</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Box>
          {errors.genre && (
            <Typography color="error" variant="caption">
              {errors.genre}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: isMobile ? "none" : 2, width: isMobile ? "100%" : "auto" }}>
              <TextField
                name="rating"
                label="Rating (1-10)"
                type="number"
                value={formData.rating}
                  inputProps={{ min: 1, max: 10, step: 0.1 }}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
              />
              {errors.rating && (
                <Typography color="error" variant="caption">
                  {errors.rating}
                </Typography>
              )}
            </Box>

            <Box sx={{ flex: isMobile ? "none" : 1, width: isMobile ? "100%" : "auto" }}>
              <TextField
                name="release_year"
                label="Release Year"
                type="number"
                value={formData.release_year}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
                inputProps={{ min: 1900, max: currentYear }}
              />
              {errors.release_year && (
                <Typography color="error" variant="caption">
                  {errors.release_year}
                </Typography>
              )}
            </Box>

            <Box sx={{ flex: isMobile ? "none" : 2, width: isMobile ? "100%" : "auto" }}>
              <TextField
                name="director"
                label="Director"
                value={formData.director}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
              />
              {errors.director && (
                <Typography color="error" variant="caption">
                  {errors.director}
                </Typography>
              )}
            </Box>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 6 }}>
            <Grid component="div" item xs={12} sm={6}>
              <Typography>Poster</Typography>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                  color: "#fff",
                  borderColor: "gray",
                  backgroundColor: "none",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Choose Poster
                <input
                  hidden
                  type="file"
                  data-testid="poster-input"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "poster_url")}
                />
              </Button>
              {preview.poster_url && (
                <Box
                  sx={{
                    mt: 1,
                    width: "100%",
                    height: 180,
                    bgcolor: "#333",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={preview.poster_url}
                    alt="poster preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid component="div" item xs={12} sm={6}>
              <Typography>Banner</Typography>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                  color: "#fff",
                  borderColor: "gray",
                  backgroundColor: "none",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Choose Banner
                <input
                  hidden
                  data-testid="banner-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "banner_url")}
                />
              </Button>
              {preview.banner_url && (
                <Box
                  sx={{
                    mt: 1,
                    width: "100%",
                    height: 180,
                    bgcolor: "#333",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={preview.banner_url}
                    alt="banner preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
            sx={textFieldStyle}
          />
          {errors.description && (
            <Typography color="error" variant="caption">
              {errors.description}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 1,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ backgroundColor: "red" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/movies")}
              fullWidth
              sx={{ borderColor: "gray", color: "#fff" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
