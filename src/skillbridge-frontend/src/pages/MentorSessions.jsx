import { useEffect, useState } from "react";
import api from "../services/api";

function MentorSessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const [reschedulingSession, setReschedulingSession] = useState(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [rescheduleMode, setRescheduleMode] = useState("online");

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

    const handleRescheduleClick = (session) => {
        setReschedulingSession(session);
        setRescheduleDate(session.date ? session.date.substring(0, 10) : "");
        setRescheduleTime(session.time || "");
        setRescheduleMode(session.mode || "online");
        setActionMessage("");
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        if (!reschedulingSession) return;
        setActionMessage("");
        try {
            await api.patch(`/sessions/${reschedulingSession._id}/reschedule`, {
                date: rescheduleDate,
                time: rescheduleTime,
                mode: rescheduleMode
            });
            setActionMessage("Session rescheduled successfully.");
            setReschedulingSession(null);
            getSessions();
        } catch (err) {
            console.error("Error rescheduling session:", err);
            setActionMessage(
                err.response?.data?.message ||
                "Unable to reschedule session."
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
                                    {session.studentId?.name}
                                </h3>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {session.studentId?.email}
                                </p>

                                <p>
                                    <strong>Department:</strong>{" "}
                                    {session.studentId?.department}
                                </p>

                                <p>
                                    <strong>Academic Year:</strong>{" "}
                                    {session.studentId?.academicYear}
                                </p>

                                <p>
                                    <strong>Skill:</strong>{" "}
                                    {session.learningRequestId
                                        ?.skillId
                                        ?.skillName ||
                                        "Skill"}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {session.date ? new Date(session.date).toLocaleDateString() : "N/A"}
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
                                                handleRescheduleClick(
                                                    session
                                                )
                                            }
                                            style={{ marginLeft: "8px" }}
                                        >
                                            Reschedule
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCancel(
                                                    session._id
                                                )
                                            }
                                            style={{ marginLeft: "8px" }}
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

            {reschedulingSession && (
                <div className="profile-card">
                    <h2>Reschedule Session</h2>

                    <p>
                        <strong>Student:</strong>{" "}
                        {reschedulingSession.studentId?.name}
                    </p>

                    <form onSubmit={handleRescheduleSubmit}>
                        <div className="form-group">
                            <label htmlFor="reschedule-date">New Date</label>
                            <input
                                id="reschedule-date"
                                type="date"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reschedule-time">New Time</label>
                            <input
                                id="reschedule-time"
                                type="time"
                                value={rescheduleTime}
                                onChange={(e) => setRescheduleTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reschedule-mode">Mode</label>
                            <select
                                id="reschedule-mode"
                                value={rescheduleMode}
                                onChange={(e) => setRescheduleMode(e.target.value)}
                                required
                            >
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>

                        <button type="submit">Confirm Reschedule</button>
                        <button
                            type="button"
                            onClick={() => setReschedulingSession(null)}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default MentorSessions;