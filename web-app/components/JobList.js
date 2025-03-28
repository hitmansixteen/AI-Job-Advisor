import React, { useState } from "react";
import styles from "@/styles/JobList.module.css";
import { useSession } from "next-auth/react";
import SimilarityScore from "./SimilarityScore";
import { useRouter } from "next/router";

const JobList = ({ jobs }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [similarityTab, setSimilarityTab] = useState(false);
  const [jobData, setJobData] = useState("");

  const similarity_score_clicked = (job_data) => {
    setJobData(job_data);
    setSimilarityTab(true);
  };

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
          {job.reason && <p className={styles.cardReason}>{job.reason}</p>}
          <div className={styles.buttons}>
            {status === "authenticated" && (
              <>
                <button
                  className={styles.customButton}
                  onClick={() =>
                    router.push({
                      pathname: "/customized_cv",
                      query: { job: JSON.stringify(job) }, // Convert object to string
                    })
                  }
                >
                  Customize CV & Cover Letter
                </button>
                <button
                  className={styles.customButton}
                  onClick={() =>
                    similarity_score_clicked(
                      job.description + " Required Skills: " + job.requiredSkills.join(", ")
                    )
                  }
                  disabled={similarityTab}
                >
                  Generate Similarity Score & Ranking
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {similarityTab && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <SimilarityScore job={jobData} setSimilarityTab={setSimilarityTab} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;