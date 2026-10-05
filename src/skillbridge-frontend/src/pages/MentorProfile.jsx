import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function MentorProfile() {
    const { id } = useParams();

    const [mentor, setMentor] = useState(null);
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [selectedSkill, setSelectedSkill] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requestMessage, setRequestMessage] = useState("");

    const [showReportForm, setShowReportForm] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [reportSubmitting, setReportSubmitting] = useState(false);

    useEffect(() => {
        getMentorData();
    }, [id]);

    const getMentorData = async () => {
        setLoading(true);
        setError("");

        try {
            const [
                mentorResponse,
                reviewsResponse
            ] = await Promise.all([
                api.get(`/mentors/${id}`),
                api.get(`/reviews/mentor/${id}`)
            ]);

            const mentorData = mentorResponse.data.data;

            setMentor(mentorData.mentor);
            setProfile(mentorData.profile);
            setSkills(mentorData.skills || []);

            setReviews(
                reviewsResponse.data.data || []
            );
        } catch (error) {
            console.error(
                "Error fetching mentor profile:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load mentor profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (event) => {
        event.preventDefault();

        setRequestMessage("");

        if (!selectedSkill) {
            setRequestMessage(
                "Please select a skill."
            );
            return;
        }

        try {
            await api.post("/learning-requests", {
                mentorId: mentor._id,
                skillId: selectedSkill,
                message
            });

            setRequestMessage(
                "Learning request sent successfully."
            );

            setSelectedSkill("");
            setMessage("");
        } catch (error) {
            console.error(
                "Error sending learning request:",
                error.response?.data || error.message
            );

            setRequestMessage(
                error.response?.data?.message ||
                "Unable to send learning request."
            );
        }
    };

    const handleReportSubmit = async (event) => {
        event.preventDefault();
        if (!reportReason.trim()) return;

        setReportSubmitting(true);
        setReportMessage("");

        try {
            await api.post("/reports", {
                reportedUserId: mentor._id,
                reason: reportReason.trim(),
                contentType: "User"
            });
            setReportMessage("Report submitted successfully. Administrators will review it.");
            setReportReason("");
            setShowReportForm(false);
        } catch (err) {
            console.error("Error submitting report:", err);
            setReportMessage(
                err.response?.data?.message || "Failed to submit report."
            );
        } finally {
            setReportSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <h2>Loading mentor profile...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <p className="error-message">
                    {error}
                </p>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="profile-page">
                <h2>Mentor not found.</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* Header */}
            <div className="profile-header">
                <h1>{mentor.name}</h1>

                <p>
                    Mentor Profile
                </p>
            </div>

            {/* Basic Information */}
            <div className="profile-card">

                <h2>Personal Information</h2>

                {mentor.profilePicture ? (
                    <div style={{ marginBottom: "20px" }}>
                        <img
                            src={mentor.profilePicture}
                            alt={mentor.name || "Mentor"}
                            style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "3px solid #2C2C2C",
                                display: "block"
                            }}
                        />
                    </div>
                ) : null}

                <p>
                    <strong>Email:</strong>{" "}
                    {mentor.email}
                </p>

                <p>
                    <strong>Department:</strong>{" "}
                    {mentor.department}
                </p>

                <p>
                    <strong>Academic Year:</strong>{" "}
                    {mentor.academicYear}
                </p>

            </div>

            {/* Rating */}
            <div className="profile-card">

                <h2>Mentor Rating</h2>

                <div className="dashboard-stats">

                    <div className="stat-card">
                        <h3>Average Rating</h3>

                        <p>
                            ⭐{" "}
                            {profile?.averageRating
                                ? profile.averageRating.toFixed(1)
                                : "0.0"}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Reviews</h3>

                        <p>
                            {reviews.length}
                        </p>
                    </div>

                </div>

            </div>

            {/* About Mentor */}
            <div className="profile-card">

                <h2>About the Mentor</h2>

                <p>
                    <strong>Bio:</strong>{" "}
                    {profile?.bio ||
                        "No bio available."}
                </p>

                <p>
                    <strong>Availability:</strong>{" "}
                    {profile?.availability ||
                        "Not specified."}
                </p>

                {profile?.portfolioLink && (
                    <p>
                        <strong>Portfolio:</strong>{" "}
                        <a
                            href={profile.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Portfolio
                        </a>
                    </p>
                )}

            </div>

            {/* Skills */}
            <div className="profile-card">

                <h2>Skills</h2>

                {skills.length === 0 ? (
                    <p>
                        This mentor has not added
                        any skills yet.
                    </p>
                ) : (
                    skills.map((skill) => (
                        <div
                            className="skill-card"
                            key={skill._id}
                        >
                            <h3>
                                {skill.skillName}
                            </h3>

                            <p>
                                <strong>
                                    Category:
                                </strong>{" "}
                                {skill.category}
                            </p>

                            <p>
                                <strong>
                                    Proficiency:
                                </strong>{" "}
                                {skill.proficiencyLevel}
                            </p>
                        </div>
                    ))
                )}

            </div>

            {/* Reviews */}
            <div className="profile-card">

                <h2>Student Reviews</h2>

                {reviews.length === 0 ? (
                    <p>
                        No reviews yet.
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div
                            className="skill-card"
                            key={review._id}
                        >
                            <h3>
                                ⭐ {review.rating} / 5
                            </h3>

                            <p>
                                <strong>
                                    Student:
                                </strong>{" "}
                                {review.studentId?.name}
                            </p>

                            <p>
                                <strong>
                                    Comment:
                                </strong>{" "}
                                {review.comment ||
                                    "No comment provided."}
                            </p>

                            <p>
                                <strong>
                                    Date:
                                </strong>{" "}
                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                )}

            </div>

            {/* Send Learning Request */}
            <div className="profile-card">

                <h2>Send Learning Request</h2>

                {requestMessage && (
                    <p className="success-message">
                        {requestMessage}
                    </p>
                )}

                <form onSubmit={handleSendRequest}>

                    <div className="form-group">

                        <label htmlFor="skill">
                            Select Skill
                        </label>

                        <select
                            id="skill"
                            value={selectedSkill}
                            onChange={(event) =>
                                setSelectedSkill(
                                    event.target.value
                                )
                            }
                            required
                        >
                            <option value="">
                                Select a skill
                            </option>

                            {skills.map((skill) => (
                                <option
                                    key={skill._id}
                                    value={skill._id}
                                >
                                    {skill.skillName} -{" "}
                                    {skill.proficiencyLevel}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="message">
                            Message
                        </label>

                        <textarea
                            id="message"
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            placeholder="Tell the mentor what you would like to learn."
                            rows="5"
                        />

                    </div>

                    <button type="submit">
                        Send Learning Request
                    </button>

                </form>

            </div>

            {/* Report Mentor */}
            <div className="profile-card" style={{ border: "1px solid #D1C7BD" }}>
                <h2>Report Inappropriate Behavior</h2>
                <p>
                    If you encounter inappropriate behavior or content from this mentor, please report it to platform administrators.
                </p>

                {reportMessage && (
                    <p style={{
                        color: reportMessage.includes("successfully") ? "#556B2F" : "#8B0000",
                        margin: "12px 0",
                        fontWeight: "500"
                    }}>
                        {reportMessage}
                    </p>
                )}

                {!showReportForm ? (
                    <button
                        type="button"
                        onClick={() => setShowReportForm(true)}
                        style={{
                            backgroundColor: "#8B0000",
                            color: "white",
                            marginTop: "10px"
                        }}
                    >
                        Report Mentor
                    </button>
                ) : (
                    <form onSubmit={handleReportSubmit} style={{ marginTop: "15px" }}>
                        <div className="form-group">
                            <label htmlFor="reportReason">
                                Reason for Reporting
                            </label>
                            <textarea
                                id="reportReason"
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Describe the issue or violation..."
                                rows="4"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={reportSubmitting}
                            style={{
                                backgroundColor: "#8B0000",
                                color: "white"
                            }}
                        >
                            {reportSubmitting ? "Submitting..." : "Submit Report"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowReportForm(false);
                                setReportReason("");
                            }}
                            style={{
                                marginLeft: "10px",
                                backgroundColor: "#708090",
                                color: "white"
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>

        </div>
    );
}

export default MentorProfile;