import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

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

                    <Route
                        path="/student/dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/mentor/dashboard"
                        element={<MentorDashboard />}
                    />

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;