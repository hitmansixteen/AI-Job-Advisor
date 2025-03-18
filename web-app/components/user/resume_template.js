import React from "react";

// Utility function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ResumeTemplate = ({ user }) => {
  if (!user) return <p>User data is unavailable.</p>;

  return (
    <div style={{ minHeight: "1100px", maxWidth: "900px", margin: "auto", padding: "30px", fontFamily: "'Times New Roman', Times, serif", lineHeight: "1.6", backgroundColor: "#f9f9f9", border: "1px solid #ddd", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
        {user.name && <h1 style={{ margin: "0", fontSize: "32px", fontWeight: "bold", color: "#333" }}>{user.name}</h1>}
        <p style={{ margin: "5px 0", fontSize: "16px", color: "#555" }}>
          {user.address && <span>{user.address} | </span>}
          {user.email && <span>{user.email} | </span>}
          {user.contact && <span>{user.contact}</span>}
        </p>
      </div>

      {/* Summary Section */}
      {user.summary?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Summary</h2>
          <p style={{ margin: "0", fontSize: "16px", fontWeight: "500", color: "#333" }}>{user.summary}</p>
        </div>
      )}

      {/* Education Section */}
      {user.education?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Education</h2>
          {user.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "500", color: "#444" }}>{edu.degreeTitle}</p>
              <p style={{ margin: "0", fontSize: "16px", color: "#666" }}>
                {edu.institute} ({formatDate(edu.startDate)} - {formatDate(edu.endDate)})
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Experience Section */}
      {user.experience?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Experience</h2>
          {user.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "500", color: "#444" }}>
                <strong>{exp.position}</strong> at {exp.company} ({formatDate(exp.startDate)} - {formatDate(exp.endDate)})
              </p>
              <p style={{ margin: "0", fontSize: "16px", color: "#666" }}>{exp.details}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {user.certifications?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Certifications</h2>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            {user.certifications.map((cert, index) => (
              <li key={index} style={{ fontSize: "16px", color: "#666", marginBottom: "5px" }}>{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Publications Section */}
      {user.publications?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Publications</h2>
          {user.publications.map((pub, index) => (
            <p key={index} style={{ margin: "0", fontSize: "16px", color: "#666" }}>
              <a href={pub.link} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "none" }}>{pub.title}</a> ({formatDate(pub.date)})
            </p>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {user.projects?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Projects</h2>
          {user.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "500", color: "#444" }}>
                <strong>{project.title}</strong>: <em>{project.technologies}</em>
              </p>
              <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                  {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {user.skills?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Skills</h2>
          <ul style={{ listStyleType: "none", paddingLeft: "0", display: "flex", gap: "10px" }}>
            {user.skills.map((skill, index) => (
              <p key={index} style={{ fontSize: "16px", color: "#666", marginBottom: "5px" }}>{skill}</p>
            ))}
          </ul>
        </div>
      )}

      {/* Links Section */}
      {(user.linkedIn || user.github) && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Links</h2>
          {user.linkedIn && (
            <p style={{ margin: "0", fontSize: "16px", color: "#666" }}>
              <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "none" }}>LinkedIn</a>
            </p>
          )}
          {user.github && (
            <p style={{ margin: "0", fontSize: "16px", color: "#666" }}>
              <a href={user.github} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "none" }}>GitHub</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeTemplate;