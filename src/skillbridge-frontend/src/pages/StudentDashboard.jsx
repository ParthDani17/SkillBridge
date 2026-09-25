import { useEffect, useState } from "react";
import api from "../services/api";

function StudentDashboard() {

    const [user, setUser] = useState(null);
    const [learningRequests, setLearningRequests] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getDashboardData = async () => {

            try {

                const [
                    userResponse,
                    learningRequestsResponse,
                    sessionsResponse,
                    notificationsResponse
                ] = await Promise.all([
                    api.get("/users/me"),
                    api.get("/learning-requests/my"),
                    api.get("/sessions/my"),
                    api.get("/notifications/my")
                ]);

                setUser(userResponse.data.data);

                setLearningRequests(
                    learningRequestsResponse.data.data || []
                );

                setSessions(
                    sessionsResponse.data.data || []
                );

                setNotifications(
                    notificationsResponse.data.data || []
                );

            } catch (error) {

                console.error(
                    "Error fetching dashboard data:",
                    error.response?.data || error.message
                );

                setError("Unable to load dashboard information.");

            } finally {

                setLoading(false);

            }

        };

        getDashboardData();

    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {user?.name}! 👋</h1>
                    <p>Continue your SkillBridge learning journey.</p>
                </div>
            </div>

            <div className="dashboard-stats">

                <div className="stat-card">
                    <h3>Learning Requests</h3>
                    <p>{learningRequests.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Sessions</h3>
                    <p>{sessions.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Notifications</h3>
                    <p>{notifications.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Profile</h3>
                    <p>View Profile</p>
                </div>

            </div>

            <div className="dashboard-section">

                <h2>Your Information</h2>

                <div className="user-info-card">

                    <p>
                        <strong>Name:</strong> {user?.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>

                    <p>
                        <strong>Department:</strong> {user?.department}
                    </p>

                    <p>
                        <strong>Academic Year:</strong> {user?.academicYear}
                    </p>

                    <p>
                        <strong>Role:</strong> {user?.role}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default StudentDashboard;