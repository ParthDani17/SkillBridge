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
                                <Link to="/student/dashboard">
                                    Dashboard
                                </Link>

                                <Link to="/student/profile">
                                    Profile
                                </Link>

                                <Link to="/student/skills">
                                    My Skills
                                </Link>

                                <Link to="/student/mentors">
                                    Find Mentor
                                </Link>

                                <Link to="/student/requests">
                                    My Requests
                                </Link>

                                <Link to="/student/sessions">
                                    My Sessions
                                </Link>

                                <Link to="/student/notifications">
                                    Notifications
                                </Link>

                                <Link to="/student/reviews">
                                    My Reviews
                                </Link>
                            </>
                        )}

                        {user.role === "Mentor" && (
                            <>
                                <Link to="/mentor/dashboard">
                                    Dashboard
                                </Link>

                                <Link to="/mentor/profile">
                                    My Profile
                                </Link>

                                <Link to="/mentor/requests">
                                    Requests
                                </Link>

                                <Link to="/mentor/sessions">
                                    My Sessions
                                </Link>

                                <Link to="/mentor/notifications">
                                    Notifications
                                </Link>
                            </>
                            
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