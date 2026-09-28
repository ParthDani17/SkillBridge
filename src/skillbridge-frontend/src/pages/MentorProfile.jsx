import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function MentorProfile() {
    const { id } = useParams();

    const [mentor, setMentor] = useState(null);
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getMentorProfile();
    }, [id]);

    const getMentorProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/mentors/${id}`);

            const data = response.data.data;

            setMentor(data.mentor);
            setProfile(data.profile);
            setSkills(data.skills || []);
        } catch (error) {
            console.error(
                "Error fetching mentor profile:",
                error.response?.data || error.message
            );

            setError("Unable to load mentor profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <h2>Loading mentor profile...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <p className="error-message">{error}</p>

                    <Link to="/student/mentors">
                        Back to Mentors
                    </Link>
                </div>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <p>Mentor not found.</p>

                    <Link to="/student/mentors">
                        Back to Mentors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>{mentor.name}</h1>
                <p>Mentor Profile</p>
            </div>

            <div className="profile-card">

                <h2>Basic Information</h2>

                <p>
                    <strong>Name:</strong> {mentor.name}
                </p>

                <p>
                    <strong>Email:</strong> {mentor.email}
                </p>

                <p>
                    <strong>Department:</strong> {mentor.department}
                </p>

                <p>
                    <strong>Academic Year:</strong> {mentor.academicYear}
                </p>

            </div>

            <div className="profile-card">

                <h2>About</h2>

                {profile?.bio ? (
                    <p>{profile.bio}</p>
                ) : (
                    <p>No bio added yet.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Availability</h2>

                {profile?.availability ? (
                    <p>{profile.availability}</p>
                ) : (
                    <p>Availability not provided.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Skills</h2>

                {skills.length === 0 ? (
                    <p>No skills added yet.</p>
                ) : (
                    <div>
                        {skills.map((skill) => (
                            <span
                                className="skill-tag"
                                key={skill._id}
                            >
                                {skill.skillName} - {skill.proficiencyLevel}
                            </span>
                        ))}
                    </div>
                )}

            </div>

            <div className="profile-card">

                <h2>Portfolio</h2>

                {profile?.portfolioLink ? (
                    <a
                        href={profile.portfolioLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Portfolio
                    </a>
                ) : (
                    <p>No portfolio link provided.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Rating</h2>

                <p>
                    <strong>Average Rating:</strong>{" "}
                    {profile?.averageRating ?? 0}
                </p>

            </div>

            <div className="profile-card">

                <Link to="/student/mentors">
                    ← Back to Mentors
                </Link>

            </div>

        </div>
    );
}

export default MentorProfile;