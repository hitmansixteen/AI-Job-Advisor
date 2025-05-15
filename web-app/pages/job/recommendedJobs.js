import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import JobList from "@/components/JobList";
import styles from "@/styles/UserProfile.module.css";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 Added loading state

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchRecommendedJobs();
    }
  }, [session]);

  const fetchRecommendedJobs = async () => {
    console.log("Fetching recommended jobs...");
    try {
      setLoading(true); // 🔹 Show loading message while fetching

      const email = session.user.email;
      const res = await fetch(`/api/job_recommendation?email=${email}`);
      const jobs = await res.json();

      setRecommendedJobs(jobs);
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    } finally {
      setLoading(false); // 🔹 Hide loading message after fetching
    }
  };

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.recommendedJobsSection}>
        <h2 className={styles.subheading}>Recommended Jobs</h2>
        
        {loading ? ( 
          // 🔹 Show this while waiting for API response
          <p className={styles.loadingMessage}>
            Please wait while we analyze your skill set...
          </p>
        ) : recommendedJobs.length > 0 ? (
          <JobList jobs={recommendedJobs} />
        ) : (
          <p className={styles.noJobs}>No recommended jobs found.</p>
        )}
      </div>
    </div>
  );
}
