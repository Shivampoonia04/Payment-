import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PrivateRouteProps {
  children: JSX.Element;
  toastMessage?: string;
}

const PrivateRoute = ({ children, toastMessage }: PrivateRouteProps) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const hasShownToast = useRef(false); 

  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      hasShownToast.current = true; 
      navigate("/login", { replace: true });
      toast.error(toastMessage || "You need to log in to access this page", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [isAuthenticated, navigate, toastMessage]);

  if (isAuthenticated) {
    return children;
  }

  return null;
};

export default PrivateRoute;