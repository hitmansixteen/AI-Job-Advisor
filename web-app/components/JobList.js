import React, { useState } from "react";
import styles from "@/styles/JobList.module.css";
import { useSession } from "next-auth/react";
import SimilarityScore from "./SimilarityScore";
import { useRouter } from "next/router";
import SkillGapAnalysis from "./SkillGapAnalysis";
import Button from "./utils/Button";

import { useEffect } from "react";

const JobList = ({ jobs }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [similarityTab, setSimilarityTab] = useState(false);
    const [jobData, setJobData] = useState("");
    const [skillGapTab, setSkillGapTab] = useState(false);
    const [skillGapJob, setSkillGapJob] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [details, setDetails] = useState(null);


    const skill_gap_analysis = (job_data) => {
        setSkillGapJob(job_data);
        setSkillGapTab(true);
    };

    const similarity_score_clicked = (job_data) => {
        setJobData(job_data);
        setSimilarityTab(true);
    };

    const openJobDialog = (job) => {
        setSelectedJob(job);
    };

    const closeJobDialog = () => {
        setSelectedJob(null);
    };

    if (!jobs || jobs.length === 0) {
        return <div className={styles.noJobs}>No jobs available</div>;
    }

    return (
        <div className={styles.grid}>
            {jobs?.map((job) => (
                <div
                    key={job._id}
                    className={styles.card}
                    onClick={() => openJobDialog(job)}
                    style={{ cursor: "pointer" }}
                >
                    <h3 className={styles.cardTitle}>{job.name}</h3>
                    <p className={styles.cardDescription}>{job.description}</p>
                    <p className={styles.cardLocation}>
                        <strong>Location:</strong> {job.location}
                    </p>
                    <p className={styles.cardSkills}>
                        <strong>Required Skills:</strong>{" "}
                        {job.requiredSkills.join(", ")}
                    </p>
                </div>
            ))}

            {/* Modal for Full Job Details */}
            {selectedJob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 py-20 overflow-y-auto">
                <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[85vh] max-w-[100vh] overflow-y-auto">
                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-2">
                    {/* Close Button (unchanged) */}
                    <button
                    className="absolute top-2 right-3 text-gray-600 hover:text-black text-lg"
                    onClick={closeJobDialog}
                    >
                    ✕
                    </button>

                    {/* Job Header Section */}
                    <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedJob.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {selectedJob.companyName || "Company not specified"}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {selectedJob.location || "Location not specified"}
                        </span>
                    </div>
                    </div>

                    {/* Job Details Sections */}
                    <div className="space-y-4">
                    {/* Description */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 whitespace-pre-line">{selectedJob.description}</p>
                    </div>

                    {/* Required Skills */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                        {selectedJob.requiredSkills.map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {skill}
                            </span>
                        ))}
                        </div>
                    </div>

                    {/* Additional Details */}
                    {selectedJob.details && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Additional Details</h3>
                        <div className="text-gray-600 whitespace-pre-line">
                            {selectedJob.details.split('\n').map((line, i) => (
                            <p key={i} className={i !== 0 ? "mt-2" : ""}>{line}</p>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                    {/* Apply Button on top */}
                    <div className="mb-4 flex justify-center">
                        <a
                        href={selectedJob.link}
                        className="bg-buttons text-white px-6 py-2 rounded hover:bg-gray-600 transition text-center w-full max-w-xs"
                        >
                        Apply Now
                        </a>
                    </div>

                    {status === "authenticated" && (
                        <div className="flex flex-wrap justify-center gap-2">
                        <Button
                            text="Customize Resume"
                            bgColor="bg-buttons"
                            hoverColor="hover:bg-gray-600"
                            sizeY="2"
                            onClick={() => {
                                const jobQuery = encodeURIComponent(JSON.stringify(selectedJob));
                                window.open(`/customized_cv?job=${jobQuery}`, '_blank');
                                }
                            }
                        />
                         <Button
                            text="Customize Cover Letter"
                            bgColor="bg-buttons"
                            hoverColor="hover:bg-gray-600"
                            sizeY="2"
                            onClick={() => {
                            const jobQuery = encodeURIComponent(JSON.stringify(selectedJob));
                            window.open(`/cover_letter?job=${jobQuery}`, '_blank');
                            }}
                        />
                        <Button
                            text="Similarity Score"
                            bgColor="bg-buttons"
                            hoverColor="hover:bg-gray-600"
                            sizeY="2"
                            onClick={() =>
                            similarity_score_clicked(
                                selectedJob.description +
                                " Required Skills: " +
                                selectedJob.requiredSkills.join(", ")
                            )
                            }
                            disabled={similarityTab}
                        />
                        <Button
                            text="Skill Gap Analysis"
                            bgColor="bg-buttons"
                            hoverColor="hover:bg-gray-600"
                            sizeY="2"
                            onClick={() => skill_gap_analysis(selectedJob)}
                        />
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>
            )}

            {similarityTab && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <SimilarityScore
                            job={jobData}
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
};

export default JobList;
