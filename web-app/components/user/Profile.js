// components/UserProfile.js

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from './Profile.module.css'; // Custom CSS for the page

const UserProfile = () => {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        address: "",
        education: [],
        experience: [],
        certifications: [],
        publications: [],
        skills: [],
        projects: [],
        linkedIn: "",
        github: "",
    });

    useEffect(() => {
        if (session) {
            fetch(`/api/getUser/${session.user.email}`)
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    setFormData({
                        name: data.name || "",
                        email: data.email || "",
                        contact: data.contact || "",
                        address: data.address || "",
                        education: data.education || [],
                        experience: data.experience || [],
                        certifications: data.certifications || [],
                        publications: data.publications || [],
                        skills: data.skills || [],
                        projects: data.projects || [],
                        linkedIn: data.linkedIn || "",
                        github: data.github || "",
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

    const handleArrayChange = (name, index, field, value) => {
        setFormData((prevData) => {
            const updatedArray = [...prevData[name]];
            updatedArray[index][field] = value;
            return { ...prevData, [name]: updatedArray };
        });
    };

    const handleNewArrayEntry = (name, defaultEntry) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: [...prevData[name], defaultEntry],
        }));
    };

    const handleDeleteArrayEntry = (name, index) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: prevData[name].filter((_, i) => i !== index),
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
                alert("Profile updated successfully");
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
                    onClick={() => {
                        if (isEditing){
                            setFormData({
                                name: user.name || "",
                                email: user.email || "",
                                contact: user.contact || "",
                                address: user.address || "",
                                education: user.education || [],
                                experience: user.experience || [],
                                certifications: user.certifications || [],
                                publications: user.publications || [],
                                skills: user.skills || [],
                                projects: user.projects || [],
                                linkedIn: user.linkedIn || "",
                                github: user.github || "",
                            });
                        }
                        setIsEditing(!isEditing);
                    }}
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
                        <input type="email" name="email" value={formData.email} disabled className="input" />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Contact:</label>
                        <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} disabled={!isEditing} className="input" />
                    </div>
                    <div className={styles.profileSection}>
                        <label>Address:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} className="input" />
                    </div>

                    {/* Skills */}
                    <div className={styles.profileSection}>
                        <label>Skills:</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills.join(", ")}
                            onChange={(e) => handleInputChange({ target: { name: "skills", value: e.target.value.split(", ") } })}
                            disabled={!isEditing}
                            className="input"
                        />
                    </div>

                    {/* Education */}
                    <div className={styles.profileSection}>
                        <label>Education:</label>
                        {formData.education.map((edu, index) => (
                            <div key={index}>
                                <input type="text" placeholder="Degree Title" value={edu.degreeTitle} onChange={(e) => handleArrayChange("education", index, "degreeTitle", e.target.value)} disabled={!isEditing} className="input" />
                                <input type="text" placeholder="Institute" value={edu.institute} onChange={(e) => handleArrayChange("education", index, "institute", e.target.value)} disabled={!isEditing} className="input" />
                                {isEditing && (
                                    <button type="button" onClick={() => handleDeleteArrayEntry("education", index)} className="btn-danger">Delete</button>
                                )}
                            </div>
                        ))}
                        {isEditing && <button type="button" onClick={() => handleNewArrayEntry("education", { degreeTitle: "", institute: "" })}>+ Add Education</button>}
                    </div>

                    {/* Experience */}
                    <div className={styles.profileSection}>
                        <label>Experience:</label>
                        {formData.experience.map((exp, index) => (
                            <div key={index}>
                                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} disabled={!isEditing} className="input" />
                                <input type="text" placeholder="Position" value={exp.position} onChange={(e) => handleArrayChange("experience", index, "position", e.target.value)} disabled={!isEditing} className="input" />
                                <input type="text" placeholder="Details" value={exp.details} onChange={(e) => handleArrayChange("experience", index, "details", e.target.value)} disabled={!isEditing} className="input" />
                                {isEditing && (
                                    <button type="button" onClick={() => handleDeleteArrayEntry("experience", index)} className="btn-danger">Delete</button>
                                )}
                            </div>
                        ))}
                        {isEditing && <button type="button" onClick={() => handleNewArrayEntry("experience", { company: "", position: "", details: "" })}>+ Add Experience</button>}
                    </div>

                    {/* LinkedIn & GitHub */}
                    <div className={styles.profileSection}>
                        <label>LinkedIn:</label>
                        <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleInputChange} disabled={!isEditing} className="input" />
                    </div>
                    <div className={styles.profileSection}>
                        <label>GitHub:</label>
                        <input type="text" name="github" value={formData.github} onChange={handleInputChange} disabled={!isEditing} className="input" />
                    </div>
                </div>

                {isEditing && (
                    <div className={styles.profileActions}>
                        <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Save Changes</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserProfile;
