import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaBell } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoIcon from "@mui/icons-material/Info";
import { fetchUserDetails, updateProfileImage } from "../../Utils/Api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    profile_picture_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    "https://via.placeholder.com/40?text=User"
  );
  const navigate = useNavigate();
  const profileCardRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchUserData = async () => {
      try {
        const user = await fetchUserDetails();
        setUserData(user.user);
        if (user.user?.profile_picture_url) {
          setPreview(user.user.profile_picture_url);
        }

        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const user = JSON.parse(userString);
            setUserData(user);
            if (user.profileImage) {
              setPreview(user.profileImage);
            }
          } catch (err) {
            console.error("Invalid user data in localStorage");
          }
        }
      }
    };

    if (token) {
      fetchUserData();
    }

    const handleClickOutside = (event) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target)
      ) {
        setShowProfile(false);
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const toggleProfileCard = (event) => {
    if (isLoggedIn) {
      setAnchorEl(event.currentTarget);
      setShowProfile((prev) => !prev);
    } else {
      // toast.error("Please log In");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setShowProfile(false);
    setAnchorEl(null);
    navigate("/login");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setShowProfile(false);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (image) {
      try {
        const response = await updateProfileImage(image);
        const updatedUser = { ...userData, profileImage: response.imageUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setIsEditing(false);
      } catch (error) {
        toast.error("Failed to update profile image.");
      }
    }
  };

  const handlecancel = () => {
    setIsEditing(false);
    setImage(null);
    setPreview(
      userData?.profile_picture_url ||
        "https://via.placeholder.com/40?text=User"
    );
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ margin: 0, backgroundColor: "#141414", 
         

        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1580px",
            width: "100%",
            mx: { xs: "0", md: "0%", lg: "0%" },
            display: "flex",
            justifyContent: { xs: "space-between", sm: "space-between" },
            gap: { xs: 0, sm: 2, md: 3, lg: 20 },
          

          }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              marginLeft: 0,
              textDecoration: "none",
              color: "red",
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "1.2rem", md: "1.6rem" },
              fontFamily: "sans-serif",
            }}
          >
            MOVIE FLIX
          </Typography>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: { xs: 1, lg: 2 },
              fontFamily: "sans-serif",
              fontSize: { xs: "1rem", lg: "1.25rem" },
            }}
          >
            <Typography
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
                "&:hover": { color: "red" },
              }}
            >
              Home
            </Typography>
            <Typography
              component={Link}
              to="/movies"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
                "&:hover": { color: "red" },
              }}
            >
              Genre
            </Typography>
            <Typography
              component={Link}
              to="/subscription"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
                "&:hover": { color: "red" },
              }}
            >
              Subscription
            </Typography>
            <Typography
              component={Link}
              to="/wishlist"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
                "&:hover": { color: "red" },
              }}
            >
              WishList
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.1, sm: 2, md: 3, lg: 5 },
              position: "relative",
              right: "0%",
              ml: { xs: "0%", sm: "0%", md: "10%", lg: "10%" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.3, sm: 1 },
              }}
            >
              <IconButton sx={{ color: "red" }}>
                <FaBell size={20} />
              </IconButton>
              <IconButton onClick={toggleProfileCard} sx={{ color: "white" }}>
                <FaUserCircle size={20} />
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontFamily: "sans-serif",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {isLoggedIn ? userData?.name || "User" : "Guest"}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "block", sm: "none", mr: 0 } }}>
              <IconButton onClick={toggleMenu} sx={{ color: "white" }}>
                {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={showProfile && isLoggedIn}
              onClose={handleMenuClose}
              ref={profileCardRef}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  width: { xs: "80%", sm: "300px" },
                  maxWidth: "100vw",
                  borderRadius: 2,
                  overflow: "visible",
                  maxHeight: "100vh",
                  boxShadow: 5,
                  zIndex: 1400,
                  mt: { xs: 3, sm: 1 },
                  position: "absolute",
                  right: { xs: "4px", sm: "4px" },
                },
              }}
            >
              <Box
                p={0.1}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={preview}
                    sx={{ bgcolor: "red", width: 40, height: 40 }}
                  />
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        fontSize: "0.7rem",
                        opacity: 0,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
                {isEditing ? (
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ fontSize: "0.8rem", marginBottom: "8px" }}
                    />
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        Submit
                      </Button>
                      <Button
                        onClick={handlecancel}
                        variant="contained"
                        color="error"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body1" mt={0.2}>
                      {userData?.name}
                    </Typography>
                    <Typography variant="caption" color="error">
                      Role: {userData?.role}
                    </Typography>
                  </Box>
                )}
              </Box>
              {!isEditing && (
                <Box>
                  <Divider sx={{ bgcolor: "#333" }} />
                  <List>
                    <ListItem
                      button
                      onClick={() => {
                        setShowProfile(false);
                        setAnchorEl(null);
                        navigate("/dashboard");
                      }}
                    >
                      <ListItemIcon sx={{ color: "white", mt: 0 }}>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon sx={{ color: "white", mt: 0 }}>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Notifications" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon sx={{ color: "white", mt: 0 }}>
                        <LanguageIcon />
                      </ListItemIcon>
                      <ListItemText primary="Language" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon sx={{ color: "white", mt: 0 }}>
                        <HelpOutlineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Help & Support" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon sx={{ color: "white", mt: 0 }}>
                        <InfoIcon />
                      </ListItemIcon>
                      <ListItemText primary="About" />
                    </ListItem>
                  </List>
                  {userData?.role === "supervisor" && (
                    <MenuItem
                      onClick={() => {
                        setShowProfile(false);
                        setAnchorEl(null);
                        navigate("/admin");
                      }}
                    >
                      <Button variant="contained" color="primary" fullWidth>
                        Add Movie
                      </Button>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ mt: 0 }}>
                    <Button variant="contained" fullWidth sx={{color:"white",backgroundColor:"red"}}>
                      Logout
                    </Button>
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {isOpen && (
        <Box
          onClick={toggleMenu}
          sx={{
            position: "fixed",
            top: 0,
            right: 2,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
            display: { xs: "block", sm: "none" },
          }}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          top: "64px",
          right: 0,
          width: "70%",
          backgroundColor: "black",
          zIndex: 1300,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          gap: 3,
          px: 3,
          py: 4,
          borderRadius: "0 0 0 10px",
          height: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography
          component={Link}
          to="/"
          onClick={toggleMenu}
          sx={{
            textDecoration: "none",
            color: "white",
            fontSize: "1rem",
            "&:hover": { color: "red", textDecoration: "underline" },
          }}
        >
          Home
        </Typography>
        <Typography
          component={Link}
          to="/movies"
          onClick={toggleMenu}
          sx={{
            textDecoration: "none",
            color: "white",
            fontSize: "1rem",
            "&:hover": { color: "red", textDecoration: "underline" },
          }}
        >
          Movies
        </Typography>
        <Typography
          component={Link}
          to="/subscription"
          onClick={toggleMenu}
          sx={{
            textDecoration: "none",
            color: "white",
            fontSize: "1rem",
            "&:hover": { color: "red", textDecoration: "underline" },
          }}
        >
          Subscription
        </Typography>
        <Typography
          component={Link}
          to="/myWishlist"
          onClick={toggleMenu}
          sx={{
            textDecoration: "none",
            color: "white",
            fontSize: "1rem",
            "&:hover": { color: "red", textDecoration: "underline" },
          }}
        >
          My List
        </Typography>
      </Box>
    </>
  );
};

export default Navbar;