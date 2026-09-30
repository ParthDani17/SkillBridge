import { useEffect, useState } from "react";
import api from "../services/api";

function StudentSessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        getSessions();
    }, []);

    const getSessions = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/sessions/my");

            setSessions(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching sessions:",
                error.response?.data || error.message
            );

            setError("Unable to load sessions.");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id) => {
        setActionMessage("");

        try {
            await api.patch(`/sessions/${id}/complete`);

            setActionMessage(
                "Session completed successfully."
            );

            getSessions();
        } catch (error) {
            console.error(
                "Error completing session:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to complete session."
            );
        }
    };

    const handleCancel = async (id) => {
        setActionMessage("");

        try {
            await api.patch(`/sessions/${id}/cancel`);

            setActionMessage(
                "Session cancelled successfully."
            );

            getSessions();
        } catch (error) {
            console.error(
                "Error cancelling session:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to cancel session."
            );
        }
    };

    const getStatusClass = (status) => {
        if (status === "completed") {
            return "request-status accepted";
        }

        if (status === "cancelled") {
            return "request-status cancelled";
        }

        return "request-status pending";
    };

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>My Sessions</h1>

                <p>
                    View and manage your mentorship sessions.
                </p>
            </div>

            {loading && (
                <div className="profile-card">
                    <h2>Loading sessions...</h2>
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

                    <h2>Sessions</h2>

                    {sessions.length === 0 ? (
                        <p>
                            You do not have any sessions yet.
                        </p>
                    ) : (
                        sessions.map((session) => (
                            <div
                                className="skill-card"
                                key={session._id}
                            >
                                <h3>
                                    {session.mentorId?.name}
                                </h3>

                                <p>
                                    <strong>Skill:</strong>{" "}
                                    {session.learningRequestId
                                        ?.skillId
                                        ?.skillName ||
                                        "Skill"}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {session.date}
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {session.time}
                                </p>

                                <p>
                                    <strong>Mode:</strong>{" "}
                                    {session.mode}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={getStatusClass(
                                            session.status
                                        )}
                                    >
                                        {session.status}
                                    </span>
                                </p>

                                {session.status === "scheduled" && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleComplete(
                                                    session._id
                                                )
                                            }
                                        >
                                            Mark Completed
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCancel(
                                                    session._id
                                                )
                                            }
                                        >
                                            Cancel Session
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                </div>
            )}

        </div>
    );
}

export default StudentSessions;