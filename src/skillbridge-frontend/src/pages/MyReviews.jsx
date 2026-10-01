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

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>My Reviews</h1>

                <p>
                    View the reviews you have submitted.
                </p>
            </div>

            {loading && (
                <div className="profile-card">
                    <h2>Loading reviews...</h2>
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
                    <h2>Your Reviews</h2>

                    {reviews.length === 0 ? (
                        <p>
                            You have not written any reviews yet.
                        </p>
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
                                    <strong>Rating:</strong>{" "}
                                    {review.rating} / 5
                                </p>

                                <p>
                                    <strong>Comment:</strong>{" "}
                                    {review.comment ||
                                        "No comment"}
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
                                        handleDelete(
                                            review._id
                                        )
                                    }
                                >
                                    Delete Review
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default MyReviews;