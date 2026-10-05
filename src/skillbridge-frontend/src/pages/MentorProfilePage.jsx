import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function MentorProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(user);

    const [bio, setBio] = useState("");
    const [availability, setAvailability] = useState("");
    const [portfolioLink, setPortfolioLink] = useState("");

    const [resume, setResume] = useState(null);
    const [certificate, setCertificate] = useState(null);

    const [existingResume, setExistingResume] = useState("");
    const [existingCertificate, setExistingCertificate] = useState("");

    const [skills, setSkills] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        setLoading(true);
        setError("");

        try {
            const [
                profileResponse,
                skillsResponse,
                reviewsResponse,
                meResponse
            ] = await Promise.all([
                api.get("/profile"),
                api.get("/skills/my"),
                api.get(`/reviews/mentor/${user._id}`),
                api.get("/users/me").catch(() => null)
            ]);

            if (meResponse?.data?.data) {
                setCurrentUser(meResponse.data.data);
            }

            const profile = profileResponse.data.data;

            setBio(profile.bio || "");
            setAvailability(profile.availability || "");
            setPortfolioLink(profile.portfolioLink || "");

            setExistingResume(profile.resume || "");
            setExistingCertificate(profile.certificate || "");

            setAverageRating(profile.averageRating || 0);

            setSkills(skillsResponse.data.data || []);
            setReviews(reviewsResponse.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching mentor profile:",
                error.response?.data || error.message
            );

            if (error.response?.status === 404) {
                console.log("Profile not found.");
            } else {
                setError("Unable to load profile information.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResumeChange = (event) => {
        setResume(event.target.files[0]);
    };

    const handleCertificateChange = (event) => {
        setCertificate(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            const data = new FormData();

            data.append("bio", bio);
            data.append("availability", availability);
            data.append("portfolioLink", portfolioLink);

            if (resume) {
                data.append("resume", resume);
            }

            if (certificate) {
                data.append("certificate", certificate);
            }

            const response = await api.put("/profile", data);

            const profile = response.data.data;

            setExistingResume(profile.resume || "");
            setExistingCertificate(profile.certificate || "");
            setAverageRating(profile.averageRating || 0);

            setResume(null);
            setCertificate(null);

            setMessage("Profile updated successfully.");
        } catch (error) {
            console.error(
                "Error updating mentor profile:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete your account? This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            await api.delete("/profile");
            logout();
            navigate("/login");
        } catch (err) {
            console.error("Error deleting account:", err);
            setError(
                err.response?.data?.message ||
                "Failed to delete account."
            );
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <h2>Loading profile...</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>My Profile</h1>
                <p>
                    Manage your mentor profile and view your feedback.
                </p>
            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {/* Personal Information */}
            <div className="profile-card">
                <h2>Personal Information</h2>

                {currentUser?.profilePicture ? (
                    <div style={{ marginBottom: "20px" }}>
                        <img
                            src={currentUser.profilePicture}
                            alt={currentUser.name || "Profile"}
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

                <div className="profile-info">

                    <p>
                        <strong>Name:</strong> {currentUser?.name || user?.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {currentUser?.email || user?.email}
                    </p>

                    <p>
                        <strong>Department:</strong> {currentUser?.department || user?.department}
                    </p>

                    <p>
                        <strong>Academic Year:</strong> {currentUser?.academicYear || user?.academicYear}
                    </p>

                    <p>
                        <strong>Role:</strong> {currentUser?.role || user?.role}
                    </p>

                </div>
            </div>

            {/* Mentor Statistics */}
            <div className="profile-card">
                <h2>Mentor Statistics</h2>

                <div className="dashboard-stats">

                    <div className="stat-card">
                        <h3>Average Rating</h3>
                        <p>
                            ⭐ {averageRating.toFixed(1)}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Reviews</h3>
                        <p>
                            {reviews.length}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Skills</h3>
                        <p>
                            {skills.length}
                        </p>
                    </div>

                </div>
            </div>

            {/* Profile Details */}
            <div className="profile-card">
                <h2>Profile Details</h2>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="bio">
                            Bio
                        </label>

                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(event) =>
                                setBio(event.target.value)
                            }
                            placeholder="Tell students about yourself"
                            rows="5"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="availability">
                            Availability
                        </label>

                        <input
                            type="text"
                            id="availability"
                            value={availability}
                            onChange={(event) =>
                                setAvailability(event.target.value)
                            }
                            placeholder="Example: Weekdays, 5 PM - 8 PM"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="portfolioLink">
                            Portfolio Link
                        </label>

                        <input
                            type="url"
                            id="portfolioLink"
                            value={portfolioLink}
                            onChange={(event) =>
                                setPortfolioLink(event.target.value)
                            }
                            placeholder="https://your-portfolio.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="resume">
                            Upload Resume
                        </label>

                        <input
                            type="file"
                            id="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeChange}
                        />

                        {existingResume && (
                            <p>
                                <a
                                    href={existingResume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Existing Resume
                                </a>
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="certificate">
                            Upload Certificate
                        </label>

                        <input
                            type="file"
                            id="certificate"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleCertificateChange}
                        />

                        {existingCertificate && (
                            <p>
                                <a
                                    href={existingCertificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Existing Certificate
                                </a>
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>

                </form>
            </div>

            {/* My Skills */}
            <div className="profile-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h2>My Skills</h2>
                    <Link to="/mentor/skills" className="dashboard-action" style={{ padding: "8px 16px", textDecoration: "none" }}>
                        Manage Skills
                    </Link>
                </div>

                {skills.length === 0 ? (
                    <p>
                        You have not added any skills yet.
                    </p>
                ) : (
                    skills.map((skill) => (
                        <div
                            className="skill-card"
                            key={skill._id}
                        >
                            <h3>{skill.skillName}</h3>

                            <p>
                                <strong>Category:</strong>{" "}
                                {skill.category}
                            </p>

                            <p>
                                <strong>Proficiency:</strong>{" "}
                                {skill.proficiencyLevel}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Student Reviews */}
            <div className="profile-card">
                <h2>Student Reviews</h2>

                {reviews.length === 0 ? (
                    <p>
                        You have not received any reviews yet.
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
                                <strong>Student:</strong>{" "}
                                {review.studentId?.name}
                            </p>

                            <p>
                                <strong>Comment:</strong>{" "}
                                {review.comment || "No comment provided"}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="profile-card" style={{ borderTop: "2px solid #8B0000" }}>
                <h2>Danger Zone</h2>
                <p>Permanently delete your account and all associated profile data.</p>
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    style={{ backgroundColor: "#8B0000", color: "#fff", marginTop: "10px" }}
                >
                    Delete Account
                </button>
            </div>

        </div>
    );
}

export default MentorProfilePage;