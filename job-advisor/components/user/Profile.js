import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from './Profile.module.css'; // Custom CSS for the page
import Button from "../utils/Button";

const UserProfile = () => {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        address: "",
        education: [{ degreeTitle: "", institute: "", startDate: "", endDate: "" }],
        experience: [{ company: "", position: "", startDate: "", endDate: "", details: "" }],
        certifications: [""],
        publications: [{ title: "", link: "", date: "" }],
        skills: [""],
        projects: [{ title: "", description: "", technologies: "" }],
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
                        name: data.name,
                        email: data.email,
                        contact: data.contact,
                        address: data.address,
                        education: data.education,
                        experience: data.experience,
                        certifications: data.certifications,
                        publications: data.publications,
                        skills: data.skills,
                        projects: data.projects,
                        linkedIn: data.linkedIn,
                        github: data.github,
                    });
                })
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [session]);

    const handleInputChange = (e, index, field, type) => {
        const updatedData = { ...formData };
        if (type === "education") {
            updatedData.education[index][field] = e.target.value;
        } else if (type === "experience") {
            updatedData.experience[index][field] = e.target.value;
        } else if (type === "publications") {
            updatedData.publications[index][field] = e.target.value;
        } else if (type === "projects") {
            updatedData.projects[index][field] = e.target.value;
        } else if (type === "skills") {
            updatedData.skills[index] = e.target.value;
        } else if (type === "certifications") {
            updatedData.certifications[index] = e.target.value;
        } else {
            updatedData[field] = e.target.value;
        }
        setFormData(updatedData);
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { degreeTitle: "", institute: "", startDate: "", endDate: "" }],
        });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, { company: "", position: "", startDate: "", endDate: "", details: "" }],
        });
    };

    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, ""],
        });
    };

    const addPublication = () => {
        setFormData({
            ...formData,
            publications: [...formData.publications, { title: "", link: "", date: "" }],
        });
    };

    const addSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, ""],
        });
    };

    const addProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, { title: "", description: "", technologies: "" }],
        });
    };

    const removeEducation = (index) => {
        const updatedEducation = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: updatedEducation });
    };

    const removeExperience = (index) => {
        const updatedExperience = formData.experience.filter((_, i) => i !== index);
        setFormData({ ...formData, experience: updatedExperience });
    };

    const removeCertification = (index) => {
        const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
        setFormData({ ...formData, certifications: updatedCertifications });
    };

    const removePublication = (index) => {
        const updatedPublications = formData.publications.filter((_, i) => i !== index);
        setFormData({ ...formData, publications: updatedPublications });
    };

    const removeSkill = (index) => {
        const updatedSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: updatedSkills });
    };

    const removeProject = (index) => {
        const updatedProjects = formData.projects.filter((_, i) => i !== index);
        setFormData({ ...formData, projects: updatedProjects });
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
                <Button onClick={() => setIsEditing(!isEditing)} text={isEditing ? "Cancel Edit" : "Edit Profile"} bgColor="bg-buttons" hoverColor="hover:bg-gray-600"/>
            </div>

            <form onSubmit={handleSubmit} className={styles.profileForm}>
                {/* Name */}
                <div className={styles.profileSection}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange(e, null, "name", "text")}
                        disabled={!isEditing}
                        className={styles.input}
                    />
                </div>

                {/* Email */}
                <div className={styles.profileSection}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className={styles.input}
                    />
                </div>

                {/* Contact */}
                <div className={styles.profileSection}>
                    <label>Contact:</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={(e) => handleInputChange(e, null, "contact", "text")}
                        disabled={!isEditing}
                        className={styles.input}
                    />
                </div>

                {/* Address */}
                <div className={styles.profileSection}>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange(e, null, "address", "text")}
                        disabled={!isEditing}
                        className={styles.input}
                    />
                </div>

                {/* Education */}
                <div className={styles.profileSection}>
                    <label>Education:</label>
                    {formData.education.map((edu, index) => (
                        <div key={index} className={styles.inputGroup}>
                            
                            <input
                                type="text"
                                placeholder="Degree Title"
                                value={edu.degreeTitle}
                                onChange={(e) => handleInputChange(e, index, "degreeTitle", "education")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Institute"
                                value={edu.institute}
                                onChange={(e) => handleInputChange(e, index, "institute", "education")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="date"
                                value={edu.startDate}
                                onChange={(e) => handleInputChange(e, index, "startDate", "education")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="date"
                                value={edu.endDate}
                                onChange={(e) => handleInputChange(e, index, "endDate", "education")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            {isEditing && (
                                <Button onClick={() => removeEducation(index)} text="x" bgColor="bg-red-900" hoverColor="hover:bg-red-600" sizeY='24'/>
                            )}
                            
                        </div>
                    ))}
                    {isEditing && (
                        <Button onClick={addEducation} text="Add Education" bgColor="bg-gray-400" hoverColor="hover:bg-gray-500" />
                    )}
                </div>

                {/* Experience */}
                <div className={styles.profileSection}>
                    <label>Experience:</label>
                    {formData.experience.map((exp, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Company"
                                value={exp.company}
                                onChange={(e) => handleInputChange(e, index, "company", "experience")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Position"
                                value={exp.position}
                                onChange={(e) => handleInputChange(e, index, "position", "experience")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => handleInputChange(e, index, "startDate", "experience")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => handleInputChange(e, index, "endDate", "experience")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <textarea
                                placeholder="Details"
                                value={exp.details}
                                onChange={(e) => handleInputChange(e, index, "details", "experience")}
                                disabled={!isEditing}
                                className={styles.textarea}
                            />
                            {isEditing && (
                                 <Button onClick={() => removeExperience(index)} text="x" bgColor="bg-red-900" hoverColor="hover:bg-red-600" sizeY='24'/>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <Button onClick={addExperience} text="Add Experience" bgColor="bg-gray-400" hoverColor="hover:bg-gray-500"/>
                    )}
                </div>

                {/* Certifications */}
                <div className={styles.profileSection}>
                    <label>Certifications:</label>
                    {formData.certifications.map((cert, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <input
                                type="text"
                                value={cert}
                                onChange={(e) => handleInputChange(e, index, "certifications", "certifications")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            {isEditing && (
                                 <Button onClick={() => removeCertification(index)} text="x" bgColor="bg-red-900" hoverColor="hover:bg-red-600" sizeY='24'/>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <Button onClick={addCertification} text="Add Certification" bgColor="bg-gray-400" hoverColor="hover:bg-gray-500"/>
                    )}
                </div>

                {/* Publications */}
                <div className={styles.profileSection}>
                    <label>Publications:</label>
                    {formData.publications.map((pub, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Title"
                                value={pub.title}
                                onChange={(e) => handleInputChange(e, index, "title", "publications")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Link"
                                value={pub.link}
                                onChange={(e) => handleInputChange(e, index, "link", "publications")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <input
                                type="date"
                                value={pub.date}
                                onChange={(e) => handleInputChange(e, index, "date", "publications")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            {isEditing && (
                                 <Button onClick={() => removePublication(index)} text="x" bgColor="bg-red-900" hoverColor="hover:bg-red-600" sizeY='24'/>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <Button onClick={addPublication} text="Add Publication" bgColor="bg-gray-400" hoverColor="hover:bg-gray-500"/>
                    )}
                </div>

                {/* Skills */}
                <div className={styles.profileSection}>
                    <label>Skills:</label>
                    {formData.skills.map((skill, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleInputChange(e, index, "skills", "skills")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            {isEditing && (
                                 <Button onClick={() => removeSkill(index)} text="x" bgColor="bg-red-900" hoverColor="hover:bg-red-600" sizeY='24'/>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <Button onClick={addSkill} text="Add Skill" bgColor="bg-gray-400" hoverColor="hover:bg-gray-500"/>
                    )}
                </div>

                {/* Projects */}
                <div className={styles.profileSection}>
                    <label>Projects:</label>
                    {formData.projects.map((project, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Title"
                                value={project.title}
                                onChange={(e) => handleInputChange(e, index, "title", "projects")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            <textarea
                                placeholder="Description"
                                value={project.description}
                                onChange={(e) => handleInputChange(e, index, "description", "projects")}
                                disabled={!isEditing}
                                className={styles.textarea}
                            />
                            <input
                                type="text"
                                placeholder="Technologies"
                                value={project.technologies}
                                onChange={(e) => handleInputChange(e, index, "technologies", "projects")}
                                disabled={!isEditing}
                                className={styles.input}
                            />
                            {isEditing && (
                                 <Button onClick={() => removeProject(index)} text="x" bgColor="bg-red-900" hoverColor="hover:bg-red-600" sizeY='24'/>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <Button onClick={addProject} text="Add Project" bgColor="bg-gray-400" hoverColor="hover:bg-gray-500" />
                    )}
                </div>

                {/* LinkedIn */}
                <div className={styles.profileSection}>
                    <label>LinkedIn:</label>
                    <input
                        type="text"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={(e) => handleInputChange(e, null, "linkedIn", "text")}
                        disabled={!isEditing}
                        className={styles.input}
                    />
                </div>

                {/* GitHub */}
                <div className={styles.profileSection}>
                    <label>GitHub:</label>
                    <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={(e) => handleInputChange(e, null, "github", "text")}
                        disabled={!isEditing}
                        className={styles.input}
                    />
                </div>

                {isEditing && (
                    <div className={styles.profileActions}>
                        <button type="submit" className={styles.submitButton}>
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserProfile;