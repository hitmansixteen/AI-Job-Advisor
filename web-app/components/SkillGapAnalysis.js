import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SimilarityScore from "./SimilarityScore";

const SkillGapAnalysis = ({ job, setSkillGapTab }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchSkillGap = async () => {
      if (!session || !session.user?.email) return;

      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const response = await fetch("/api/skill_gap_analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            email: session.user.email, // ✅ Send email as header
          },
          body: JSON.stringify({ job }),
        });

        if (!response.ok) {
          console.error("Failed to fetch skill gap analysis.");
        }

        const data = await response.json();
        setAnalysisResult(data);
      } catch (error) {
        console.error("Error fetching skill gap analysis:", error);
        setError("An error occurred while fetching the skill gap analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, [job]);

  if (loading) {
    return <p>Loading analysis...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <button style={styles.closeButton} onClick={() => setSkillGapTab(false)}>Close</button>
      <h2 style={styles.title}>Skill Gap Analysis</h2>
      
      {analysisResult && Array.isArray(analysisResult) && analysisResult.length > 0 ? (
        analysisResult.map((item, index) => (
          <div key={index} style={styles.resultContainer}>
            <div style={styles.card}>
              <h3>{item.skill}</h3>
              {item.courses && item.courses.length > 0 && (
                <div>
                  <h4>Recommended Courses</h4>
                  <ul style={styles.list}>
                    {item.courses.map((course, idx) => {
                      const matchedUrl = course.match(/\[?(https?:\/\/[^\s\]]+)\]?/i)?.[1] || "#";

                      return (
                        <li key={idx} style={styles.listItem}>
                          <a href={matchedUrl} target="_blank" rel="noopener noreferrer">
                            {course}
                          </a>
                        </li>
                      );
                    })}                                 
                  </ul>
                </div>
              )}
              {item.projects && item.projects.length > 0 && (
                <div>
                  <h4>Suggested Projects</h4>
                  <ul style={styles.list}>
                    {item.projects.map((project, idx) => (
                      <li key={idx} style={styles.listItem}>{project}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.internships && item.internships.length > 0 && (
                <div>
                  <h4>Suggested Internships</h4>
                  <ul style={styles.list}>
                    {item.internships.map((internship, idx) => (
                      <li key={idx} style={styles.listItem}>{internship}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    maxHeight: "95vh", // Set a max height for the container to prevent overflow
    overflowY: "auto",  // Enable scrolling if the content overflows
    margin: "0 auto",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  closeButton: {
    background: "#FF6347",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  resultContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxHeight: "70vh",  // Adjust based on the available space
    overflowY: "auto",  // Allow scrolling if content overflows
  },
  card: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  list: {
    paddingLeft: "20px",
    listStyleType: "disc",
    maxHeight: "300px", // Optional: Limit the height of lists
    overflowY: "auto",  // Enable vertical scrolling if the content overflows
  },
  listItem: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "8px",
    wordWrap: "break-word",  // Break long words to prevent overflow
  },
};

export default SkillGapAnalysis;
