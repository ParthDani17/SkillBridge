import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/admin/users");

            setUsers(response.data.data || []);
        } catch (error) {
            console.error(
                "Error fetching users:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        setActionMessage("");

        try {
            await api.patch(
                `/admin/users/${id}/verify`
            );

            setActionMessage(
                "User verified successfully."
            );

            getUsers();
        } catch (error) {
            console.error(
                "Error verifying user:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to verify user."
            );
        }
    };

    const handleSuspend = async (id) => {
        setActionMessage("");

        try {
            await api.patch(
                `/admin/users/${id}/suspend`
            );

            setActionMessage(
                "User account suspended successfully."
            );

            getUsers();
        } catch (error) {
            console.error(
                "Error suspending user:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to suspend user."
            );
        }
    };

    const handleActivate = async (id) => {
        setActionMessage("");

        try {
            await api.patch(
                `/admin/users/${id}/activate`
            );

            setActionMessage(
                "User account activated successfully."
            );

            getUsers();
        } catch (error) {
            console.error(
                "Error activating user:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to activate user."
            );
        }
    };

    const handleRemove = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this user?"
        );

        if (!confirmed) {
            return;
        }

        setActionMessage("");

        try {
            await api.delete(
                `/admin/users/${id}`
            );

            setActionMessage(
                "User account removed successfully."
            );

            getUsers();
        } catch (error) {
            console.error(
                "Error removing user:",
                error.response?.data || error.message
            );

            setActionMessage(
                error.response?.data?.message ||
                "Unable to remove user."
            );
        }
    };

    const totalUsers = users.length;

    const totalStudents = users.filter(
        (user) => user.role === "Student"
    ).length;

    const totalMentors = users.filter(
        (user) => user.role === "Mentor"
    ).length;

    const totalUnverified = users.filter(
        (user) => !user.isVerified
    ).length;

    if (loading) {
        return (
            <div className="profile-page">
                <h2>Loading admin dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>Admin Dashboard</h1>

                <p>
                    Manage SkillBridge users and accounts.
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

            {/* Statistics */}
            <div className="dashboard-stats">

                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{totalUsers}</p>
                </div>

                <div className="stat-card">
                    <h3>Students</h3>
                    <p>{totalStudents}</p>
                </div>

                <div className="stat-card">
                    <h3>Mentors</h3>
                    <p>{totalMentors}</p>
                </div>

                <div className="stat-card">
                    <h3>Unverified</h3>
                    <p>{totalUnverified}</p>
                </div>

            </div>

            {/* Users */}
            <div className="profile-card">

                <h2>User Management</h2>

                {users.length === 0 ? (
                    <p>
                        No users found.
                    </p>
                ) : (
                    users.map((user) => (
                        <div
                            className="skill-card"
                            key={user._id}
                        >

                            <h3>
                                {user.name}
                            </h3>

                            <p>
                                <strong>Email:</strong>{" "}
                                {user.email}
                            </p>

                            <p>
                                <strong>Department:</strong>{" "}
                                {user.department}
                            </p>

                            <p>
                                <strong>Academic Year:</strong>{" "}
                                {user.academicYear}
                            </p>

                            <p>
                                <strong>Role:</strong>{" "}
                                {user.role}
                            </p>

                            <p>
                                <strong>Verification:</strong>{" "}
                                {user.isVerified
                                    ? "Verified"
                                    : "Not Verified"}
                            </p>

                            <p>
                                <strong>Account Status:</strong>{" "}
                                {user.accountStatus}
                            </p>

                            <p>
                                <strong>Registered:</strong>{" "}
                                {new Date(
                                    user.createdAt
                                ).toLocaleDateString()}
                            </p>

                            <div>

                                {!user.isVerified &&
                                    user.role !== "Administrator" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleVerify(
                                                    user._id
                                                )
                                            }
                                        >
                                            Verify
                                        </button>
                                    )}

                                {user.role !== "Administrator" &&
                                    user.accountStatus === "active" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSuspend(
                                                    user._id
                                                )
                                            }
                                        >
                                            Suspend
                                        </button>
                                    )}

                                {user.role !== "Administrator" &&
                                    user.accountStatus === "suspended" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleActivate(
                                                    user._id
                                                )
                                            }
                                        >
                                            Activate
                                        </button>
                                    )}

                                {user.role !== "Administrator" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemove(
                                                user._id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>
                                )}

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default AdminDashboard;