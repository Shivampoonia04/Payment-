import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../../../Utils/Api";
import { toast } from "react-toastify";
import backgroundImage from "../../../assets/net.jpg";

const Loginform: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^.+@.+$/;
      return emailRegex.test(email);
    };
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    if (email === "") {
      setEmailError("Email is required");
      hasError = true;
    }
    if (password === "") {
      setPasswordError("Password is required");
      hasError = true;
    }
    if (!email) {
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Not a valid email");
      hasError = true;
    }
    if (hasError) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(email, password);
      toast.success("Login successful!");
      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (err: any) {
      setLoginError(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: 4,
        opacity: 0.8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: { xs: 4, sm: 16 },
            left: { xs: 4, sm: 16 },
            fontWeight: "bold",
            fontSize: { xs: "1.4rem", sm: "1.8rem" },
            color: "red",
            zIndex: 10,
          }}
        >
          MOVIEFLIX
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: { xs: 2, sm: 3 },
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              borderRadius: 2,
              border: "2px solid #374151",
              width: { xs: "90%", sm: 400, md: 500 },
              maxWidth: 500,
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              align="center"
              sx={{ mb: 3, fontWeight: "bold", color: "white" }}
              aria-label="Login form heading"
            >
              Login
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
              <Box sx={{ mb: 1 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  placeholder="Enter Your Email"
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        color: "white",
                      },
                      "& fieldset": { borderColor: "#FF0000" },
                      "&:hover fieldset": { borderColor: "#FF0000" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                  }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    height: "18px",
                    color: "#f87171",
                    mt: 0.5,
                  }}
                >
                  {emailError}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  placeholder="Enter Your Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        color: "white",
                      },
                      "& .MuiInputAdornment-root": {
                        backgroundColor: "transparent",
                      },
                      "& fieldset": { borderColor: "#FF0000" },
                      "&:hover fieldset": { borderColor: "#FF0000" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={
                            showPassword ? "hide password" : "show password"
                          }
                          sx={{ color: "white" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: { color: "white" },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    height: "18px",
                    color: "#f87171",
                    mt: 0.5,
                  }}
                >
                  {passwordError}
                </Typography>
              </Box>

              {loginError && (
                <Typography
                  variant="body2"
                  sx={{ color: "#f87171", mb: 1, textAlign: "center" }}
                >
                  {loginError}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  mb: 1,
                  py: 1,
                  backgroundColor: "#FF0000",
                  "&:hover": { backgroundColor: "#FF0000" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "medium",
                  color: "white",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
                mt: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "white", cursor: "pointer" }}
                align="center"
                onClick={() => navigate("/signup")}
              >
                Create an account{" "}
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                >
                  SignUp
                </span>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Loginform;
