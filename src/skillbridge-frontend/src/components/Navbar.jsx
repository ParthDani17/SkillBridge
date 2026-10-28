import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../services/api";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();

    const { socket } = useSocket();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = () => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            return;
        }

        api.get("/notifications/my")
            .then((res) => {
                const list = res.data?.data || [];
                const unread = list.filter((n) => n.status === "unread").length;
                setUnreadCount(unread);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchUnreadCount();
    }, [isAuthenticated, location.pathname]);

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = () => {
            setUnreadCount((prev) => prev + 1);
        };

        socket.on("notification:new", handleNewNotification);

        return () => {
            socket.off("notification:new", handleNewNotification);
        };
    }, [socket]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-logo">
                <Link to="/">
                    Skill<span className="navbar-brand-accent">Bridge</span>
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

                                <Link to="/student/notifications" style={{ display: "inline-flex", alignItems: "center" }}>
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span style={{
                                            backgroundColor: "#ef4444",
                                            color: "white",
                                            borderRadius: "10px",
                                            padding: "1px 6px",
                                            fontSize: "11px",
                                            marginLeft: "5px",
                                            fontWeight: "bold",
                                            lineHeight: "1.2"
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
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

                                <Link to="/mentor/skills">
                                    My Skills
                                </Link>

                                <Link to="/mentor/requests">
                                    Requests
                                </Link>

                                <Link to="/mentor/sessions">
                                    My Sessions
                                </Link>

                                <Link to="/mentor/notifications" style={{ display: "inline-flex", alignItems: "center" }}>
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span style={{
                                            backgroundColor: "#ef4444",
                                            color: "white",
                                            borderRadius: "10px",
                                            padding: "1px 6px",
                                            fontSize: "11px",
                                            marginLeft: "5px",
                                            fontWeight: "bold",
                                            lineHeight: "1.2"
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
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