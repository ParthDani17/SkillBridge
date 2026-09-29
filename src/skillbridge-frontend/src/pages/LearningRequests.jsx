import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function LearningRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getLearningRequests();
    }, []);

    const getLearningRequests = async () => {
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
                <p>View and track the learning requests you have sent.</p>
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

            {!loading && !error && (
                <div className="profile-card">

                    <h2>Learning Requests</h2>

                    {requests.length === 0 ? (
                        <div>
                            <p>You have not sent any learning requests yet.</p>

                            <Link to="/student/mentors">
                                Find a Mentor
                            </Link>
                        </div>
                    ) : (
                        requests.map((request) => (
                            <div
                                className="skill-card"
                                key={request._id}
                            >
                                <p>
                                    <strong>Mentor ID:</strong>{" "}
                                    {request.mentorId}
                                </p>

                                <p>
                                    <strong>Skill ID:</strong>{" "}
                                    {request.skillId}
                                </p>

                                <p>
                                    <strong>Message:</strong>{" "}
                                    {request.message || "No message"}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={getStatusClass(request.status)}>
                                        {request.status}
                                    </span>
                                </p>

                                <p>
                                    <strong>Requested On:</strong>{" "}
                                    {new Date(
                                        request.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}

                </div>
            )}
        </div>
    );
}

export default LearningRequests;