import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {

    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {

        if (user.role === "Student") {
            return <Navigate to="/student/dashboard" replace />;
        }

        if (user.role === "Mentor") {
            return <Navigate to="/mentor/dashboard" replace />;
        }

        if (user.role === "Administrator") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;