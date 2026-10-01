import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfile from "./pages/StudentProfile";
import MySkills from "./pages/MySkills";
import Mentors from "./pages/Mentors";
import MentorProfile from "./pages/MentorProfile";
import LearningRequests from "./pages/LearningRequests";
import MentorRequests from "./pages/MentorRequests";
import StudentSessions from "./pages/StudentSessions";
import MentorSessions from "./pages/MentorSessions";
import Notifications from "./pages/Notifications";
import MyReviews from "./pages/MyReviews";

function App() {
    return (
        <BrowserRouter>

            <AuthProvider>

                <Navbar />

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>

                        <Route
                            path="/student/dashboard"
                            element={<StudentDashboard />}
                        />

                        <Route
                            path="/student/profile"
                            element={<StudentProfile />}
                        />

                        <Route
                            path="/student/skills"
                            element={<MySkills />}
                        />

                        <Route
                            path="/student/mentors"
                            element={<Mentors />}
                        />

                        <Route
                            path="/student/mentors/:id"
                            element={<MentorProfile />}
                        />

                        <Route
                            path="/student/requests"
                            element={<LearningRequests />}
                        />

                        <Route
                            path="/student/sessions"
                            element={<StudentSessions />}
                        />

                        <Route
                            path="/student/notifications"
                            element={<Notifications />}
                        />

                        <Route
                            path="/student/reviews"
                            element={<MyReviews />}
                        />

                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
                        <Route
                            path="/mentor/dashboard"
                            element={<MentorDashboard />}
                        />

                        <Route
                            path="/mentor/requests"
                            element={<MentorRequests />}
                        />

                        <Route
                            path="/mentor/sessions"
                            element={<MentorSessions />}
                        />

                        <Route
                            path="/mentor/notifications"
                            element={<Notifications />}
                        />

                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["Administrator"]} />}>
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />
                    </Route>

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;