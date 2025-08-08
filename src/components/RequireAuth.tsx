import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [guest, setGuest] = useState<boolean>(false);

  useEffect(() => {
    try { setGuest(localStorage.getItem("funstake_guest") === "1"); } catch {}
  }, []);

  if (loading) return null;
  if (!session && !guest) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
