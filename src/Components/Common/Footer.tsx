import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Box, Typography, Link as MuiLink, Divider } from "@mui/material";
import Grid from '@mui/material/Grid'; 

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#141414",
        color: "white",
        py: 2,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: "1300px", mx: "auto" }}>
        <Grid container spacing={{ xs: 2, sm: 4, md: 12, lg: 18, xl: 20 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              MovieExplorer
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              Discover movies, explore trending trailers, and find what to watch
              next.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink
                href="/"
                underline="hover"
                sx={{
                  color: "gray",
                  "&:hover": { color: "red" },
                  fontSize: "1rem",
                }}
              >
                Home
              </MuiLink>
              <MuiLink
                href="/movies"
                underline="hover"
                sx={{
                  color: "gray",
                  "&:hover": { color: "red" },
                  fontSize: "1rem",
                }}
              >
                Genre
              </MuiLink>
              <MuiLink
                href="/subscription"
                underline="hover"
                sx={{
                  color: "gray",
                  "&:hover": { color: "red" },
                  fontSize: "1rem",
                }}
              >
                Subscription
              </MuiLink>
              <MuiLink
                href="/wishlist"
                underline="hover"
                sx={{
                  color: "gray",
                  "&:hover": { color: "red" },
                  fontSize: "1rem",
                }}
              >
                WishList
              </MuiLink>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Follow Us
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                fontSize: "1.5rem",
                color: "gray",
              }}
            >
              <MuiLink
                href="#"
                sx={{ color: "gray", "&:hover": { color: "red" } }}
              >
                <FaFacebook />
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: "gray", "&:hover": { color: "red" } }}
              >
                <FaTwitter />
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: "gray", "&:hover": { color: "red" } }}
              >
                <FaInstagram />
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: "gray", "&:hover": { color: "white" } }}
              >
                <FaYoutube />
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "gray" }} />
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "gray", fontSize: "1.2rem", mb: 0 }}
        >
          © {new Date().getFullYear()} MovieExplorer. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;