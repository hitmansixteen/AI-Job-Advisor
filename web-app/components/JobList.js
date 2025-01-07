import React, { useState } from "react";
import styles from "@/styles/JobList.module.css";
import Button from "./utils/Button";
import { useSession } from "next-auth/react";
import SimilarityScore from "./SimilarityScore";

const JobList = ({ jobs }) => {
  const { data: session, status } = useSession();
  const [similarityTab, setSimilarityTab] = useState(false);
  const [jobData, setJobData] = useState("");

  const similarity_score_clicked = (job_data) => {
    setJobData(job_data)
    setSimilarityTab(true);
  }

  return (
    <div className={styles.grid}>
      {jobs.map((job) => (
        <div key={job._id} className={styles.card}>
          <h3 className={styles.cardTitle}>{job.name}</h3>
          <p className={styles.cardDescription}>{job.description}</p>
          <p className={styles.cardLocation}>
            <strong>Location:</strong> {job.location}
          </p>
          <p className={styles.cardSkills}>
            <strong>Required Skills:</strong> {job.requiredSkills.join(", ")}
          </p>
          <div className = {styles.buttons}>
            {status === "authenticated" && (
              <>
                <Button
                text="Customize Resume"
                bgColor="bg-buttons"
                hoverColor="hover:bg-gray-600"
                sizeY = "2"
                onClick={() => alert("Application submitted!")}
                />

                <Button
                  text="Similarity Score"
                  bgColor="bg-buttons"
                  hoverColor="hover:bg-gray-600"
                  sizeY = "2"
                  onClick={() => similarity_score_clicked(job.description)}
                  disabled={similarityTab}
                />
              </>
            )}
          </div>
        </div>
      ))}
      {similarityTab && (
               <div
                   style={{
                       position: "fixed",
                       top: 0, left: 0,
                       width: "100%",
                       backgroundColor: "rgba(0, 0, 0, 0.5)",
                       display: "flex",
                       justifyContent: "center",
                       alignItems: "center",
                       zIndex: 1000,
                   }}
               >
                   <div
                       style={{
                           padding: "20px",
                           borderRadius: "10px",
                           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                           textAlign: "center",
                           maxWidth: "500px",
                           width: "90%",
                       }}
                   >
                       <SimilarityScore job={jobData} setSimilarityTab = {setSimilarityTab}/>
                   </div>
               </div>
           )}
    </div>
  );
};

export default JobList;