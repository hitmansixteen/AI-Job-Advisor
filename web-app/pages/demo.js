import { useState } from "react";
import ResumeTemplate from "../components/user/Resu";

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
      
      {/* Only show form if resumeArray is empty */}
      {resumeArray.length === 0 ? (
        <>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Work Experience:</label>
              <textarea
                name="workExperience"
                value={formData.workExperience}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Education:</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Projects:</label>
              <textarea
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Skills:</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {loading ? "Generating..." : "Generate Resume"}
            </button>
            {error && (
              <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
            )}
          </form>

          {/* Display the tailored resume as a list if form is submitted */}
          <div style={{ marginTop: "30px" }}>
            {resumeArray.length > 0 && (
              <div>
                <h2>Tailored Resume</h2>
                <ul style={{ padding: "0", listStyleType: "none" }}>
                  {resumeArray.map(([key, value]) => (
                    <li
                      key={key}
                      style={{
                        background: "#f9f9f9",
                        marginBottom: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      <strong>{key}:</strong> <p>{value}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        // Display ResumeTemplate when resumeArray is not empty
        <div style={{ marginTop: "30px" }}>
          <ResumeTemplate resumeArray={resumeArray} />
        </div>
      )}
    </div>
  );
}
