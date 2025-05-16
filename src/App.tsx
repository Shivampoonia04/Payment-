import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Movies from "./Pages/Movies";
import Moviedetails from "./Pages/Moviedetails";
import Subscription from "./Pages/Subscription";
import WishList from "./Pages/WishList";
import Admin from "./Pages/Admin";
import Success from "./Components/Layouts/Subscription/Success";

import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";

import PublicRoute from "./Utils/PublicRoute";
import PrivateRoute from "./Utils/PrivateRoute";
import ScrollToTop from "./Utils/ScrollTop";

import { generateToken, messaging } from "./Notification/firebase";
import { onMessage } from "firebase/messaging";
import UserDashboard from "./Components/UserDashBoard/UserDashboard";
import NotFound from "./Components/Layouts/NotFound/NotFound";

// AppLayout separated to handle conditional layout logic
const AppLayout = () => {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route
          path="/movie/:movieId"
          element={
            <PrivateRoute toastMessage="Please login to view movie details">
              <Moviedetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <PrivateRoute toastMessage="Please login to access subscriptions">
              <Subscription />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute toastMessage="Please login to access your wishlist">
              <WishList />
            </PrivateRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      if (Notification.permission === "granted") {
        const notificationTitle =
          payload.notification?.title || "New Notification";
        const notificationOptions = {
          body: payload.notification?.body || "You have a new message",
          icon: payload.notification?.image || "/favicon.ico",
        };
        new Notification(notificationTitle, notificationOptions);
      }
    });
  }, []);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        style={{ top: "20px" }}
      />
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}

export default App;
