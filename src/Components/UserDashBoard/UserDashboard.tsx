import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  fetchUserDetails,
  getSubscriptionStatus,
  cancelSubscription,
} from "../../Utils/Api";

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    profile_picture_url: "",
  });

  const [subscription, setSubscription] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [user, subDataRaw] = await Promise.all([
          fetchUserDetails(),
          getSubscriptionStatus(),
        ]);

        const subData = subDataRaw;
        setUserData(user.user);
        localStorage.setItem("plan", subData.plan_type);
        setSubscription(subData.plan_type);
      } catch (error) {
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const user = JSON.parse(userString);
            setUserData(user);
          } catch (err) {
            console.error("Invalid user data in localStorage");
          }
        }
        setSubscription(null);
      }
    };

    fetchData();
  }, [navigate]);

  const handleOpenDialog = (type) => {
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (actionType === "cancelSubscription") {
      try {
        await cancelSubscription();
        setSubscription(null);
        alert("Subscription canceled successfully!");
      } catch (error) {
        console.error("Error canceling subscription:", error);
        alert("Failed to cancel subscription. Please try again.");
      }
    }
    handleCloseDialog();
  };

  const handleAddMovie = () => {
    navigate("/admin");
  };

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  return (
    <Box
      sx={{
        minHeight: "30vh",
        maxHeight: "600px",
        backgroundColor: "black",
        color: "#E0E0E0",
        px: { xs: 3, sm: 5, md: 8, lg: 10 },
        py: { xs: 1, sm: 1, md: 2 },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >

      <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 1 }}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{ color: "#E0E0E0", mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="body2"
          sx={{
            color: "#E0E0E0",
            fontFamily: "'Poppins', sans-serif",
            textAlign: "left",
            fontSize: { xs: "1rem", sm: "1.3rem", md: "1.6rem" },
          }}
        >
          User Dashboard
        </Typography>
      </Box>
      <Paper
        sx={{
          p: { xs: 1, sm: 1, md: 2 },
          backgroundColor: "black",
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: { xs: "100%", sm: 900, md: 1100 },
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "center" },
            gap: { xs: 3, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
              flex: { xs: "none", sm: "0 0 auto" },
            }}
          >
            <Avatar
              src={userData?.profile_picture_url || ""}
              alt={userData?.name || "User"}
              sx={{
                width: { xs: 150, sm: 210, md: 260 },
                height: { xs: 150, sm: 210, md: 260 },
                border: "5px solid #26A69A",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.4s ease, border-color 0.4s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                  borderColor: "#80CBC4",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              flex: { xs: "none", sm: 1 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: "#E0E0E0",
                fontFamily: "'Roboto', sans-serif",
                fontSize: { xs: "1rem", sm: "1.2rem" },
              }}
            >
              Welcome, {userData?.name || "User"}!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#B0B0B0",
                mb: 1,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Role: {userData?.role || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#90A4AE",
                mb: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Manage your account, explore features, and stay in control.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 1.5,
                color: "#E0E0E0",
                fontSize: { xs: "1.4rem", sm: "1.6rem" },
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Subscription
            </Typography>
            {subscription ? (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#B0B0B0",
                    mb: 1.5,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  {subscription === "1-day"
                    ? "Basic"
                    : subscription === "1-month"
                    ? "Standard"
                    : "Premium"}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#90A4AE",
                    mb: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  No active subscription. Subscribe now to unlock premium
                  features!
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSubscribe}
                  sx={{
                    background:
                      "linear-gradient(45deg, #26A69A 30%, #4DB6AC 90%)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    py: 1.2,
                    borderRadius: 2,
                    minWidth: { xs: "120px", sm: "160px" },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 4px 12px rgba(38, 166, 154, 0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #4DB6AC 30%, #80CBC4 90%)",
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 18px rgba(38, 166, 154, 0.6)",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: { xs: 2, sm: 2.5 },
                justifyContent: { xs: "center", sm: "flex-start" },
                alignItems: "center",
              }}
            >
              {subscription && (
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog("cancelSubscription")}
                  sx={{
                    backgroundColor: "red",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    py: 1.2,
                    borderRadius: 2,
                    // minWidth: { xs: "120px", sm: "160px" },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 4px 12px rgba(239, 83, 80, 0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Cancel Subscription
                </Button>
              )}
              {userData?.role?.toLowerCase() === "supervisor" && (
                <Button
                  variant="contained"
                  onClick={handleAddMovie}
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                    px: { xs: 3, sm: 4 },
                    py: 1.2,
                    borderRadius: 2,
                    // minWidth: { xs: "120px", sm: "160px" },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 4px 12px rgba(38, 166, 154, 0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Add Movie
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)",
            color: "#E0E0E0",
            borderRadius: 3,
            p: 2,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#E0E0E0",
            fontSize: { xs: "1rem", sm: "1.2rem" },
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Confirm Cancellation
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              color: "#B0B0B0",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Are you sure you want to cancel your subscription? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "#90A4AE",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontFamily: "'Poppins', sans-serif",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "#E0E0E0",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #EF5350 30%, #F44336 90%)",
              color: "#FFFFFF",
              px: { xs: 1, sm: 2 },
              borderRadius: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 4px 12px rgba(239, 83, 80, 0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                background: "linear-gradient(45deg, #F44336 30%, #D32F2F 90%)",
                transform: "scale(1.05)",
                boxShadow: "0 6px 18px rgba(239, 83, 80, 0.6)",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
