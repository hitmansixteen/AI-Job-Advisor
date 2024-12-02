import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import JobList from "@/components/JobList";
import styles from "@/styles/AllJobs.module.css";

const AllJobs = ({ jobs }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filteredJobs, setFilteredJobs] = useState(jobs); // Filtered jobs state

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Filter jobs when the search term changes
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
  
      return (
        title.includes(lowercasedSearchTerm) ||
        description.includes(lowercasedSearchTerm) ||
        company.includes(lowercasedSearchTerm)
      );
    });
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);
  

  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>All Jobs</h1>
      
      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search jobs by title, description, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredJobs.length > 0 ? (
        <JobList jobs={filteredJobs} />
      ) : (
        <p className={styles.noJobs}>No jobs available matching your search.</p>
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
