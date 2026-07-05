import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

function ProtectedRoute({ children, adminOnly = false }) {
  const user = auth.currentUser;
  console.log(user?.email);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (
    adminOnly &&
    user.email !== "snami41745@gmail.com"
  ) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;