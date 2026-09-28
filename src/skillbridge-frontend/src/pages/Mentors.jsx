import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Mentors() {
    const [mentors, setMentors] = useState([]);

    const [skill, setSkill] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getMentors();
    }, []);

    const getMentors = async (skillName = "") => {
        setLoading(true);
        setError("");

        try {
            let response;

            if (skillName.trim()) {
                response = await api.get(
                    `/mentors?skill=${encodeURIComponent(skillName)}`
                );
            } else {
                response = await api.get("/mentors");
            }

            setMentors(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching mentors:",
                error.response?.data || error.message
            );

            setError("Unable to load mentors.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();

        getMentors(skill);
    };

    const handleClear = () => {
        setSkill("");
        getMentors("");
    };

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>Find a Mentor</h1>

                <p>
                    Find experienced mentors and learn new skills.
                </p>
            </div>

            <div className="profile-card">
                <form onSubmit={handleSearch}>

                    <div className="form-group">
                        <label htmlFor="skill">
                            Search by Skill
                        </label>

                        <input
                            type="text"
                            id="skill"
                            value={skill}
                            onChange={(event) =>
                                setSkill(event.target.value)
                            }
                            placeholder="Example: JavaScript"
                        />
                    </div>

                    <button type="submit">
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                    >
                        Clear
                    </button>

                </form>
            </div>

            {loading && (
                <div className="profile-card">
                    <h2>Loading mentors...</h2>
                </div>
            )}

            {error && (
                <div className="profile-card">
                    <p className="error-message">
                        {error}
                    </p>
                </div>
            )}

            {!loading && !error && (
                <div className="profile-card">

                    <h2>
                        {skill.trim()
                            ? `Mentors for "${skill}"`
                            : "All Mentors"}
                    </h2>

                    {mentors.length === 0 ? (
                        <p>
                            No mentors found.
                        </p>
                    ) : (
                        mentors.map((item) => (
                            <div
                                className="skill-card"
                                key={item.mentor._id}
                            >

                                <h3>
                                    {item.mentor.name}
                                </h3>

                                <p>
                                    <strong>
                                        Department:
                                    </strong>{" "}
                                    {item.mentor.department}
                                </p>

                                <p>
                                    <strong>
                                        Academic Year:
                                    </strong>{" "}
                                    {item.mentor.academicYear}
                                </p>

                                {item.profile?.bio && (
                                    <p>
                                        <strong>
                                            About:
                                        </strong>{" "}
                                        {item.profile.bio}
                                    </p>
                                )}

                                {item.profile?.availability && (
                                    <p>
                                        <strong>
                                            Availability:
                                        </strong>{" "}
                                        {item.profile.availability}
                                    </p>
                                )}

                                <p>
                                    <strong>
                                        Skills:
                                    </strong>
                                </p>

                                {item.skills &&
                                item.skills.length > 0 ? (
                                    <div>
                                        {item.skills.map((mentorSkill) => (
                                            <span
                                                key={mentorSkill._id}
                                            >
                                                {mentorSkill.skillName}{" "}
                                                ({mentorSkill.proficiencyLevel})
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p>
                                        No skills added yet.
                                    </p>
                                )}

                                <Link
                                    to={`/student/mentors/${item.mentor._id}`}
                                >
                                    View Profile
                                </Link>

                            </div>
                        ))
                    )}

                </div>
            )}

        </div>
    );
}

export default Mentors;