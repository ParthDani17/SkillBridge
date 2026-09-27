import { useEffect, useState } from "react";
import api from "../services/api";

function MySkills() {
    const [skills, setSkills] = useState([]);

    const [skillName, setSkillName] = useState("");
    const [category, setCategory] = useState("");
    const [proficiencyLevel, setProficiencyLevel] = useState("");

    const [editingSkillId, setEditingSkillId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getSkills();
    }, []);

    const getSkills = async () => {
        try {
            const response = await api.get("/skills/my");

            setSkills(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching skills:",
                error.response?.data || error.message
            );

            setError("Unable to load your skills.");
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setSkillName("");
        setCategory("");
        setProficiencyLevel("");
        setEditingSkillId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!skillName || !category || !proficiencyLevel) {
            setError("Please fill all the fields.");
            return;
        }

        setSaving(true);

        try {
            let response;

            if (editingSkillId) {
                response = await api.put(
                    `/skills/${editingSkillId}`,
                    {
                        skillName,
                        category,
                        proficiencyLevel
                    }
                );
            } else {
                response = await api.post(
                    "/skills",
                    {
                        skillName,
                        category,
                        proficiencyLevel
                    }
                );
            }

            setMessage(response.data.message);

            clearForm();

            await getSkills();
        } catch (error) {
            console.error(
                "Error saving skill:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to save skill."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill) => {
        setSkillName(skill.skillName);
        setCategory(skill.category);
        setProficiencyLevel(skill.proficiencyLevel);

        setEditingSkillId(skill._id);

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (skillId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this skill?"
        );

        if (!confirmDelete) {
            return;
        }

        setMessage("");
        setError("");

        try {
            const response = await api.delete(
                `/skills/${skillId}`
            );

            setMessage(response.data.message);

            await getSkills();
        } catch (error) {
            console.error(
                "Error deleting skill:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete skill."
            );
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <h2>Loading skills...</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>My Skills</h1>
                <p>
                    Add and manage the skills you know.
                </p>
            </div>

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

            <div className="profile-card">
                <h2>
                    {editingSkillId
                        ? "Edit Skill"
                        : "Add New Skill"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="skillName">
                            Skill Name
                        </label>

                        <input
                            type="text"
                            id="skillName"
                            value={skillName}
                            onChange={(event) =>
                                setSkillName(event.target.value)
                            }
                            placeholder="Example: JavaScript"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">
                            Category
                        </label>

                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            placeholder="Example: Programming"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="proficiencyLevel">
                            Proficiency Level
                        </label>

                        <select
                            id="proficiencyLevel"
                            value={proficiencyLevel}
                            onChange={(event) =>
                                setProficiencyLevel(event.target.value)
                            }
                        >
                            <option value="">
                                Select Level
                            </option>

                            <option value="Beginner">
                                Beginner
                            </option>

                            <option value="Intermediate">
                                Intermediate
                            </option>

                            <option value="Advanced">
                                Advanced
                            </option>

                            <option value="Expert">
                                Expert
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingSkillId
                                ? "Update Skill"
                                : "Add Skill"}
                    </button>

                    {editingSkillId && (
                        <button
                            type="button"
                            onClick={clearForm}
                        >
                            Cancel Edit
                        </button>
                    )}

                </form>
            </div>

            <div className="profile-card">
                <h2>Your Skills</h2>

                {skills.length === 0 ? (
                    <p>
                        You haven't added any skills yet.
                    </p>
                ) : (
                    <div>
                        {skills.map((skill) => (
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

                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(skill)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                skill._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default MySkills;