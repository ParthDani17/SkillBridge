import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="home-page">

            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="hero-badge-wrap">
                    <span className="hero-badge">
                        🎓 Dharmsinh Desai University • Peer Mentorship Network
                    </span>
                </div>

                <div className="hero-brand-spotlight">
                    <h1 className="hero-brand-name">
                        <span className="brand-primary">Skill</span>
                        <span className="brand-accent">Bridge</span>
                    </h1>
                    <div className="hero-brand-divider"></div>
                </div>

                <h2 className="hero-tagline">
                    Bridge the Gap Between Curiosity and Mastery
                </h2>

                <p className="hero-description">
                    Connect directly with experienced senior peers at Dharmsinh Desai University. 
                    Master technical concepts, tackle real-world projects, and accelerate your academic growth together.
                </p>

                <div className="hero-buttons">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/register">
                                Get Started Free
                            </Link>

                            <Link to="/login" className="secondary-btn">
                                Sign In to SkillBridge
                            </Link>
                        </>
                    ) : (
                        <>
                            {user.role === "Student" && (
                                <>
                                    <Link to="/student/dashboard">
                                        Go to Dashboard
                                    </Link>
                                    <Link to="/student/mentors" className="secondary-btn">
                                        Browse Mentors
                                    </Link>
                                </>
                            )}

                            {user.role === "Mentor" && (
                                <>
                                    <Link to="/mentor/dashboard">
                                        Go to Dashboard
                                    </Link>
                                    <Link to="/mentor/requests" className="secondary-btn">
                                        View Learning Requests
                                    </Link>
                                </>
                            )}

                            {user.role === "Administrator" && (
                                <Link to="/admin/dashboard">
                                    Go to Admin Dashboard
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="hero-stats-banner">
                    <div className="hero-stat-item">
                        <div className="hero-stat-number">100%</div>
                        <div className="hero-stat-label">Campus Verified (@ddu.ac.in)</div>
                    </div>
                    <div className="hero-stat-item">
                        <div className="hero-stat-number">1-on-1</div>
                        <div className="hero-stat-label">Personalized Peer Sessions</div>
                    </div>
                    <div className="hero-stat-item">
                        <div className="hero-stat-number">5.0 ★</div>
                        <div className="hero-stat-label">Transparent Peer Reviews</div>
                    </div>
                    <div className="hero-stat-item">
                        <div className="hero-stat-number">0 ₹</div>
                        <div className="hero-stat-label">Free Student Collaboration</div>
                    </div>
                </div>
            </section>

            {/* 2. How It Works Section */}
            <section className="home-section">
                <div className="section-header">
                    <h2>How SkillBridge Works</h2>
                    <p>A simple, streamlined process designed to help you connect, collaborate, and learn efficiently.</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Discover Mentors</h3>
                        <p>Search verified student mentors by expertise, programming language, department, and genuine peer ratings.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Send a Request</h3>
                        <p>Submit a focused learning request highlighting the specific topics or coding challenges you want help with.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>1-on-1 Sessions</h3>
                        <p>Coordinate online or campus-based interactive sessions tailored to your schedule and learning pace.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <h3>Review & Grow</h3>
                        <p>Leave constructive reviews and ratings to celebrate top mentors and help fellow peers find the best guides.</p>
                    </div>
                </div>
            </section>

            {/* 3. Core Features Grid */}
            <section className="home-section" style={{ paddingTop: 0 }}>
                <div className="section-header">
                    <h2>Built for Academic Excellence</h2>
                    <p>Every tool you need to succeed as a learner or make an impact as a student mentor.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-box">
                        <span className="feature-icon-badge">🎯</span>
                        <h3>Precision Skill Search</h3>
                        <p>Filter by technical discipline, minimum star ratings (3★+, 4★+, 4.5★+), or search directly by mentor name or technology stack.</p>
                    </div>

                    <div className="feature-box">
                        <span className="feature-icon-badge">📅</span>
                        <h3>Interactive Scheduling</h3>
                        <p>Manage session states with full control—request rescheduling, track confirmation, and mark milestones as completed.</p>
                    </div>

                    <div className="feature-box">
                        <span className="feature-icon-badge">⭐</span>
                        <h3>Verified Peer Reviews</h3>
                        <p>Gain confidence through transparent, verified feedback from peers who have completed actual mentorship sessions.</p>
                    </div>

                    <div className="feature-box">
                        <span className="feature-icon-badge">🔔</span>
                        <h3>Live Notifications</h3>
                        <p>Receive instant updates the moment your learning request is approved, scheduled, completed, or reviewed.</p>
                    </div>

                    <div className="feature-box">
                        <span className="feature-icon-badge">🛡️</span>
                        <h3>Campus-Only Safety</h3>
                        <p>Protected by DDU domain verification, secure password hashing, and active administrative moderation for a trusted environment.</p>
                    </div>

                    <div className="feature-box">
                        <span className="feature-icon-badge">🚀</span>
                        <h3>Mentor Leadership</h3>
                        <p>Stand out in your department, reinforce your own subject mastery, and gain campus recognition by empowering fellow students.</p>
                    </div>
                </div>
            </section>

            {/* 4. Popular Mentorship Domains */}
            <section className="home-section" style={{ paddingTop: 0 }}>
                <div className="section-header">
                    <h2>Popular Mentorship Domains</h2>
                    <p>Find peer guidance across all major computing and engineering tracks at DDU.</p>
                </div>

                <div className="topics-grid">
                    <div className="topic-card">
                        <h4>Web & Mobile Dev</h4>
                        <p>React, Node.js, Next.js, Flutter, and Full-Stack Engineering</p>
                    </div>

                    <div className="topic-card">
                        <h4>Data Structures & Algorithms</h4>
                        <p>C++, Java, LeetCode Problem Solving, and Competitive Coding</p>
                    </div>

                    <div className="topic-card">
                        <h4>AI & Data Science</h4>
                        <p>Python, Machine Learning, Deep Learning, and Analytics</p>
                    </div>

                    <div className="topic-card">
                        <h4>Core CS & Systems</h4>
                        <p>DBMS, SQL, Operating Systems, Computer Networks, and Git</p>
                    </div>
                </div>
            </section>

            {/* 5. Call To Action Banner */}
            <section className="cta-section">
                <div className="cta-banner-box">
                    <h2>Ready to Elevate Your Skills at DDU?</h2>
                    <p>
                        Join hundreds of Dharmsinh Desai University students sharing knowledge, 
                        solving complex problems, and building their futures together.
                    </p>

                    <div className="cta-buttons">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/register" className="cta-btn-primary">
                                    Join SkillBridge Now
                                </Link>
                                <Link to="/login" className="cta-btn-secondary">
                                    Sign In with @ddu.ac.in
                                </Link>
                            </>
                        ) : (
                            <Link 
                                to={user.role === "Student" ? "/student/mentors" : user.role === "Mentor" ? "/mentor/dashboard" : "/admin/dashboard"} 
                                className="cta-btn-primary"
                            >
                                Explore Your Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="home-footer">
                <div className="home-footer-inner">
                    <div className="home-footer-brand">
                        <h4>Skill<span style={{ color: "var(--accent)" }}>Bridge</span></h4>
                        <p>Dharmsinh Desai University Peer-to-Peer Mentoring Platform</p>
                    </div>

                    <div className="home-footer-links">
                        <Link to="/">Home</Link>
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        ) : (
                            <>
                                {user.role === "Student" && <Link to="/student/dashboard">Dashboard</Link>}
                                {user.role === "Mentor" && <Link to="/mentor/dashboard">Dashboard</Link>}
                                {user.role === "Administrator" && <Link to="/admin/dashboard">Admin</Link>}
                            </>
                        )}
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default Home;