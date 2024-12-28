import React from "react";
import styles from "@/styles/JobList.module.css";
import Button from "./utils/Button";
import { useSession } from "next-auth/react";

const JobList = ({ jobs }) => {
  const { data: session, status } = useSession();
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
          {status === "authenticated" && (
            <>
              <Button
              text="Customize Resume"
              bgColor="bg-gray-500"
              hoverColor="hover:bg-gray-600"
              onClick={() => alert("Application submitted!")}
              />

              <Button
                text="Similarity Score"
                bgColor="bg-gray-500"
                hoverColor="hover:bg-gray-600"
                onClick={() => alert("Application submitted!")}
              />
            </>
          )}

        </div>
      ))}
    </div>
  );
};

export default JobList;
