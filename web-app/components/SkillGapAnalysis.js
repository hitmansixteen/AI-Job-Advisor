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
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "700px",
    maxHeight: "95vh",
    overflowY: "auto",
    margin: "0 auto",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  closeButton: {
    background: "#e53e3e",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "background 0.3s",
    marginBottom: "24px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "24px",
    borderBottom: "2px solid #eee",
    paddingBottom: "8px",
  },
  resultContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxHeight: "70vh",
    overflowY: "auto",
    paddingRight: "8px",
    scrollBehavior: "smooth",
  },
  card: {
    background: "#f0f4f8",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s",
  },
  list: {
    paddingLeft: "20px",
    listStyleType: "disc",
    marginTop: "8px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  listItem: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "6px",
    wordBreak: "break-word",
  },
};


export default SkillGapAnalysis;
