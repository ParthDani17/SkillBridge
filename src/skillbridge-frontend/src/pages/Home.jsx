import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="home-page">

            <section className="hero-section">

                <h1>
                    Welcome to SkillBridge
                </h1>

                <p>
                    Learn from peers, share your knowledge,
                    and grow together.
                </p>

                <div className="hero-buttons">

                    {!isAuthenticated && (
                        <>
                            <Link to="/register">
                                Get Started
                            </Link>

                            <Link to="/login">
                                Login
                            </Link>
                        </>
                    )}

                    {isAuthenticated && (
                        <>
                            {user.role === "Student" && (
                                <Link to="/student/dashboard">
                                    Go to Dashboard
                                </Link>
                            )}

                            {user.role === "Mentor" && (
                                <Link to="/mentor/dashboard">
                                    Go to Dashboard
                                </Link>
                            )}

                            {user.role === "Administrator" && (
                                <Link to="/admin/dashboard">
                                    Go to Dashboard
                                </Link>
                            )}
                        </>
                    )}

                </div>

            </section>

            <section className="features-section">

                <h2>
                    What SkillBridge Offers
                </h2>

                <div className="features-container">

                    <div className="feature-card">
                        <h3>Learn New Skills</h3>
                        <p>
                            Connect with mentors and learn
                            skills from other students.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Share Your Knowledge</h3>
                        <p>
                            Become a mentor and help others
                            improve their skills.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Track Your Progress</h3>
                        <p>
                            Manage learning requests,
                            sessions, and reviews.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;