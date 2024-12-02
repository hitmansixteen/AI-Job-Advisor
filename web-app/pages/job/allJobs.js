
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import JobList from "@/components/JobList";
import styles from "@/styles/AllJobs.module.css";

const AllJobs = ({ jobs }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {npm 

    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>All Jobs</h1>
      {jobs.length > 0 ? (
        <JobList jobs={jobs} />
      ) : (
        <p className={styles.noJobs}>No jobs available at the moment.</p>
      )}
    </div>
  );
};


export async function getStaticProps() {
  try {
    const res = await fetch("http://localhost:3000/api/job");
    const jobs = await res.json();

    return {
      props: { jobs }, 
      revalidate: 60, 
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      props: { jobs: [] }, 
    };
  }
}

export default AllJobs;
