import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { createSubscription } from "../../../Utils/Api";
import { Plan } from "../../../types/Subscription";

const SubscriptionPlans: React.FC = () => {
  window.scrollTo(0, 0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "1-day",
      name: "1 Day Pass",
      price: "$1.99",
      features: [
        "Full access to all movies",
        "Unlimited streaming",
        "HD quality",
        "No ads",
      ],
      duration: "24 hours of premium access",
      basic: true,
    },
    {
      id: "1-month",
      name: "30 Day Pass",
      price: "$7.99",
      features: [
        "Full access to all movies",
        "Unlimited streaming",
        "HD & 4K quality",
        "No ads",
        "Offline downloads",
      ],
      duration: "30 days of premium access",
    },
    {
      id: "3-months",
      name: "3 Month Premium",
      price: "$19.99",
      features: [
        "Full access to all movies",
        "Unlimited streaming",
        "HD & 4K quality",
        "No ads",
        "Early access to new releases",
      ],
      duration: "3 Monthsof premium access",
      popular: true,
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to initiate subscription. Please try again."
      );
      setIsProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#000",
        minHeight: "60vh",
        maxHeight: "1400px",
        display: "flex",
        flexDirection: "column",
        mt: "8px",
        mb: "8px",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography
              variant="body1"
              component="h5"
              gutterBottom
              sx={{
                color: "#fff",
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.6rem" },
                margin: 2,
              }}
            >
              Choose Your Movie Explorer Plan
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
              mb: 1,
            }}
          >
            {plans.map((plan) => (
              <Box
                key={plan.id}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 calc(33.33% - 16px)",
                    md: "1 1 calc(33.33% - 24px)",
                  },
                  maxWidth: "350px",
                  display: "flex",
                  justifyContent: "center",
                  margin: 0,
                  p: 0,
                  boxShadow: "0px 4px 10px rgba(211, 211, 211, 0.5)",
                }}
              >
                <Card
                  elevation={selectedPlan === plan.id ? 3 : 3}
                  sx={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    maxHeight: "350px",
                    transition: "all 0.3s",
                    transform:
                      selectedPlan === plan.id ? "scale(1)" : "scale(1)",
                    border: selectedPlan === plan.id ? 1 : 0,
                    borderColor: "gray",
                    bgcolor: "#000",
                    color: "#fff",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="MOST POPULAR"
                      color="warning"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 1,
                        right: 1,
                        borderRadius: "0 4px 0 4px",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  {plan.basic && (
                    <Chip
                      label="BASIC"
                      color="warning"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 1,
                        right: 1,
                        borderRadius: "0 4px 0 4px",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="body1"
                      component="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ margin: 0, p: 0 }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="rgba(255,255,255,0.6)"
                      gutterBottom
                    >
                      {plan.duration}
                    </Typography>
                    <Typography variant="h5" sx={{ my: 0 }}>
                      {plan.price}
                    </Typography>
                    <List dense sx={{ mb: 0.1 }}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <Check color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            sx={{ color: "#fff" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant={
                        selectedPlan === plan.id ? "contained" : "outlined"
                      }
                      size="large"
                      fullWidth
                      onClick={() => setSelectedPlan(plan.id)}
                      sx={{
                        color: "white",
                        borderColor: "white",
                        bgcolor:
                          selectedPlan === plan.id ? "#E50914" : "transparent",
                        "&:hover": {
                          bgcolor: selectedPlan === plan.id ? "red" : "black",
                          borderColor: "white",
                        },
                      }}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>

          {selectedPlan && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  width: "100%",
                  maxWidth: "md",
                  bgcolor: "#121212",
                  color: "#fff",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                >
                  Confirm Your Subscription
                </Typography>
                <Typography
                  variant="body2"
                  color="rgba(255,255,255,0.7)"
                  gutterBottom
                >
                  You selected {plans.find((p) => p.id === selectedPlan)?.name}{" "}
                  for {plans.find((p) => p.id === selectedPlan)?.price}.
                </Typography>
                {error && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  // disabled={isProcessing}
                  onClick={handleSubscribe}
                  sx={{ py: 1, bgcolor: "#E50914" }}
                >
                  {isProcessing ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "white", mr: 1 }}
                    />
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default SubscriptionPlans;
