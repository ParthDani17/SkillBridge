import { useEffect, useState } from "react";
import api from "../services/api";

function StudentSessions() {
    const [sessions, setSessions] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [selectedSession, setSelectedSession] = useState(null);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        getSessions();
        getReviews();
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

    const getReviews = async () => {
        try {
            const response = await api.get("/reviews/my");

            setReviews(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching reviews:",
                error.response?.data || error.message
            );
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

    const handleReviewClick = (session) => {
        setSelectedSession(session);
        setRating("");
        setComment("");
        setActionMessage("");
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();

        setActionMessage("");

        try {
            await api.post("/reviews", {
                sessionId: selectedSession._id,
                rating: Number(rating),
                comment
            });

            setActionMessage(
                "Review submitted successfully."
            );

            setSelectedSession(null);
            setRating("");
            setComment("");

            getReviews();
        } catch (error) {
            console.error(
                "Error submitting review:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to submit review."
            );
        }
    };

    const hasReviewed = (sessionId) => {
        return reviews.some(
            (review) =>
                review.sessionId?.toString() ===
                sessionId.toString()
        );
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

    if (loading) {
        return (
            <div className="profile-page">
                <h2>Loading sessions...</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>My Sessions</h1>

                <p>
                    View and manage your mentorship sessions.
                </p>
            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {actionMessage && (
                <p className="success-message">
                    {actionMessage}
                </p>
            )}

            {sessions.length === 0 ? (
                <div className="profile-card">
                    <p>
                        You do not have any sessions yet.
                    </p>
                </div>
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
                            <strong>Email:</strong>{" "}
                            {session.mentorId?.email}
                        </p>

                        <p>
                            <strong>Department:</strong>{" "}
                            {session.mentorId?.department}
                        </p>

                        <p>
                            <strong>Skill:</strong>{" "}
                            {session.learningRequestId?.skillId?.skillName}
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
                                    Complete Session
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

                        {session.status === "completed" &&
                            !hasReviewed(session._id) && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleReviewClick(
                                            session
                                        )
                                    }
                                >
                                    Write Review
                                </button>
                            )}

                        {session.status === "completed" &&
                            hasReviewed(session._id) && (
                                <p>
                                    <strong>
                                        Review submitted ✓
                                    </strong>
                                </p>
                            )}
                    </div>
                ))
            )}

            {selectedSession && (
                <div className="profile-card">

                    <h2>Write Review</h2>

                    <p>
                        <strong>Mentor:</strong>{" "}
                        {selectedSession.mentorId?.name}
                    </p>

                    <form onSubmit={handleReviewSubmit}>

                        <div className="form-group">

                            <label htmlFor="rating">
                                Rating
                            </label>

                            <select
                                id="rating"
                                value={rating}
                                onChange={(event) =>
                                    setRating(
                                        event.target.value
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select Rating
                                </option>

                                <option value="1">
                                    1
                                </option>

                                <option value="1.5">
                                    1.5
                                </option>

                                <option value="2">
                                    2
                                </option>

                                <option value="2.5">
                                    2.5
                                </option>

                                <option value="3">
                                    3
                                </option>

                                <option value="3.5">
                                    3.5
                                </option>

                                <option value="4">
                                    4
                                </option>

                                <option value="4.5">
                                    4.5
                                </option>

                                <option value="5">
                                    5
                                </option>
                            </select>

                        </div>

                        <div className="form-group">

                            <label htmlFor="comment">
                                Comment
                            </label>

                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(event) =>
                                    setComment(
                                        event.target.value
                                    )
                                }
                                placeholder="Share your experience with this mentor"
                                rows="5"
                            />

                        </div>

                        <button type="submit">
                            Submit Review
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedSession(null)
                            }
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            )}

        </div>
    );
}

export default StudentSessions;