import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Leaf } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Leaf className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // 🔥 current page store kar rahe hain
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}