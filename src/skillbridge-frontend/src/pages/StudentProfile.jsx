
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function StudentProfile() {
    const { user } = useAuth();

    const [bio, setBio] = useState("");
    const [availability, setAvailability] = useState("");
    const [portfolioLink, setPortfolioLink] = useState("");

    const [resume, setResume] = useState(null);
    const [certificate, setCertificate] = useState(null);

    const [existingResume, setExistingResume] = useState("");
    const [existingCertificate, setExistingCertificate] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await api.get("/profile");

                const profile = response.data.data;

                setBio(profile.bio || "");
                setAvailability(profile.availability || "");
                setPortfolioLink(profile.portfolioLink || "");

                setExistingResume(profile.resume || "");
                setExistingCertificate(profile.certificate || "");
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log("Profile not found. A new profile will be created.");
                } else {
                    console.error(
                        "Error fetching profile:",
                        error.response?.data || error.message
                    );

                    setError("Unable to load profile information.");
                }
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, []);

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

            setResume(null);
            setCertificate(null);

            setMessage("Profile updated successfully.");
        } catch (error) {
            console.error(
                "Error updating profile:",
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
                <p>Manage your SkillBridge profile information.</p>
            </div>

            <div className="profile-card">
                <h2>Personal Information</h2>

                <div className="profile-info">
                    <p>
                        <strong>Name:</strong> {user?.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>

                    <p>
                        <strong>Department:</strong> {user?.department}
                    </p>

                    <p>
                        <strong>Academic Year:</strong> {user?.academicYear}
                    </p>

                    <p>
                        <strong>Role:</strong> {user?.role}
                    </p>
                </div>
            </div>

            <div className="profile-card">
                <h2>Profile Details</h2>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
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
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Tell others about yourself"
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
        </div>
    );
}

export default StudentProfile;