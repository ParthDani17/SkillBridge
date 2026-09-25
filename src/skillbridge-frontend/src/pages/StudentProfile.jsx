import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function StudentProfile() {

    const { user } = useAuth();

    const [bio, setBio] = useState("");
    const [availability, setAvailability] = useState("");
    const [portfolioLink, setPortfolioLink] = useState("");

    const handleSubmit = (event) => {

        event.preventDefault();

        console.log({
            bio,
            availability,
            portfolioLink
        });

    };

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your SkillBridge profile information.</p>
            </div>

            <div className="profile-card">

                <h2>Personal Information</h2>

                <div className="profile-info">

                    <p>
                        <strong>Name:</strong> {user?.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>

                    <p>
                        <strong>Department:</strong> {user?.department}
                    </p>

                    <p>
                        <strong>Academic Year:</strong> {user?.academicYear}
                    </p>

                    <p>
                        <strong>Role:</strong> {user?.role}
                    </p>

                </div>

            </div>

            <div className="profile-card">

                <h2>Profile Details</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="bio">
                            Bio
                        </label>

                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Tell others about yourself"
                            rows="5"
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="availability">
                            Availability
                        </label>

                        <input
                            type="text"
                            id="availability"
                            value={availability}
                            onChange={(event) => setAvailability(event.target.value)}
                            placeholder="Example: Weekdays, 5 PM - 8 PM"
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="portfolioLink">
                            Portfolio Link
                        </label>

                        <input
                            type="url"
                            id="portfolioLink"
                            value={portfolioLink}
                            onChange={(event) => setPortfolioLink(event.target.value)}
                            placeholder="https://your-portfolio.com"
                        />

                    </div>

                    <button type="submit">
                        Save Profile
                    </button>

                </form>

            </div>

        </div>
    );
}

export default StudentProfile;