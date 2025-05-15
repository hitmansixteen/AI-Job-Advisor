import React, { useRef } from "react";
import { jsPDF } from "jspdf";

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
  console.log(user);
  const resumeRef = useRef();

  const handlePrint = () => {
    // Create a clone of the resume container
    const printContent = resumeRef.current.cloneNode(true);
    
    // Remove any elements you don't want to print
    const buttons = printContent.querySelector('.no-print');
    if (buttons) buttons.remove();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume - ${user.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none !important; }
              @page { margin: 0.5in; }
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              line-height: 1.6;
              color: #333;
            }
            #resume-print {
              min-height: 1100px;
              max-width: 900px;
              margin: 0 auto;
              padding: 30px;
            }
            h1 {
              font-size: 32px;
              font-weight: bold;
              margin: 0;
            }
            h2 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            p {
              margin: 5px 0;
              font-size: 16px;
            }
            ul {
              padding-left: 20px;
            }
          </style>
        </head>
        <body>
          <div id="resume-print">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt", // Points (1 pt = 1/72 inch)
      format: "letter", // 612 x 792 points = 8.5 x 11 inches
    });
  
    const resumeElement = document.querySelector("#resume-content");
  
    doc.html(resumeElement, {
      callback: function (doc) {
        doc.save("resume.pdf");
      },
      margin: [0,0,0,0], 
      autoPaging: 'text',
      x: 0,
      y: 0,
      html2canvas: {
        scale: 0.73, // Shrinks the rendered content to better fit the page
      },
    });
  };

  return (
    <div>
    <div style={{ position: "relative", border: "1px solid #ddd", maxWidth: "850px", align: "center", margin: "auto"}} ref={resumeRef}>
      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #resume-content, #resume-content * {
              visibility: visible;
            }
            #resume-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
              
            }
            .no-print {
              display: none !important;
            }
          }

        `}
      </style>

      {/* Resume content */}
      <div 
        id="resume-content"
        style={{ 
          minHeight: "1082px", 
          maxWidth: "900px", 
          margin: "auto", 
          padding: "42px", 
          fontFamily: "'Times New Roman', Times, serif", 
          lineHeight: "1.5", 
          backgroundColor: "#ffffff", 
          
          
        }}
      >
        {user.name && <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "bold", color: "#333" }}>{user.name}</h1>}
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          {user.address && <span>{user.address} | </span>}
          {user.email && <span>{user.email} | </span>}
          {user.contact && <span>{user.contact}</span>}
          {user.github && <span> | {user.github}</span>}
          {user.linkedIn && <span> | {user.linkedIn}</span>}
        </p>
      
        {/* Summary Section */}
        {user.summary?.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Summary</h2>
            <p style={{ margin: "0", fontSize: "14px", fontWeight: "500", color: "#333" }}>{user.summary}</p>
          </div>
        )}

        {/* Education Section */}
        {user.education?.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Education</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
              {user.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <p style={{ margin: "0", fontSize: "18px", fontWeight: "500", color: "#444" }}>{edu.degreeTitle}</p>
                  <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                    {edu.institute} ({formatDate(edu.startDate)} - {formatDate(edu.endDate)})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {user.experience?.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Experience</h2>
            {user.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <p style={{ margin: "0", fontSize: "18px", fontWeight: "500", color: "#444" }}>
                  <strong>{exp.position}</strong> at {exp.company} ({formatDate(exp.startDate)} - {formatDate(exp.endDate)})
                </p>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>{exp.details}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications Section */}
        {user.certifications?.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Certifications</h2>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {user.certifications.map((cert, index) => (
                <li key={index} style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Publications Section */}
        {user.publications?.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Publications</h2>
            {user.publications.map((pub, index) => (
              <p key={index} style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                <a href={pub.link} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "none" }}>{pub.title}</a> ({formatDate(pub.date)})
              </p>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {user.projects?.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
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
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Skills</h2>
            <ul style={{ listStyleType: "none", paddingLeft: "0", display: "flex", gap: "10px" }}>
              {user.skills.map((skill, index) => (
                <p key={index} style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>{skill}</p>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>
      {/* Print and Download buttons */}
      <div style={{ marginTop: "28px", textAlign: "center" }}>
        <button
          onClick={handlePrint}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginRight: "10px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Print
        </button>
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ResumeTemplate;