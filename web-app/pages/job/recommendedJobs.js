import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import JobList from "@/components/JobList";
import styles from "@/styles/UserProfile.module.css";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filters, setFilters] = useState({
    skills: true,
    location: false,
  });
  const [recommendedJobsBySkills, setRecommendedJobsBySkills] = useState([]);
  const [recommendedJobsByLocation, setRecommendedJobsByLocation] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

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

  useEffect(() => {
    if (filters.skills && filters.location) {
      const intersection = recommendedJobsBySkills.filter(job =>
        recommendedJobsByLocation.some(locJob => locJob._id === job._id)
      );
      setFilteredJobs(intersection);
    } else if (filters.skills) {
      setFilteredJobs(recommendedJobsBySkills);
    } else if (filters.location) {
      setFilteredJobs(recommendedJobsByLocation);
    } else {
      setFilteredJobs([]);
    }
  }, [filters, recommendedJobsBySkills, recommendedJobsByLocation]);

  const fetchRecommendedJobs = async () => {
    try {
      const email = session.user.email;

      const [skillsRes, locationRes] = await Promise.all([
        fetch(`/api/matchSkills/${email}`),
        fetch(`/api/matchLocation/${email}`)
      ]);

      const skillsJobs = await skillsRes.json();
      const locationJobs = await locationRes.json();

      setRecommendedJobsBySkills(skillsJobs);
      setRecommendedJobsByLocation(locationJobs);
      setFilteredJobs(skillsJobs); 
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
  };

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>User Profile</h1>
      <p className={styles.welcome}>
        Welcome, <span className={styles.email}>{session?.user?.email || "User"}</span>!
      </p>

      <div className={styles.filters}>
        <label className={styles.filterLabel}>
          <input
            type="checkbox"
            name="skills"
            checked={filters.skills}
            onChange={handleFilterChange}
          />
          Recommended by Skills
        </label>
        <label className={styles.filterLabel}>
          <input
            type="checkbox"
            name="location"
            checked={filters.location}
            onChange={handleFilterChange}
          />
          Recommended by Location
        </label>
      </div>

      <div className={styles.recommendedJobsSection}>
        <h2 className={styles.subheading}>Recommended Jobs</h2>
        {filteredJobs.length > 0 ? (
          <JobList jobs={filteredJobs} />
        ) : (
          <p className={styles.noJobs}>No recommended jobs found for your criteria.</p>
        )}
      </div>
    </div>
  );
}
