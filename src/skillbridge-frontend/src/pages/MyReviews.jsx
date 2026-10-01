import { useEffect, useState } from "react";
import api from "../services/api";

function MyReviews() {
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        getReviews();
    }, []);

    const getReviews = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/reviews/my");

            setReviews(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching reviews:",
                error.response?.data || error.message
            );

            setError("Unable to load reviews.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) {
            return;
        }

        setActionMessage("");

        try {
            await api.delete(`/reviews/${id}`);

            setActionMessage(
                "Review deleted successfully."
            );

            getReviews();
        } catch (error) {
            console.error(
                "Error deleting review:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to delete review."
            );
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <h2>Loading reviews...</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>My Reviews</h1>

                <p>
                    View the reviews you have submitted to mentors.
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

            {reviews.length === 0 ? (
                <div className="profile-card">
                    <h2>No Reviews Yet</h2>

                    <p>
                        You have not submitted any reviews yet.
                    </p>
                </div>
            ) : (
                reviews.map((review) => (
                    <div
                        className="skill-card"
                        key={review._id}
                    >
                        <h3>
                            {review.mentorId?.name}
                        </h3>

                        <p>
                            <strong>Email:</strong>{" "}
                            {review.mentorId?.email}
                        </p>

                        <p>
                            <strong>Rating:</strong>{" "}
                            ⭐ {review.rating} / 5
                        </p>

                        <p>
                            <strong>Comment:</strong>{" "}
                            {review.comment || "No comment provided"}
                        </p>

                        <p>
                            <strong>Reviewed On:</strong>{" "}
                            {new Date(
                                review.createdAt
                            ).toLocaleDateString()}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                handleDelete(review._id)
                            }
                        >
                            Delete Review
                        </button>
                    </div>
                ))
            )}

        </div>
    );
}

export default MyReviews;