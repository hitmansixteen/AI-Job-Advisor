import React, { useState } from "react";
import styles from "./sigup.module.css";
import Button from "@/components/utils/Button.js";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    education: [{ degreeTitle: "", institute: "", startDate: "", endDate: "" }],
    contact: "",
    email: "",
    address: "",
    experience: [{ company: "", position: "", startDate: "", endDate: "", details: "" }],
    certifications: [""],
    publications: [{ title: "", link: "", date: "" }],
    skills: [""],
    projects: [{ title: "", description: "", technologies: "" }],
    linkedIn: "",
    github: "",
    password: "",
  });

  const handleChange = (e, index, field, type) => {
    const updatedData = { ...formData };
    if (type === "education") {
      updatedData.education[index][field] = e.target.value;
    } else if (type === "experience") {
      updatedData.experience[index][field] = e.target.value;
    } else if (type === "skills") {
      updatedData.skills[index] = e.target.value;
    } else if (type === "certifications") {
      updatedData.certifications[index] = e.target.value;
    } else if (type === "publications") {
      updatedData.publications[index][field] = e.target.value;
    } else if (type === "projects") { 
      updatedData.projects[index][field] = e.target.value;
    } else {
      updatedData[field] = e.target.value;
    }
    setFormData(updatedData);
  };

  const addEducation = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      education: [...formData.education, { degreeTitle: "", institute: "", startDate: "", endDate: "" }],
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updatedEducation });
  };

  const addProject = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: "", description: "", technologies: "" }],
    });
  };

  const removeProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addExperience = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: "", position: "", startDate: "", endDate: "", details: "" }],
    });
  };

  const removeExperience = (index) => {
    const updatedExperience = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: updatedExperience });
  };

  const addPublication = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      publications: [...formData.publications, { title: "", link: "", date: "" }],
    });
  };

  const removePublication = (index) => {
    const updatedPublications = formData.publications.filter((_, i) => i !== index);
    setFormData({ ...formData, publications: updatedPublications });
  };

  const addSkill = (e) => {
    e.preventDefault();
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const addCertification = (e) => {
    e.preventDefault();
    setFormData({ ...formData, certifications: [...formData.certifications, ""] });
  };

  const removeCertification = (index) => {
    const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: updatedCertifications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = { ...formData };

    if (
      updatedFormData.experience.length === 1 &&
      Object.values(updatedFormData.experience[0]).every((value) => !value)
    ) {
      updatedFormData.experience = [];
    }
  
    if (
      updatedFormData.projects.length === 1 &&
      Object.values(updatedFormData.projects[0]).every((value) => !value)
    ) {
      updatedFormData.projects = [];
    }
  
    if (
      updatedFormData.skills.length === 1 &&
      updatedFormData.skills[0] === ""
    ) {
      updatedFormData.skills = [];
    }
  
    if (
      updatedFormData.publications.length === 1 &&
      Object.values(updatedFormData.publications[0]).every((value) => !value)
    ) {
      updatedFormData.publications = [];
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          console.log('User created successfully:', data.message);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Received non-JSON response:', text);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Fill in Your Details</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Name:</label>
          <input className={styles.input} type="text" value={formData.name} onChange={(e) => handleChange(e, null, "name", "text")} required />
        </div>

        {/* Contact */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Contact:</label>
          <input className={styles.input} type="text" value={formData.contact} onChange={(e) => handleChange(e, null, "contact", "text")} required />
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input className={styles.input} type="email" value={formData.email} onChange={(e) => handleChange(e, null, "email", "text")} required />
        </div>

        {/* Address */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Address:</label>
          <input className={styles.input} type="text" value={formData.address} onChange={(e) => handleChange(e, null, "address", "text")} required />
        </div>

        {/* LinkedIn */}
        <div className={styles.formGroup}>
          <label className={styles.label}>LinkedIn:</label>
          <input className={styles.input} type="text" value={formData.linkedIn} onChange={(e) => handleChange(e, null, "linkedIn", "text")} />
        </div>

        {/* GitHub */}
        <div className={styles.formGroup}>
          <label className={styles.label}>GitHub Profile:</label>
          <input className={styles.input} type="text" value={formData.github} onChange={(e) => handleChange(e, null, "github", "text")} />
        </div>

        {/* Education */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Education:</label>
          {formData.education.map((edu, index) => (
            <div className={styles.inputGroup} key={index}>
              <input className={styles.input} type="text" placeholder="Degree Title" value={edu.degreeTitle} onChange={(e) => handleChange(e, index, "degreeTitle", "education")} required />
              <input className={styles.input} type="text" placeholder="Institute" value={edu.institute} onChange={(e) => handleChange(e, index, "institute", "education")} required />
              <input className={styles.input} type="date" value={edu.startDate} onChange={(e) => handleChange(e, index, "startDate", "education")} required />
              <input className={styles.input} type="date" value={edu.endDate} onChange={(e) => handleChange(e, index, "endDate", "education")} required />
              {formData.education.length > 1 && (
                <button type="button" className={styles.removeButton} onClick={() => removeEducation(index)}>
                  Remove Education
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={addEducation}>
            Add Education
          </button>
        </div>

        {/* Experience */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience:</label>
          {formData.experience.map((exp, index) => (
            <div className={styles.inputGroup} key={index}>
              <input className={styles.input} type="text" placeholder="Company/Institute Name" value={exp.company} onChange={(e) => handleChange(e, index, "company", "experience")} />
              <input className={styles.input} type="text" placeholder="Position" value={exp.position} onChange={(e) => handleChange(e, index, "position", "experience")} />
              <input className={styles.input} type="date" value={exp.startDate} onChange={(e) => handleChange(e, index, "startDate", "experience")} />
              <input className={styles.input} type="date" value={exp.endDate} onChange={(e) => handleChange(e, index, "endDate", "experience")} />
              <textarea className={styles.textarea} placeholder="Details" value={exp.details} onChange={(e) => handleChange(e, index, "details", "experience")} />
              {formData.experience.length > 1 && (
                <button type="button" className={styles.removeButton} onClick={() => removeExperience(index)}>
                  Remove Experience
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={addExperience}>
            Add Experience
          </button>
        </div>

        {/* Publications */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Publications:</label>
          {formData.publications.map((pub, index) => (
            <div className={styles.inputGroup} key={index}>
              <input className={styles.input} type="text" placeholder="Title" value={pub.title} 
                onChange={(e) => handleChange(e, index, "title", "publications")} />
              <input className={styles.input} type="url" placeholder="Link" value={pub.link} 
                onChange={(e) => handleChange(e, index, "link", "publications")} />
              <input className={styles.input} type="date" placeholder="Publish Date" value={pub.date} 
                onChange={(e) => handleChange(e, index, "date", "publications")} />
              {formData.publications.length > 1 && (
                <button type="button" className={styles.removeButton} onClick={() => removePublication(index)}>
                  Remove Publication
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={addPublication}>
            Add Publication
          </button>
        </div>

        {/* Projects */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Projects:</label>
          {formData.projects.map((project, index) => (
            <div className={styles.inputGroup} key={index}>
              <input className={styles.input} type="text" placeholder="Project Title" value={project.title}
                onChange={(e) => handleChange(e, index, "title", "projects")} />
              <textarea className={styles.textarea} placeholder="Project Description" value={project.description}
                onChange={(e) => handleChange(e, index, "description", "projects")} />
              <input className={styles.input} type="text" placeholder="Technologies Used" value={project.technologies}
                onChange={(e) => handleChange(e, index, "technologies", "projects")} />
              {formData.projects.length > 1 && (
                <button type="button" className={styles.removeButton} onClick={() => removeProject(index)}>
                  Remove Project
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={addProject}>
            Add Project
          </button>
        </div>

        {/* Skills */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Skills:</label>
          {formData.skills.map((skill, index) => (
            <div className={styles.inputGroup} key={index}>
              <input className={styles.input} type="text" value={skill} onChange={(e) => handleChange(e, index, "skills", "skills")} />
              {formData.skills.length > 1 && (
                <button type="button" className={styles.removeButton} onClick={() => removeSkill(index)}>
                  Remove Skill
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={addSkill}>
            Add Skill
          </button>
        </div>

        {/* Certifications */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Certifications:</label>
          {formData.certifications.map((cert, index) => (
            <div className={styles.inputGroup} key={index}>
              <input className={styles.input} type="text" value={cert} onChange={(e) => handleChange(e, index, "certifications", "certifications")} />
              {formData.certifications.length > 1 && (
                <button type="button" className={styles.removeButton} onClick={() => removeCertification(index)}>
                  Remove Certification
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={addCertification}>
            Add Certification
          </button>
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Set Password:</label>
          <input className={styles.input} type="password" value={formData.password} onChange={(e) => handleChange(e, null, "password", "text")} />
        </div>

        {/* Submit Button */}
        <button className={styles.submitButton} type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;