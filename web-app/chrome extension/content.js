const observer = new MutationObserver((mutations) => {
    // Target the container holding the Easy Apply and Save buttons
    const buttonContainer =
        document.querySelector(
            ".job-details-jobs-unified-top-card__sticky-buttons-container .display-flex"
        ) || document.querySelector(".mt4 .display-flex");

    if (
        buttonContainer &&
        !buttonContainer.querySelector(".custom-job-button")
    ) {
        const button = document.createElement("button");
        button.className =
            "custom-job-button artdeco-button artdeco-button--secondary artdeco-button--3";
        button.textContent = "Extract Job Data";
        button.style.marginLeft = "8px"; // Space from the Save button
        button.style.padding = "8px 16px";
        button.style.backgroundColor = "#0073b1";
        button.style.color = "#fff";
        button.style.borderRadius = "4px";

        button.addEventListener("click", () => {
            // Extract job details from the page
            const jobData = {
                job_title:
                    document
                        .querySelector(
                            ".job-details-jobs-unified-top-card__job-title"
                        )
                        ?.textContent.trim() || "N/A",
                company: {
                    name:
                        document
                            .querySelector(
                                ".job-details-jobs-unified-top-card__company-name a"
                            )
                            ?.textContent.trim() || "N/A",
                    linkedin_url:
                        document.querySelector(
                            ".job-details-jobs-unified-top-card__company-name a"
                        )?.href || "N/A",
                    description:
                        document
                            .querySelector(".jobs-company__company-description")
                            ?.textContent.trim()
                            .split("…")[0] || "N/A",
                    size:
                        document
                            .querySelector(
                                ".jobs-company__inline-information:nth-of-type(2)"
                            )
                            ?.textContent.trim() || "N/A",
                    followers:
                        document
                            .querySelector(".artdeco-entity-lockup__subtitle")
                            ?.textContent.trim() || "N/A",
                    industry:
                        document
                            .querySelector(
                                ".jobs-company__inline-information:nth-of-type(1)"
                            )
                            ?.textContent.trim() || "N/A",
                },
                location: {
                    city:
                        document
                            .querySelector(
                                ".job-details-jobs-unified-top-card__primary-description-container span:nth-child(1)"
                            )
                            ?.textContent.split(",")[0]
                            .trim() || "N/A",
                    state:
                        document
                            .querySelector(
                                ".job-details-jobs-unified-top-card__primary-description-container span:nth-child(1)"
                            )
                            ?.textContent.split(",")[1]
                            ?.trim() || "N/A",
                    country:
                        document
                            .querySelector(
                                ".job-details-jobs-unified-top-card__primary-description-container span:nth-child(1)"
                            )
                            ?.textContent.split(",")[2]
                            ?.trim() || "N/A",
                },
                workplace_type:
                    document
                        .querySelector(
                            ".job-details-fit-level-preferences button:nth-child(1) span"
                        )
                        ?.textContent.trim()
                        .replace("On-site", "On-site") || "N/A",
                job_type:
                    document
                        .querySelector(
                            ".job-details-fit-level-preferences button:nth-child(2) span"
                        )
                        ?.textContent.trim() || "N/A",
                posting_details: {
                    reposted:
                        document
                            .querySelector(
                                ".job-details-jobs-unified-top-card__primary-description-container span:nth-child(3)"
                            )
                            ?.textContent.trim() || "N/A",
                    applicants:
                        document
                            .querySelector(
                                ".job-details-jobs-unified-top-card__primary-description-container span:nth-child(5)"
                            )
                            ?.textContent.trim() || "N/A",
                    status:
                        document
                            .querySelector(
                                ".job-details-jobs-unified-top-card__primary-description-container p span:nth-child(3)"
                            )
                            ?.textContent.trim() || "N/A",
                },
                role_description:
                    document
                        .querySelector(".jobs-description__content")
                        ?.textContent.trim()
                        .split("Qualifications")[0]
                        .replace("About the job", "")
                        .replace("Company Description", "")
                        .replace("Role Description", "")
                        .trim() || "N/A",
                qualifications:
                    Array.from(
                        document.querySelectorAll(
                            ".jobs-description__content ul li"
                        )
                    ).map((li) => li.textContent.trim()) || [],
                hiring_team: [
                    {
                        name:
                            document
                                .querySelector(
                                    ".hirer-card__hirer-information strong"
                                )
                                ?.textContent.trim() || "N/A",
                        role:
                            document
                                .querySelector(
                                    ".hirer-card__hirer-information .text-body-small"
                                )
                                ?.textContent.trim() || "N/A",
                        linkedin_url:
                            document.querySelector(
                                ".hirer-card__hirer-information a"
                            )?.href || "N/A",
                        connection_degree:
                            document
                                .querySelector(".hirer-card__connection-degree")
                                ?.textContent.trim() || "N/A",
                    },
                ],
                application_details: {
                    easy_apply:
                        !!document.querySelector(".jobs-apply-button") || false,
                    job_id:
                        document
                            .querySelector(".jobs-apply-button")
                            ?.getAttribute("data-job-id") || "N/A",
                },
                job_posting_url: window.location.href,
            };

            // Log the extracted data to the console
            console.log("Extracted Job Data:", jobData);

            try {
                // Convert jobData to JSON string
                const jsonString = JSON.stringify(jobData, null, 2);

                // Create a Blob with the JSON data
                const blob = new Blob([jsonString], {
                    type: "application/json",
                });

                // Create a temporary URL for the Blob
                const url = window.URL.createObjectURL(blob);

                // Create a temporary link element to trigger download
                const link = document.createElement("a");
                link.href = url;
                // Use job_id or timestamp for unique filename
                const fileName = `job_${jobData.job_title + Date.now()}.json`;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                console.log(`Downloaded JSON file: ${fileName}`);

                // Open localhost:3000 in a new tab
                // window.open("http://localhost:3000", "_blank");
            } catch (error) {
                console.error("Error downloading JSON file:", error);
                // Optionally still open the new tab
                // window.open("http://localhost:3000", "_blank");
            }
        });

        // Append the button to the container with Easy Apply and Save buttons
        buttonContainer.appendChild(button);
    }
});

observer.observe(document.body, { subtree: true, childList: true });

window.addEventListener("unload", () => {
    observer.disconnect();
});
