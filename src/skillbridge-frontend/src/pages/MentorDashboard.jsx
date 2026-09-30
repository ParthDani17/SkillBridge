import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MentorDashboard() {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getDashboardData();
    }, []);

    const getDashboardData = async () => {
        setLoading(true);
        setError("");

        try {
            const [
                userResponse,
                requestsResponse,
                sessionsResponse,
                notificationsResponse
            ] = await Promise.all([
                api.get("/users/me"),
                api.get("/learning-requests/received"),
                api.get("/sessions/my"),
                api.get("/notifications/my")
            ]);

            setUser(userResponse.data.data);
            setRequests(requestsResponse.data.data || []);
            setSessions(sessionsResponse.data.data || []);
            setNotifications(notificationsResponse.data.data || []);
        } catch (error) {
            console.error(
                "Error loading mentor dashboard:",
                error.response?.data || error.message
            );

            setError("Unable to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    const pendingRequests = requests.filter(
        (request) => request.status === "pending"
    );

    const unreadNotifications = notifications.filter(
        (notification) => notification.status === "unread"
    );

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <h2>Loading dashboard...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>
                    Welcome, {user?.name}
                </h1>

                <p>
                    Manage your mentoring activities from your dashboard.
                </p>
            </div>

            {/* Statistics */}

            <div className="dashboard-stats">

                <div className="stat-card">
                    <h3>Learning Requests</h3>
                    <p>{requests.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Pending Requests</h3>
                    <p>{pendingRequests.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Sessions</h3>
                    <p>{sessions.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Unread Notifications</h3>
                    <p>{unreadNotifications.length}</p>
                </div>

            </div>

            {/* Recent Requests */}

            <div className="profile-card">

                <h2>Recent Learning Requests</h2>

                {requests.length === 0 ? (
                    <p>
                        You have not received any learning requests yet.
                    </p>
                ) : (
                    requests.slice(0, 5).map((request) => (
                        <div
                            className="skill-card"
                            key={request._id}
                        >
                            <h3>
                                {request.studentId?.name ||
                                    "Student"}
                            </h3>

                            <p>
                                <strong>Skill:</strong>{" "}
                                {request.skillId?.skillName ||
                                    "Skill"}
                            </p>

                            <p>
                                <strong>Message:</strong>{" "}
                                {request.message ||
                                    "No message"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`request-status ${request.status}`}
                                >
                                    {request.status}
                                </span>
                            </p>
                        </div>
                    ))
                )}

                {requests.length > 0 && (
                    <Link to="/mentor/requests">
                        View All Requests
                    </Link>
                )}

            </div>

            {/* Quick Actions */}

            <div className="profile-card">

                <h2>Quick Actions</h2>

                <div className="dashboard-actions">

                    <Link
                        to="/mentor/requests"
                        className="dashboard-action"
                    >
                        View Learning Requests
                    </Link>

                    <Link
                        to="/mentor/sessions"
                        className="dashboard-action"
                    >
                        My Sessions
                    </Link>

                    <Link
                        to="/mentor/profile"
                        className="dashboard-action"
                    >
                        My Profile
                    </Link>

                    <Link
                        to="/mentor/notifications"
                        className="dashboard-action"
                    >
                        Notifications
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default MentorDashboard;