import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function LearningRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [mode, setMode] = useState("online");

    useEffect(() => {
        getRequests();
    }, []);

    const getRequests = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/learning-requests/my");

            setRequests(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching learning requests:",
                error.response?.data || error.message
            );

            setError("Unable to load learning requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleClick = (request) => {
        setSelectedRequest(request);
        setDate("");
        setTime("");
        setMode("online");
        setActionMessage("");
    };

    const handleSchedule = async (event) => {
        event.preventDefault();

        if (!selectedRequest) {
            return;
        }

        setActionMessage("");

        try {
            await api.post("/sessions", {
                learningRequestId: selectedRequest._id,
                date,
                time,
                mode
            });

            setActionMessage(
                "Session scheduled successfully."
            );

            setSelectedRequest(null);
            setDate("");
            setTime("");
            setMode("online");
        } catch (error) {
            console.error(
                "Error scheduling session:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to schedule session."
            );
        }
    };

    const handleCancelRequest = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this learning request?"
        );
        if (!confirmed) return;

        setActionMessage("");

        try {
            await api.patch(`/learning-requests/${id}/cancel`);
            setActionMessage(
                "Learning request cancelled successfully."
            );
            getRequests();
        } catch (err) {
            console.error(
                "Error cancelling request:",
                err.response?.data || err.message
            );
            setActionMessage(
                err.response?.data?.message ||
                "Unable to cancel learning request."
            );
        }
    };

    const handleCancelSchedule = () => {
        setSelectedRequest(null);
        setDate("");
        setTime("");
        setMode("online");
    };

    const getStatusClass = (status) => {
        if (status === "accepted") {
            return "request-status accepted";
        }

        if (status === "rejected") {
            return "request-status rejected";
        }

        if (status === "cancelled") {
            return "request-status cancelled";
        }

        return "request-status pending";
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>My Learning Requests</h1>

                <p>
                    View and manage your mentorship requests.
                </p>
            </div>

            {loading && (
                <div className="profile-card">
                    <h2>Loading requests...</h2>
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
                    <h2>Requests</h2>

                    {requests.length === 0 ? (
                        <p>
                            You do not have any learning requests yet.
                        </p>
                    ) : (
                        requests.map((request) => (
                            <div
                                className="skill-card"
                                key={request._id}
                            >
                                <h3>
                                    {request.mentorId?.name}
                                </h3>

                                <p>
                                    <strong>Department:</strong>{" "}
                                    {request.mentorId?.department}
                                </p>

                                <p>
                                    <strong>Skill:</strong>{" "}
                                    {request.skillId?.skillName}
                                </p>

                                <p>
                                    <strong>Proficiency:</strong>{" "}
                                    {request.skillId?.proficiencyLevel}
                                </p>

                                <p>
                                    <strong>Message:</strong>{" "}
                                    {request.message || "No message"}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={getStatusClass(
                                            request.status
                                        )}
                                    >
                                        {request.status}
                                    </span>
                                </p>

                                <p>
                                    <strong>Requested On:</strong>{" "}
                                    {new Date(
                                        request.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                {request.status === "accepted" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleScheduleClick(request)
                                        }
                                    >
                                        Schedule Session
                                    </button>
                                )}

                                {request.status === "pending" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCancelRequest(request._id)
                                        }
                                        style={{ backgroundColor: "#dc2626", color: "#fff" }}
                                    >
                                        Cancel Request
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedRequest && (
                <div className="profile-card">
                    <h2>Schedule Session</h2>

                    <p>
                        <strong>Mentor:</strong>{" "}
                        {selectedRequest.mentorId?.name}
                    </p>

                    <p>
                        <strong>Skill:</strong>{" "}
                        {selectedRequest.skillId?.skillName}
                    </p>

                    <form onSubmit={handleSchedule}>
                        <div className="form-group">
                            <label htmlFor="session-date">
                                Date
                            </label>

                            <input
                                id="session-date"
                                type="date"
                                value={date}
                                onChange={(event) =>
                                    setDate(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="session-time">
                                Time
                            </label>

                            <input
                                id="session-time"
                                type="time"
                                value={time}
                                onChange={(event) =>
                                    setTime(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="session-mode">
                                Mode
                            </label>

                            <select
                                id="session-mode"
                                value={mode}
                                onChange={(event) =>
                                    setMode(event.target.value)
                                }
                                required
                            >
                                <option value="online">
                                    Online
                                </option>

                                <option value="offline">
                                    Offline
                                </option>
                            </select>
                        </div>

                        <button type="submit">
                            Schedule Session
                        </button>

                        <button
                            type="button"
                            onClick={handleCancelSchedule}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <div className="profile-card">
                <Link to="/student/mentors">
                    Find More Mentors
                </Link>
            </div>
        </div>
    );
}

export default LearningRequests;