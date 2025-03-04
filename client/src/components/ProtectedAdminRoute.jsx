import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    console.log("Access denied: User is not admin", user);
    return <Navigate to="/Auth" />;
  }

  return children;
};

export default ProtectedAdminRoute;
