import React, { useState } from "react";
import styles from "@/styles/JobList.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SimilarityScore from "@/components/SimilarityScore";
import SkillGapAnalysis from "@/components/SkillGapAnalysis";

export default function UploadJob() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobData, setJobData] = useState(null);
    const [similarityTab, setSimilarityTab] = useState(false);
    const [jobDataForSimilarity, setJobDataForSimilarity] = useState("");
    const [skillGapTab, setSkillGapTab] = useState(false);
    const [skillGapJob, setSkillGapJob] = useState(null);

    const router = useRouter();
    const { data: session, status } = useSession();

    const handleUpload = () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }
        console.log("Uploading file:", selectedFile);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    setJobData(json);
                } catch (error) {
                    alert("Error reading JSON file");
                }
            };
            reader.readAsText(file);
        }
    };

    // Handle Similarity Score button click
    const similarity_score_clicked = (job_data) => {
        setJobDataForSimilarity(job_data);
        setSimilarityTab(true);
    };

    // Handle Skill Gap Analysis button click
    const skill_gap_analysis = (job_data) => {
        setSkillGapJob(job_data);
        setSkillGapTab(true);
    };

    // Format jobData to match JobList job structure for buttons
    const formattedJob = jobData
        ? {
              _id: jobData.application_details?.job_id || "uploaded-job",
              name: jobData.job_title || "Untitled Job",
              description:
                  jobData.role_description || "No description provided",
              location: jobData.location
                  ? `${jobData.location.city}, ${jobData.location.state}, ${jobData.location.country}`
                  : "Not specified",
              requiredSkills: jobData.qualifications || [],
          }
        : null;

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="p-4 w-full max-w-md">
                <h1 className="text-2xl mb-4 text-center">Upload Job</h1>
                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={handleUpload}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 w-fit self-center"
                    >
                        Upload
                    </button>
                </div>
            </div>
            {jobData && (
                <div className="mt-4 border p-4 rounded space-y-4 w-full md:w-3/4 mx-auto shadow-lg overflow-y-auto max-h-[80vh]">
                    <h2 className="text-xl font-bold">{jobData.job_title}</h2>

                    <div>
                        <h3 className="font-semibold">Company</h3>
                        <p>
                            <strong>Name:</strong> {jobData.company.name}
                        </p>
                        <p>
                            <strong>LinkedIn:</strong>{" "}
                            <a
                                href={jobData.company.linkedin_url}
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {jobData.company.linkedin_url}
                            </a>
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {jobData.company.description}
                        </p>
                        <p>
                            <strong>Size:</strong> {jobData.company.size}
                        </p>
                        <p>
                            <strong>Followers:</strong>{" "}
                            {jobData.company.followers}
                        </p>
                        <p>
                            <strong>Industry:</strong>{" "}
                            {styledIndustry(jobData.company.industry)}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Location</h3>
                        <p>
                            <strong>City:</strong> {jobData.location.city}
                        </p>
                        <p>
                            <strong>State:</strong> {jobData.location.state}
                        </p>
                        <p>
                            <strong>Country:</strong> {jobData.location.country}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Workplace Type</h3>
                        <p>{jobData.workplace_type}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Job Type</h3>
                        <p>{jobData.job_type}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Posting Details</h3>
                        <p>
                            <strong>Reposted:</strong>{" "}
                            {jobData.posting_details.reposted}
                        </p>
                        <p>
                            <strong>Applicants:</strong>{" "}
                            {jobData.posting_details.applicants}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            {jobData.posting_details.status}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Role Description</h3>
                        <p className="whitespace-pre-wrap">
                            {jobData.role_description}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Qualifications</h3>
                        <ul className="list-disc list-inside">
                            {jobData.qualifications.map((q, i) => (
                                <li key={i}>{q}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold">Hiring Team</h3>
                        {jobData.hiring_team.map((member, i) => (
                            <div key={i} className="mb-2">
                                <p>
                                    <strong>Name:</strong> {member.name}
                                </p>
                                <p>
                                    <strong>Role:</strong> {member.role}
                                </p>
                                <p>
                                    <strong>LinkedIn:</strong>{" "}
                                    <a
                                        href={member.linkedin_url}
                                        className="text-blue-600 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {member.linkedin_url}
                                    </a>
                                </p>
                                <p>
                                    <strong>Connection Degree:</strong>{" "}
                                    {member.connection_degree}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3 className="font-semibold">Application Details</h3>
                        <p>
                            <strong>Easy Apply:</strong>{" "}
                            {jobData.application_details.easy_apply
                                ? "Yes"
                                : "No"}
                        </p>
                        <p>
                            <strong>Job ID:</strong>{" "}
                            {jobData.application_details.job_id}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Job Posting URL</h3>
                        <a
                            href={jobData.job_posting_url}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {jobData.job_posting_url}
                        </a>
                    </div>

                    {/* Add JobList buttons */}
                    <div className={styles.buttons}>
                        {status === "authenticated" && (
                            <>
                                <button
                                    className={styles.customButton}
                                    onClick={() =>
                                        router.push({
                                            pathname: "/customized_cv",
                                            query: {
                                                job: JSON.stringify(
                                                    formattedJob
                                                ),
                                            },
                                        })
                                    }
                                >
                                    Customize CV
                                </button>
                                <button
                                    className={styles.customButton}
                                    onClick={() =>
                                        router.push({
                                            pathname: "/cover_letter",
                                            query: {
                                                job: JSON.stringify(
                                                    formattedJob
                                                ),
                                            },
                                        })
                                    }
                                >
                                    Customize Cover Letter
                                </button>
                                <button
                                    className={styles.customButton}
                                    onClick={() =>
                                        similarity_score_clicked(
                                            formattedJob.description +
                                                " Required Skills: " +
                                                (formattedJob.requiredSkills.join(
                                                    ", "
                                                ) || "")
                                        )
                                    }
                                    disabled={similarityTab}
                                >
                                    Generate Similarity Score & Ranking
                                </button>
                                <button
                                    className={styles.customButton}
                                    onClick={() =>
                                        skill_gap_analysis(formattedJob)
                                    }
                                >
                                    Skill Gap Analysis
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modals for Similarity Score and Skill Gap Analysis */}
            {similarityTab && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <SimilarityScore
                            job={jobDataForSimilarity}
                            setSimilarityTab={setSimilarityTab}
                        />
                    </div>
                </div>
            )}
            {skillGapTab && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <SkillGapAnalysis
                            job={skillGapJob}
                            setSkillGapTab={setSkillGapTab}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to style the industry field
function styledIndustry(industry) {
    if (industry.includes("employees")) {
        return (
            <span className="text-red-500 italic">
                {industry} (misclassified as industry)
            </span>
        );
    }
    return industry;
}
