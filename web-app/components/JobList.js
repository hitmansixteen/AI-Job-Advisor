import React from "react";
import styles from "@/styles/JobList.module.css";

const JobList = ({ jobs }) => {
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
          <p className={styles.cardRating}>
            <strong>Rating:</strong> {job.rating} / 5
          </p>
        </div>
      ))}
    </div>
  );
};

export default JobList;
