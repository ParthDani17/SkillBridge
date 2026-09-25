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

                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
                        <Route
                            path="/mentor/dashboard"
                            element={<MentorDashboard />}
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