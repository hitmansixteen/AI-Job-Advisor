import { useState, useEffect } from "react";
import ResumeTemplate from "../components/user/resume_template";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "@/styles/LandingPage.module.css";

export default function Demo() {
  const router = useRouter();
  const { data: session } = useSession();
  const [job, setJob] = useState(null);
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
  const [resumeData, setResumeData] = useState(null); // Use an object instead of an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch job details from the router query
  useEffect(() => {
    if (router.isReady) {
      const jobQuery = router.query.job;
      if (jobQuery) {
        setJob(JSON.parse(jobQuery));
      }
    }
  }, [router.isReady, router.query.job]);

  // Fetch user data when the session is available
  useEffect(() => {
    if (session) {
      fetch(`/api/getUser/${session.user.email}`)
        .then((response) => response.json())
        .then((data) => {
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
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [session]);

  // Generate the tailored resume
  const generateResume = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/CV/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, job }),
      });

      if (response.ok) {
        
        const jsonResponse = await response.json(); // Parse JSON response
       
        console.log("Tailored Resume JSON:", jsonResponse); // Log JSON response to console

        // Set the object directly in state
        setResumeData(jsonResponse);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to generate the resume.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Call generateResume only once when job and formData.name are ready
  useEffect(() => {
    if (job && formData.name && !resumeData) {
      generateResume();
      console.log("done")
    }
  }, [job, formData.name, resumeData]); // Add job, formData.name, and resumeData as dependencies

  if (!job) {
    return <div>Loading job details...</div>; // Or any loading state
  }

  if (loading) {
    return <div>Generating resume...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {resumeData && (
        
        // Display ResumeTemplate when resumeData is available
        <div style={{ marginTop: "30px" }}>
          <div className={styles.header}>
          <h1 className={styles.title}>{job.name}</h1>
          </div>
          <ResumeTemplate user={resumeData} />
        </div>
      )}
    </div>
  );
}