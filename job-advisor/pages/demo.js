import { useState } from "react";
import ResumeTemplate from "../components/user/resume_template";

export default function Demo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    workExperience: "",
    education: "",
    projects: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeArray, setResumeArray] = useState([]); // State to store the array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const jsonResponse = await response.json(); // Parse JSON response
        console.log("Tailored Resume JSON:", jsonResponse); // Log JSON response to console

        // Convert JSON object to an array of key-value pairs
        const jsonArray = Object.entries(jsonResponse);

        // Log the array to verify the conversion
        console.log("Tailored Resume Array:", jsonArray);

        // Set the array in state
        setResumeArray(jsonArray);
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

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {resumeArray.length !== 0 &&
        (
          // Display ResumeTemplate when resumeArray is not empty
          <div style={{ marginTop: "30px" }}>
            <ResumeTemplate resumeArray={resumeArray} />
          </div>
        )
      }
    </div>
  );
}