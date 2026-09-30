import { useEffect, useState } from "react";
import api from "../services/api";

function MentorRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        getRequests();
    }, []);

    const getRequests = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/learning-requests/received");

            setRequests(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching received requests:",
                error.response?.data || error.message
            );

            setError("Unable to load learning requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        setActionMessage("");

        try {
            await api.patch(
                `/learning-requests/${id}/accept`
            );

            setActionMessage(
                "Learning request accepted successfully."
            );

            getRequests();
        } catch (error) {
            console.error(
                "Error accepting request:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to accept learning request."
            );
        }
    };

    const handleReject = async (id) => {
        setActionMessage("");

        try {
            await api.patch(
                `/learning-requests/${id}/reject`
            );

            setActionMessage(
                "Learning request rejected successfully."
            );

            getRequests();
        } catch (error) {
            console.error(
                "Error rejecting request:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to reject learning request."
            );
        }
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
                <h1>Learning Requests</h1>
                <p>
                    View and manage requests received from students.
                </p>
            </div>

            {loading && (
                <div className="profile-card">
                    <h2>Loading requests...</h2>
                </div>
            )}

            {error && (
                <div className="profile-card">
                    <p className="error-message">{error}</p>
                </div>
            )}

            {actionMessage && (
                <div className="profile-card">
                    <p>{actionMessage}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="profile-card">

                    <h2>Received Requests</h2>

                    {requests.length === 0 ? (
                        <p>
                            You have not received any learning requests yet.
                        </p>
                    ) : (
                        requests.map((request) => (
                            <div
                                className="skill-card"
                                key={request._id}
                            >
                                <h3>
                                    {request.studentId?.name}
                                </h3>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {request.studentId?.email}
                                </p>

                                <p>
                                    <strong>Department:</strong>{" "}
                                    {request.studentId?.department}
                                </p>

                                <p>
                                    <strong>Academic Year:</strong>{" "}
                                    {request.studentId?.academicYear}
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
                                    ).toLocaleString()}
                                </p>

                                {request.status === "pending" && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAccept(
                                                    request._id
                                                )
                                            }
                                        >
                                            Accept
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleReject(
                                                    request._id
                                                )
                                            }
                                        >
                                            Reject
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

export default MentorRequests;