import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {

    const navigate = useNavigate();

    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-logo">

                <Link to="/">
                    SkillBridge
                </Link>

            </div>

            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                {!isAuthenticated && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {isAuthenticated && (
                    <>

                        <span>
                            Hi, {user.name}
                        </span>

                        {user.role === "Student" && (
                            <>
                                <Link to="/student/dashboard">Dashboard</Link>
                                <Link to="/student/profile">Profile</Link>
                            </>
                        )}

                        {user.role === "Mentor" && (
                            <Link to="/mentor/dashboard">
                                Dashboard
                            </Link>
                        )}

                        {user.role === "Administrator" && (
                            <Link to="/admin/dashboard">
                                Dashboard
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;