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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    setJobData(json);

                    const res = await fetch("/api/parse_job", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ rawJob: json }),
                    });

                    const result = await res.json();

                    if (res.ok) {
                        console.log("Job parsed and saved:", result.job);
                    } else {
                        console.error("Failed to parse job:", result.error);
                        alert("Error parsing job: " + result.error);
                    }
                } catch (error) {
                    alert("Error reading JSON file");
                    console.error("File read error:", error);
                }
            };
            reader.readAsText(file);
        }
    };

    const similarity_score_clicked = (job_data) => {
        setJobDataForSimilarity(job_data);
        setSimilarityTab(true);
    };

    const skill_gap_analysis = (job_data) => {
        setSkillGapJob(job_data);
        setSkillGapTab(true);
    };

    const formattedJob = jobData
        ? {
              _id: jobData.application_details?.job_id || "uploaded-job",
              name: jobData.job_title || "Untitled Job",
              description: jobData.role_description || "No description provided",
              location: jobData.location
                  ? `${jobData.location.city}, ${jobData.location.state}, ${jobData.location.country}`
                  : "Not specified",
              requiredSkills: jobData.qualifications || [],
          }
        : null;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 px-4">
            {/* Upload Section */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Job Listing</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Select JSON File</label>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>
                    <button
                        onClick={handleUpload}
                        className="w-fit self-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                        Process File
                    </button>
                </div>
            </div>

            {/* Job Details Display */}
            {jobData && (
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                        {/* Job Header */}
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{jobData.job_title}</h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {jobData.company?.name || "Unknown Company"}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {jobData.workplace_type || "Unknown Workplace"}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {jobData.job_type || "Unknown Type"}
                                </span>
                            </div>
                        </div>

                        {/* Grid Layout for Details */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            {/* Company Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Company Information</h3>
                                <div className="space-y-2">
                                    <DetailItem label="Name" value={jobData.company?.name} />
                                    <DetailItem label="LinkedIn" value={jobData.company?.linkedin_url} isLink />
                                    <DetailItem label="Description" value={jobData.company?.description} />
                                    <DetailItem label="Size" value={jobData.company?.size} />
                                    <DetailItem label="Industry" value={jobData.company?.industry} />
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Location</h3>
                                <div className="space-y-2">
                                    <DetailItem label="City" value={jobData.location?.city} />
                                    <DetailItem label="State" value={jobData.location?.state} />
                                    <DetailItem label="Country" value={jobData.location?.country} />
                                    <DetailItem label="Workplace Type" value={jobData.workplace_type} />
                                </div>
                            </div>

                            {/* Posting Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Posting Details</h3>
                                <div className="space-y-2">
                                    <DetailItem label="Posted" value={jobData.posting_details?.reposted} />
                                    <DetailItem label="Applicants" value={jobData.posting_details?.applicants} />
                                    <DetailItem label="Status" value={jobData.posting_details?.status} />
                                    <DetailItem label="Easy Apply" value={jobData.application_details?.easy_apply ? "Yes" : "No"} />
                                    <DetailItem label="Job ID" value={jobData.application_details?.job_id} />
                                </div>
                            </div>

                            {/* Hiring Team */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Hiring Team</h3>
                                <div className="space-y-3">
                                    {jobData.hiring_team?.length > 0 ? (
                                        jobData.hiring_team.map((member, i) => (
                                            <div key={i} className="border-b border-gray-100 pb-3 last:border-0">
                                                <DetailItem label="Name" value={member.name} />
                                                <DetailItem label="Role" value={member.role} />
                                                <DetailItem label="LinkedIn" value={member.linkedin_url} isLink />
                                                <DetailItem label="Connection" value={member.connection_degree} />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No hiring team information</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Role Description */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Role Description</h3>
                            <div className="whitespace-pre-line text-gray-700">
                                {jobData.role_description || "No description provided"}
                            </div>
                        </div>

                        {/* Qualifications */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Qualifications</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {jobData.qualifications?.length > 0 ? (
                                    jobData.qualifications.map((q, i) => (
                                        <li key={i} className="text-gray-700">{q}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No qualifications listed</li>
                                )}
                            </ul>
                        </div>

                        {/* Job URL */}
                        <div className="mt-6">
                            <DetailItem 
                                label="Job Posting URL" 
                                value={jobData.job_posting_url} 
                                isLink 
                                className="text-blue-600 hover:text-blue-800"
                            />
                        </div>

                        {/* Action Buttons - Unchanged */}
                        <div className={styles.buttons + " mt-8 pt-6 border-t border-gray-200"}>
                            {status === "authenticated" && (
                                <>
                                    <button
                                        className={styles.customButton}
                                        onClick={() =>
                                            router.push({
                                                pathname: "/customized_cv",
                                                query: {
                                                    job: JSON.stringify(formattedJob),
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
                                                    job: JSON.stringify(formattedJob),
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
                                                    (formattedJob.requiredSkills.join(", ") || "")
                                            )
                                        }
                                        disabled={similarityTab}
                                    >
                                        Generate Similarity Score & Ranking
                                    </button>
                                    <button
                                        className={styles.customButton}
                                        onClick={() => skill_gap_analysis(formattedJob)}
                                    >
                                        Skill Gap Analysis
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals - Unchanged */}
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

// Helper component for consistent detail items
function DetailItem({ label, value, isLink = false, className = "" }) {
    if (!value) return null;
    
    return (
        <div className="flex">
            <span className="font-medium text-gray-600 w-32 flex-shrink-0">{label}:</span>
            {isLink ? (
                <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-blue-600 hover:underline ${className}`}
                >
                    {value}
                </a>
            ) : (
                <span className={`text-gray-700 ${className}`}>{value}</span>
            )}
        </div>
    );
}

// Helper function to style the industry field
function styledIndustry(industry) {
    if (industry?.includes("employees")) {
        return (
            <span className="text-red-500 italic">
                {industry} (misclassified as industry)
            </span>
        );
    }
    return industry;
}