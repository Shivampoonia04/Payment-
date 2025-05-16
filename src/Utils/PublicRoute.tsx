import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
interface PublicRouteProps {
  children: ReactNode;
}
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token"); 
}
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <>{children}</>;
};

export default PublicRoute;
