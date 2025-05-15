import React from "react";
import JobList from "@/components/JobList";
import styles from "@/styles/LandingPage.module.css";

const LandingPage = ({ featuredJobs }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h2 className={styles.title}>Find Your Dream Job</h2>
          <p className={styles.description}>
            Our AI-powered job advisor helps you discover the best job
            opportunities based on your skills, experience, and preferences.
          </p>
        </div>
        <div className="w-full max-w-6xl">
          <h3 className="text-2xl font-semibold mb-6">Featured Jobs</h3>
          <JobList jobs={featuredJobs} />
        </div>
      </main>
      <footer className={styles.footer}>
        <p>© 2025 AI Job Advisor. All rights reserved.</p>
      </footer>
    </div>
  );
};


export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/api/featured-jobs");
    const featuredJobs = await res.json();

    return {
      props: { featuredJobs },
    };
  } catch (error) {
    console.error("Error fetching featured jobs:", error);
    return {
      props: { featuredJobs: [] },
    };
  }
}

export default LandingPage;