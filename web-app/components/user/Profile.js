// components/UserProfile.js

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from './Profile.module.css'; // Custom CSS for the page

const Userprofile = () => {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        skills: [],
        experience: "",
        education: "",
        preferredJobLocation: "",
        interests: [],
    });

    useEffect(() => {
        if (session) {
            fetch(`/api/getUser/${session.user.email}`)
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    setFormData({
                        name: data.name,
                        email: data.email,
                        skills: data.skills,
                        experience: data.experience,
                        education: data.education,
                        preferredJobLocation: data.preferredJobLocation,
                        interests: data.interests,
                    });
                })
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [session]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/updateprofile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
                alert("profile updated successfully");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <h1 className={styles.profileTitle}>{user.name}'s Profile</h1>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>

            </div>

            <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.profileInfo}>
                    <div className={styles.profileSection}>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="input"
                        />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="input"
                        />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Skills:</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills.join(", ")}
                            onChange={(e) =>
                                handleInputChange({
                                    target: {
                                        name: "skills",
                                        value: e.target.value.split(", "),
                                    },
                                })
                            }
                            disabled={!isEditing}
                            className="input"
                        />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Experience:</label>
                        <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="input"
                        />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Education:</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="input"
                        />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Preferred Job Location:</label>
                        <input
                            type="text"
                            name="preferredJobLocation"
                            value={formData.preferredJobLocation}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="input"
                        />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Interests:</label>
                        <input
                            type="text"
                            name="interests"
                            value={formData.interests.join(", ")}
                            onChange={(e) =>
                                handleInputChange({
                                    target: {
                                        name: "interests",
                                        value: e.target.value.split(", "),
                                    },
                                })
                            }
                            disabled={!isEditing}
                            className="input"
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className={styles.profileActions}>
                        <button type="submit" className="btn-primary">
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Userprofile;
