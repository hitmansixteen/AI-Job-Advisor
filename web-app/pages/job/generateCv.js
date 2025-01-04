import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import styles from "@/styles/CVTemplate.module.css";
import { useRouter } from "next/router";

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

    // Adjust content from the CV template
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text(user.name, 10, 20);

    doc.setFontSize(12);
    doc.text(`Email: ${user.email}`, 10, 30);
    doc.text(`Preferred Job Location: ${user.preferredJobLocation}`, 10, 37);

    // Add Skills
    doc.setFontSize(14);
    doc.text("Skills", 10, 50);
    doc.setFontSize(12);
    let y = 57;
    user.skills.forEach((skill) => {
      doc.text(`• ${skill}`, 13, y);
      y += 7;
    });

    // Add Experience
    y += 10;
    doc.setFontSize(14);
    doc.text("Experience", 10, y);
    doc.setFontSize(12);
    doc.text(user.experience, 15, (y += 8));

    // Add Education
    y += 20;
    doc.setFontSize(14);
    doc.text("Education", 10, y);
    doc.setFontSize(12);
    doc.text(user.education, 13, (y += 8));

    // Add Interests
    y += 20;
    doc.setFontSize(14);
    doc.text("Interests", 10, y);
    doc.setFontSize(12);
    user.interests.forEach((interest) => {
      doc.text(`• ${interest}`, 13, (y += 7));
    });

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
        <p>Preferred Job Location: {user.preferredJobLocation}</p>

        <section>
          <h3>Skills</h3>
          <ul>
            {user.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Experience</h3>
          <p>{user.experience}</p>
        </section>

        <section>
          <h3>Education</h3>
          <p>{user.education}</p>
        </section>

        <section>
          <h3>Interests</h3>
          <ul>
            {user.interests.map((interest, index) => (
              <li key={index}>{interest}</li>
            ))}
          </ul>
        </section>
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
