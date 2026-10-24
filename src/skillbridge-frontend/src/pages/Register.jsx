import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { DEPARTMENTS } from "../constants/departments.js";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        academicYear: "",
        role: "Student"
    });

    const [profilePicture, setProfilePicture] = useState(null);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {

        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        setLoading(true);

        try {

            const data = new FormData();

            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("department", formData.department);
            data.append("academicYear", formData.academicYear);
            data.append("role", formData.role);

            if (profilePicture) {
                data.append("profilePicture", profilePicture);
            }

            const response = await api.post(
                "/users/register",
                data
            );

            setMessage(
                response.data.message ||
                "Registration successful"
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                department: "",
                academicYear: "",
                role: "Student"
            });

            setProfilePicture(null);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <h1>Create Account</h1>

                <p>
                    Join SkillBridge and start learning.
                </p>

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

                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. yourname@example.com"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="department">
                            Department
                        </label>

                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="academicYear">
                            Academic Year
                        </label>

                        <select
                            id="academicYear"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Academic Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                            <option value="5">5th Year</option>
                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="role">
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >

                            <option value="Student">
                                Student
                            </option>

                            <option value="Mentor">
                                Mentor
                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="profilePicture">
                            Profile Picture
                        </label>

                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? "Registering..." : "Register"}

                    </button>

                </form>

                <p className="login-link">

                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;