import { useEffect, useState } from "react";
import api from "../services/api";

function StudentSessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [selectedSession, setSelectedSession] = useState(null);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);

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

    const handleSubmitReview = async (event) => {
        event.preventDefault();

        if (!selectedSession) {
            return;
        }

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

    const handleCancelReview = () => {
        setSelectedSession(null);
        setRating("");
        setComment("");
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

                                {session.status === "completed" &&
                                    !reviews.some(
                                        (review) =>
                                            review.sessionId?.toString() === session._id
                                    ) && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleReviewClick(session)
                                            }
                                        >
                                            Write Review
                                        </button>
                                )}

                            </div>
                        ))
                    )}

                </div>
            )}

            {selectedSession && (
                <div className="profile-card">
                    <h2>Write Review</h2>

                    <p>
                        <strong>Mentor:</strong>{" "}
                        {selectedSession.mentorId?.name}
                    </p>

                    <p>
                        <strong>Skill:</strong>{" "}
                        {selectedSession.learningRequestId
                            ?.skillId
                            ?.skillName || "Skill"}
                    </p>

                    <form onSubmit={handleSubmitReview}>
                        <div className="form-group">
                            <label htmlFor="rating">
                                Rating
                            </label>

                            <select
                                id="rating"
                                value={rating}
                                onChange={(event) =>
                                    setRating(event.target.value)
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
                                    setComment(event.target.value)
                                }
                                placeholder="Write your feedback..."
                                rows="4"
                            />
                        </div>

                        <button type="submit">
                            Submit Review
                        </button>

                        <button
                            type="button"
                            onClick={handleCancelReview}
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