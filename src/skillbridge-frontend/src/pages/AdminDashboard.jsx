import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");

    // Users state
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Reports state
    const [reports, setReports] = useState([]);
    const [reportsFilter, setReportsFilter] = useState("pending");
    const [loadingReports, setLoadingReports] = useState(false);

    // Analytics state
    const [userStats, setUserStats] = useState(null);
    const [popularSkills, setPopularSkills] = useState([]);
    const [platformActivity, setPlatformActivity] = useState(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (activeTab === "reports") {
            getReports(reportsFilter);
        } else if (activeTab === "analytics") {
            getAnalytics();
        }
    }, [activeTab]);

    const getUsers = async () => {
        setLoadingUsers(true);
        setError("");

        try {
            const response = await api.get("/admin/users");
            setUsers(response.data.data || []);
        } catch (err) {
            console.error(
                "Error fetching users:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                "Unable to load users."
            );
        } finally {
            setLoadingUsers(false);
        }
    };

    const getReports = async (filterType = reportsFilter) => {
        setLoadingReports(true);
        setError("");

        try {
            const endpoint = filterType === "pending" ? "/reports/pending" : "/reports";
            const response = await api.get(endpoint);
            setReports(response.data.data || []);
        } catch (err) {
            console.error(
                "Error fetching reports:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                "Unable to load reports."
            );
        } finally {
            setLoadingReports(false);
        }
    };

    const getAnalytics = async () => {
        setLoadingAnalytics(true);
        setError("");

        try {
            const [usersRes, skillsRes, activityRes] = await Promise.all([
                api.get("/analytics/users"),
                api.get("/analytics/skills"),
                api.get("/analytics/activity")
            ]);

            setUserStats(usersRes.data.data || null);
            setPopularSkills(skillsRes.data.data || []);
            setPlatformActivity(activityRes.data.data || null);
        } catch (err) {
            console.error(
                "Error fetching analytics:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                "Unable to load platform analytics."
            );
        } finally {
            setLoadingAnalytics(false);
        }
    };

    // User moderation actions
    const handleVerify = async (id) => {
        setActionMessage("");
        try {
            await api.patch(`/admin/users/${id}/verify`);
            setActionMessage("User verified successfully.");
            getUsers();
        } catch (err) {
            console.error("Error verifying user:", err);
            setActionMessage(err.response?.data?.message || "Unable to verify user.");
        }
    };

    const handleSuspend = async (id) => {
        setActionMessage("");
        try {
            await api.patch(`/admin/users/${id}/suspend`);
            setActionMessage("User account suspended successfully.");
            getUsers();
        } catch (err) {
            console.error("Error suspending user:", err);
            setActionMessage(err.response?.data?.message || "Unable to suspend user.");
        }
    };

    const handleActivate = async (id) => {
        setActionMessage("");
        try {
            await api.patch(`/admin/users/${id}/activate`);
            setActionMessage("User account activated successfully.");
            getUsers();
        } catch (err) {
            console.error("Error activating user:", err);
            setActionMessage(err.response?.data?.message || "Unable to activate user.");
        }
    };

    const handleRemove = async (id) => {
        const confirmed = window.confirm("Are you sure you want to remove this user?");
        if (!confirmed) return;

        setActionMessage("");
        try {
            await api.delete(`/admin/users/${id}`);
            setActionMessage("User account removed successfully.");
            getUsers();
        } catch (err) {
            console.error("Error removing user:", err);
            setActionMessage(err.response?.data?.message || "Unable to remove user.");
        }
    };

    // Report moderation actions
    const handleSuspendUserViaReport = async (reportId) => {
        const confirmed = window.confirm("Are you sure you want to suspend this reported user?");
        if (!confirmed) return;

        setActionMessage("");
        try {
            await api.patch(`/reports/${reportId}`, {
                status: "resolved",
                action: "suspended"
            });
            setActionMessage("User suspended and report resolved.");
            getReports(reportsFilter);
            getUsers();
        } catch (err) {
            console.error("Error suspending reported user:", err);
            setActionMessage(err.response?.data?.message || "Unable to handle report.");
        }
    };

    const handleDismissReport = async (reportId) => {
        setActionMessage("");
        try {
            await api.patch(`/reports/${reportId}/dismiss`);
            setActionMessage("Report dismissed.");
            getReports(reportsFilter);
        } catch (err) {
            console.error("Error dismissing report:", err);
            setActionMessage(err.response?.data?.message || "Unable to dismiss report.");
        }
    };

    const handleRemoveContentViaReport = async (reportId) => {
        const confirmed = window.confirm("Are you sure you want to remove the reported entity?");
        if (!confirmed) return;

        setActionMessage("");
        try {
            await api.patch(`/reports/${reportId}`, {
                status: "resolved",
                action: "removed"
            });
            setActionMessage("Reported entity removed and report resolved.");
            getReports(reportsFilter);
            getUsers();
        } catch (err) {
            console.error("Error removing content via report:", err);
            setActionMessage(err.response?.data?.message || "Unable to remove reported content.");
        }
    };

    // User statistics calculations
    const totalUsers = users.length;
    const totalStudents = users.filter((user) => user.role === "Student").length;
    const totalMentors = users.filter((user) => user.role === "Mentor").length;
    const totalUnverified = users.filter((user) => !user.isVerified).length;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Admin Dashboard</h1>
                <p>Manage SkillBridge users, review moderation reports, and view platform analytics.</p>
            </div>

            {error && <p className="error-message">{error}</p>}
            {actionMessage && <p className="success-message">{actionMessage}</p>}

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "2px solid #e5e7eb", paddingBottom: "12px", flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={() => setActiveTab("users")}
                    style={{
                        backgroundColor: activeTab === "users" ? "#1e3a8a" : "#f3f4f6",
                        color: activeTab === "users" ? "#ffffff" : "#374151",
                        fontWeight: activeTab === "users" ? "bold" : "normal"
                    }}
                >
                    User Management
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("reports")}
                    style={{
                        backgroundColor: activeTab === "reports" ? "#1e3a8a" : "#f3f4f6",
                        color: activeTab === "reports" ? "#ffffff" : "#374151",
                        fontWeight: activeTab === "reports" ? "bold" : "normal"
                    }}
                >
                    Reports Moderation
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("analytics")}
                    style={{
                        backgroundColor: activeTab === "analytics" ? "#1e3a8a" : "#f3f4f6",
                        color: activeTab === "analytics" ? "#ffffff" : "#374151",
                        fontWeight: activeTab === "analytics" ? "bold" : "normal"
                    }}
                >
                    Platform Analytics
                </button>
            </div>

            {/* TAB 1: USERS */}
            {activeTab === "users" && (
                <>
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

                    <div className="profile-card">
                        <h2>User Management</h2>

                        {loadingUsers ? (
                            <p>Loading users...</p>
                        ) : users.length === 0 ? (
                            <p>No users found.</p>
                        ) : (
                            users.map((user) => (
                                <div className="skill-card" key={user._id}>
                                    <h3>{user.name}</h3>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Department:</strong> {user.department}</p>
                                    <p><strong>Academic Year:</strong> {user.academicYear}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                    <p><strong>Verification:</strong> {user.isVerified ? "Verified" : "Not Verified"}</p>
                                    <p><strong>Account Status:</strong> {user.accountStatus}</p>
                                    <p><strong>Registered:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

                                    <div>
                                        {!user.isVerified && user.role !== "Administrator" && (
                                            <button type="button" onClick={() => handleVerify(user._id)}>
                                                Verify
                                            </button>
                                        )}

                                        {user.role !== "Administrator" && user.accountStatus === "active" && (
                                            <button type="button" onClick={() => handleSuspend(user._id)}>
                                                Suspend
                                            </button>
                                        )}

                                        {user.role !== "Administrator" && user.accountStatus === "suspended" && (
                                            <button type="button" onClick={() => handleActivate(user._id)}>
                                                Activate
                                            </button>
                                        )}

                                        {user.role !== "Administrator" && (
                                            <button type="button" onClick={() => handleRemove(user._id)}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* TAB 2: REPORTS */}
            {activeTab === "reports" && (
                <div className="profile-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                        <h2>Reports Moderation</h2>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setReportsFilter("pending");
                                    getReports("pending");
                                }}
                                style={{
                                    backgroundColor: reportsFilter === "pending" ? "#1e3a8a" : "#f3f4f6",
                                    color: reportsFilter === "pending" ? "#ffffff" : "#374151"
                                }}
                            >
                                Pending Reports
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setReportsFilter("all");
                                    getReports("all");
                                }}
                                style={{
                                    backgroundColor: reportsFilter === "all" ? "#1e3a8a" : "#f3f4f6",
                                    color: reportsFilter === "all" ? "#ffffff" : "#374151"
                                }}
                            >
                                All Reports
                            </button>
                        </div>
                    </div>

                    {loadingReports ? (
                        <p>Loading reports...</p>
                    ) : reports.length === 0 ? (
                        <p>No {reportsFilter} reports found.</p>
                    ) : (
                        reports.map((report) => (
                            <div className="skill-card" key={report._id} style={{ borderLeft: report.status === "pending" ? "4px solid #ef4444" : "4px solid #10b981" }}>
                                <h3>Reason: {report.reason}</h3>
                                <p><strong>Status:</strong> <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{report.status}</span></p>
                                <p><strong>Action Taken:</strong> <span style={{ textTransform: "capitalize" }}>{report.action || "None"}</span></p>
                                <p><strong>Reported At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                                <p><strong>Reported By:</strong> {report.reporterId?.name || "Anonymous"} ({report.reporterId?.email})</p>

                                {report.reportedUserId && (
                                    <div style={{ margin: "10px 0", padding: "10px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
                                        <p><strong>Reported User:</strong> {report.reportedUserId.name} ({report.reportedUserId.email})</p>
                                        <p><strong>Role:</strong> {report.reportedUserId.role}</p>
                                        <p><strong>Current Status:</strong> {report.reportedUserId.accountStatus}</p>
                                    </div>
                                )}

                                {report.status === "pending" && (
                                    <div style={{ marginTop: "12px" }}>
                                        {report.reportedUserId && report.reportedUserId.accountStatus !== "suspended" && (
                                            <button
                                                type="button"
                                                onClick={() => handleSuspendUserViaReport(report._id)}
                                                style={{ backgroundColor: "#dc2626", color: "white" }}
                                            >
                                                Suspend User
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveContentViaReport(report._id)}
                                            style={{ backgroundColor: "#b91c1c", color: "white", marginLeft: "8px" }}
                                        >
                                            Remove Entity
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDismissReport(report._id)}
                                            style={{ backgroundColor: "#6b7280", color: "white", marginLeft: "8px" }}
                                        >
                                            Dismiss Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TAB 3: ANALYTICS */}
            {activeTab === "analytics" && (
                <div>
                    {loadingAnalytics ? (
                        <div className="profile-card">
                            <p>Loading analytics...</p>
                        </div>
                    ) : (
                        <>
                            {/* User Analytics */}
                            <div className="profile-card">
                                <h2>User Analytics</h2>
                                {userStats && (
                                    <div className="dashboard-stats">
                                        <div className="stat-card">
                                            <h3>Total Users</h3>
                                            <p>{userStats.totalUsers}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Active Users</h3>
                                            <p>{userStats.activeUsers}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Suspended Users</h3>
                                            <p>{userStats.suspendedUsers}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>New (Last 30 Days)</h3>
                                            <p>{userStats.newUsersLast30Days}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Verified Users</h3>
                                            <p>{userStats.verifiedUsers}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Unverified Users</h3>
                                            <p>{userStats.unverifiedUsers}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Popular Skills */}
                            <div className="profile-card">
                                <h2>Top Demanded Skills</h2>
                                {popularSkills.length === 0 ? (
                                    <p>No skill demand data available yet.</p>
                                ) : (
                                    <div style={{ marginTop: "15px" }}>
                                        {popularSkills.map((skill, index) => (
                                            <div
                                                className="skill-card"
                                                key={skill.skillId || index}
                                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                            >
                                                <div>
                                                    <h3 style={{ margin: 0 }}>#{index + 1} {skill.skillName || "Untitled Skill"}</h3>
                                                    <p style={{ margin: "4px 0 0 0", color: "#6b7280" }}>Category: {skill.category || "General"}</p>
                                                </div>
                                                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1e3a8a" }}>
                                                    {skill.requestCount} requests
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Platform Activity */}
                            <div className="profile-card">
                                <h2>Platform Operational Metrics</h2>
                                {platformActivity && (
                                    <div className="dashboard-stats">
                                        <div className="stat-card">
                                            <h3>Total Requests</h3>
                                            <p>{platformActivity.learningRequests?.total || 0}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Accepted Requests</h3>
                                            <p>{platformActivity.learningRequests?.accepted || 0}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Total Sessions</h3>
                                            <p>{platformActivity.sessions?.total || 0}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Completed Sessions</h3>
                                            <p>{platformActivity.sessions?.completed || 0}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Total Reviews</h3>
                                            <p>{platformActivity.reviews?.total || 0}</p>
                                        </div>
                                        <div className="stat-card">
                                            <h3>Average Rating</h3>
                                            <p>⭐ {platformActivity.reviews?.averageRating ? platformActivity.reviews.averageRating.toFixed(1) : "0.0"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;