import { useEffect, useState } from "react";

import api from "../services/api";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/notifications/my");

            setNotifications(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching notifications:",
                error.response?.data || error.message
            );

            setError("Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        setActionMessage("");

        try {
            await api.patch(`/notifications/${id}/read`);

            setActionMessage(
                "Notification marked as read."
            );

            getNotifications();
        } catch (error) {
            console.error(
                "Error marking notification as read:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to mark notification as read."
            );
        }
    };

    const handleDelete = async (id) => {
        setActionMessage("");

        try {
            await api.delete(`/notifications/${id}`);

            setActionMessage(
                "Notification deleted successfully."
            );

            getNotifications();
        } catch (error) {
            console.error(
                "Error deleting notification:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to delete notification."
            );
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Notifications</h1>

                <p>
                    View your latest notifications and updates.
                </p>
            </div>

            {loading && (
                <div className="profile-card">
                    <h2>Loading notifications...</h2>
                </div>
            )}

            {error && (
                <div className="profile-card">
                    <p className="error-message">
                        {error}
                    </p>
                </div>
            )}

            {actionMessage && (
                <div className="profile-card">
                    <p>{actionMessage}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="profile-card">
                    <h2>Your Notifications</h2>

                    {notifications.length === 0 ? (
                        <p>
                            You do not have any notifications.
                        </p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                className="skill-card"
                                key={notification._id}
                            >
                                <p>
                                    <strong>
                                        {notification.message}
                                    </strong>
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={
                                            notification.status ===
                                            "unread"
                                                ? "request-status pending"
                                                : "request-status accepted"
                                        }
                                    >
                                        {notification.status}
                                    </span>
                                </p>

                                <p>
                                    <strong>Received:</strong>{" "}
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </p>

                                {notification.status ===
                                    "unread" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleMarkAsRead(
                                                notification._id
                                            )
                                        }
                                    >
                                        Mark as Read
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            notification._id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Notifications;