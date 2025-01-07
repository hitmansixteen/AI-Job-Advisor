import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const ResumeTemplate = ({ resumeArray }) => {
    const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch(`/api/getUser/${session.user.email}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setLoading(false); // Data fetched, stop loading
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false); // Stop loading even on error
        });
    }
  }, [session]);

  if (loading) {
    // You can show a loading spinner or message here if needed
    return <p>Loading user data...</p>;
  }

  if (!user) {
    // Handle the case where user data is not available
    return <p>User data is unavailable.</p>;
  }
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Times New Roman', Times, serif",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: "0" }}>{user.name}</h1>
        <p>
          {user.preferredJobLocation} | {user.email} | (123) 456-7890
        </p>
      </div>

      {/* Map through resumeArray to render each section */}
      {resumeArray.map(([section, content], index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              textTransform: "capitalize",
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            {section.replace("_", " ")}
          </h2>
          {Array.isArray(content) ? (
            <ul style={{ paddingLeft: "20px" }}>
              {content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ whiteSpace: "pre-wrap" }}>{content}</p>
          )}
        </div>
      ))}

      {/* Footer (Skills & Interests Section) */}
      <div style={{ marginTop: "30px", paddingTop: "20px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Skills & Interests</h2>
        <p>
          Technical: Proficient in Python, React.js, Next.js, and SQL. <br />
          Languages: Fluent in English and Spanish. <br />
          Interests: Technology, Basketball, Traveling.
        </p>
      </div>
    </div>
  );
};

export default ResumeTemplate;
