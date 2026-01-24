import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "../components/ui/use-toast";

export type Role = "guest" | "user" | "hr";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowed: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowed,
}) => {
  const { role, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) {
    return null;
  }

  if (!allowed.includes(role)) {
    // Only redirect after hydration, never call setState in render
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
