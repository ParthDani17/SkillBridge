import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Mentors() {
    const [mentors, setMentors] = useState([]);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [availability, setAvailability] = useState("");
    const [minRating, setMinRating] = useState("");
    const [isTopMentors, setIsTopMentors] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async (customFilters = {}) => {
        setLoading(true);
        setError("");

        try {
            const activeFilters = {
                search,
                department,
                academicYear,
                availability,
                minRating,
                sortBy: isTopMentors ? "rating" : undefined,
                ...customFilters
            };

            const params = {};
            if (activeFilters.search?.trim()) params.search = activeFilters.search.trim();
            if (activeFilters.department) params.department = activeFilters.department;
            if (activeFilters.academicYear) params.academicYear = activeFilters.academicYear;
            if (activeFilters.availability) params.availability = activeFilters.availability;
            if (activeFilters.minRating) params.minRating = activeFilters.minRating;
            if (activeFilters.sortBy) params.sortBy = activeFilters.sortBy;

            const response = await api.get("/mentors", { params });
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
        fetchMentors();
    };

    const handleToggleTopMentors = () => {
        const nextState = !isTopMentors;
        setIsTopMentors(nextState);
        fetchMentors({ sortBy: nextState ? "rating" : undefined });
    };

    const handleClear = () => {
        setSearch("");
        setDepartment("");
        setAcademicYear("");
        setAvailability("");
        setMinRating("");
        setIsTopMentors(false);
        fetchMentors({
            search: "",
            department: "",
            academicYear: "",
            availability: "",
            minRating: "",
            sortBy: undefined
        });
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Find a Mentor</h1>
                <p>
                    Find experienced mentors, search by skill or name, and connect for guidance.
                </p>
            </div>

            <div className="profile-card">
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label htmlFor="search">
                            Search by Skill or Mentor Name
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Example: React, Python, or Mentor Name"
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="department">Department</label>
                            <select
                                id="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                <option value="Computer Engineering">Computer Engineering</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics & Communication">Electronics & Communication</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Chemical Engineering">Chemical Engineering</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="academicYear">Academic Year</label>
                            <select
                                id="academicYear"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                            >
                                <option value="">All Years</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="availability">Availability</label>
                            <select
                                id="availability"
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                            >
                                <option value="">Any Availability</option>
                                <option value="Weekdays">Weekdays</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Evenings">Evenings</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="minRating">Minimum Rating</label>
                            <select
                                id="minRating"
                                value={minRating}
                                onChange={(e) => setMinRating(e.target.value)}
                            >
                                <option value="">Any Rating</option>
                                <option value="3">3★ & above</option>
                                <option value="4">4★ & above</option>
                                <option value="4.5">4.5★ & above</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                        <button type="submit">
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            onClick={handleToggleTopMentors}
                            style={{
                                backgroundColor: isTopMentors ? "#f59e0b" : "#E5E5E5",
                                color: isTopMentors ? "#ffffff" : "#1A1A1A",
                                fontWeight: isTopMentors ? "bold" : "normal",
                                border: "1px solid " + (isTopMentors ? "#f59e0b" : "#CBD5E1")
                            }}
                        >
                            {isTopMentors ? "★ Top Mentors (Active)" : "★ Top Mentors"}
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>
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
                        {isTopMentors
                            ? "Top Rated Mentors"
                            : search.trim()
                            ? `Mentors for "${search}"`
                            : "All Mentors"}
                    </h2>

                    {mentors.length === 0 ? (
                        <p>
                            No mentors found matching your criteria.
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
                                    <strong>Rating:</strong>{" "}
                                    {item.profile?.averageRating
                                        ? `⭐ ${item.profile.averageRating.toFixed(1)} / 5 (${item.profile?.totalReviews ?? item.totalReviews ?? 0} reviews)`
                                        : "No ratings yet"}
                                </p>

                                <p>
                                    <strong>Department:</strong>{" "}
                                    {item.mentor.department}
                                </p>

                                <p>
                                    <strong>Academic Year:</strong>{" "}
                                    {item.mentor.academicYear}
                                </p>

                                {item.profile?.bio && (
                                    <p>
                                        <strong>About:</strong>{" "}
                                        {item.profile.bio}
                                    </p>
                                )}

                                {item.profile?.availability && (
                                    <p>
                                        <strong>Availability:</strong>{" "}
                                        {item.profile.availability}
                                    </p>
                                )}

                                <p>
                                    <strong>Skills:</strong>
                                </p>

                                {item.skills && item.skills.length > 0 ? (
                                    <div>
                                        {item.skills.map((mentorSkill) => (
                                            <span key={mentorSkill._id}>
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