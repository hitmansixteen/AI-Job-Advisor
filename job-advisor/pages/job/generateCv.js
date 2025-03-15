import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import styles from "@/styles/CVTemplate.module.css";
import { useRouter } from "next/router";

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return ""; // Handle empty or invalid dates
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

export default function GenerateCv({ user }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  // Generate and Download PDF
  const generatePDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    // Set font and font size
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text(user.name, 10, 20);

    doc.setFontSize(12);
    doc.text(`Email: ${user.email}`, 10, 30);
    doc.text(`Contact: ${user.contact}`, 10, 37);
    doc.text(`Address: ${user.address}`, 10, 44);
    doc.text(`LinkedIn: ${user.linkedIn}`, 10, 51);
    doc.text(`GitHub: ${user.github}`, 10, 58);

    let y = 70; // Starting Y position for dynamic content

    // Add Education (if not empty)
    if (user.education && user.education.length > 0) {
      doc.setFontSize(14);
      doc.text("Education", 10, y);
      doc.setFontSize(12);
      user.education.forEach((edu) => {
        y += 7;
        doc.text(`• ${edu.degreeTitle}`, 13, y);
        doc.text(`${edu.institute}`, 20, y + 5);
        doc.text(`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, 20, y + 10);
        y += 15;
      });
    }

    // Add Experience (if not empty)
    if (user.experience && user.experience.length > 0) {
      y += 10;
      doc.setFontSize(14);
      doc.text("Experience", 10, y);
      doc.setFontSize(12);
      user.experience.forEach((exp) => {
        y += 7;
        doc.text(`• ${exp.position} at ${exp.company}`, 13, y);
        doc.text(`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`, 20, y + 5);
        doc.text(`${exp.details}`, 20, y + 10);
        y += 15;
      });
    }

    // Add Certifications (if not empty)
    if (user.certifications && user.certifications.length > 0) {
      y += 10;
      doc.setFontSize(14);
      doc.text("Certifications", 10, y);
      doc.setFontSize(12);
      user.certifications.forEach((cert) => {
        y += 7;
        doc.text(`• ${cert}`, 13, y);
      });
    }

    // Add Publications (if not empty)
    if (user.publications && user.publications.length > 0) {
      y += 10;
      doc.setFontSize(14);
      doc.text("Publications", 10, y);
      doc.setFontSize(12);
      user.publications.forEach((pub) => {
        y += 7;
        doc.text(`• ${pub.title}`, 13, y);
        doc.text(`Published on: ${formatDate(pub.date)}`, 20, y + 5);
        doc.text(`Link: ${pub.link}`, 20, y + 10);
        y += 15;
      });
    }

    // Add Skills (if not empty)
    if (user.skills && user.skills.length > 0) {
      y += 10;
      doc.setFontSize(14);
      doc.text("Skills", 10, y);
      doc.setFontSize(12);
      user.skills.forEach((skill) => {
        y += 7;
        doc.text(`• ${skill}`, 13, y);
      });
    }

    // Add Projects (if not empty)
    if (user.projects && user.projects.length > 0) {
      y += 10;
      doc.setFontSize(14);
      doc.text("Projects", 10, y);
      doc.setFontSize(12);
      user.projects.forEach((proj) => {
        y += 7;
        doc.text(`• ${proj.title}`, 13, y);
        doc.text(`Description: ${proj.description}`, 20, y + 5);
        doc.text(`Technologies: ${proj.technologies}`, 20, y + 10);
        y += 15;
      });
    }

    // Save the PDF
    doc.save(`${user.name}_CV.pdf`);
  };

  if (!user || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Generate Your CV</h1>
      <div id="cv" className={styles.cv}>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Contact: {user.contact}</p>
        <p>Address: {user.address}</p>
        <p>LinkedIn: {user.linkedIn}</p>
        <p>GitHub: {user.github}</p>

        {/* Education (if not empty) */}
        {user.education && user.education.length > 0 && (
          <section>
            <h3>Education</h3>
            <ul>
              {user.education.map((edu, index) => (
                <li key={index}>
                  <strong>{edu.degreeTitle}</strong> - {edu.institute} (
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience (if not empty) */}
        {user.experience && user.experience.length > 0 && (
          <section>
            <h3>Experience</h3>
            <ul>
              {user.experience.map((exp, index) => (
                <li key={index}>
                  <strong>{exp.position} at {exp.company}</strong> (
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)})
                  <p>{exp.details}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications (if not empty) */}
        {user.certifications && user.certifications.length > 0 && (
          <section>
            <h3>Certifications</h3>
            <ul>
              {user.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Publications (if not empty) */}
        {user.publications && user.publications.length > 0 && (
          <section>
            <h3>Publications</h3>
            <ul>
              {user.publications.map((pub, index) => (
                <li key={index}>
                  <strong>{pub.title}</strong> - Published on: {formatDate(pub.date)}
                  <a href={pub.link} target="_blank" rel="noopener noreferrer">
                    Read More
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills (if not empty) */}
        {user.skills && user.skills.length > 0 && (
          <section>
            <h3>Skills</h3>
            <ul>
              {user.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Projects (if not empty) */}
        {user.projects && user.projects.length > 0 && (
          <section>
            <h3>Projects</h3>
            <ul>
              {user.projects.map((proj, index) => (
                <li key={index}>
                  <strong>{proj.title}</strong>
                  <p>{proj.description}</p>
                  <p>Technologies: {proj.technologies}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <button className={styles.downloadButton} onClick={generatePDF}>
        Download CV as PDF
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { email } = session.user;

  try {
    const res = await fetch(`http://localhost:3000/api/getUser/${email}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    const user = await res.json();

    return {
      props: { user },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      props: { user: null },
    };
  }
}