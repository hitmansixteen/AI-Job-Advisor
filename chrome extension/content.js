function extractJobDetails() {
    // Company Name
    const companyNameElement = document.querySelector(
        ".job-details-jobs-unified-top-card__company-name a"
    );
    const companyName = companyNameElement
        ? companyNameElement.textContent.trim()
        : "N/A";

    // Job Title
    const jobTitleElement = document.querySelector(
        ".job-details-jobs-unified-top-card__job-title h1 a"
    );
    const jobTitle = jobTitleElement
        ? jobTitleElement.textContent.trim()
        : "N/A";

    // Primary Description
    const primaryDescriptionElement = document.querySelector(
        ".job-details-jobs-unified-top-card__primary-description-container"
    );
    const primaryDescription = primaryDescriptionElement
        ? primaryDescriptionElement.textContent.trim().replace(/\s+/g, " ")
        : "N/A";

    // Job Preferences and Skills
    const preferencesAndSkillsElements = document.querySelectorAll(
        ".job-details-preferences-and-skills__pill span"
    );
    const preferencesAndSkills = Array.from(preferencesAndSkillsElements)
        .map((el) => el.textContent.trim())
        .join(", ");

    // Job Description
    const jobDescriptionElement = document.querySelector(
        ".jobs-description__content .jobs-box__html-content"
    );
    const jobDescription = jobDescriptionElement
        ? jobDescriptionElement.textContent.trim().replace(/\s+/g, " ")
        : "N/A";

    // Return the extracted details as an object
    return {
        companyName,
        jobTitle,
        primaryDescription,
        preferencesAndSkills,
        jobDescription,
    };
}

// Function to add a custom button after the "Easy Apply" button
function addCustomButton() {
    // Locate the parent container of the "Easy Apply" button
    const easyApplyButtonContainer = document.querySelector(
        ".jobs-apply-button--top-card"
    );

    // Ensure the container exists
    if (easyApplyButtonContainer) {
        // Check if the custom button already exists to prevent duplication
        // if (!document.querySelector(".custom-redirect-button")) {
        //     // Create a new button element
        const customButton = document.createElement("button");

        // Add classes and attributes to style the button similar to LinkedIn's buttons
        customButton.className =
            "custom-redirect-button artdeco-button artdeco-button--secondary artdeco-button--3";
        customButton.textContent = "Generate Resume";

        // Add click event to redirect to Google
        customButton.onclick = () => {
            window.open("https://www.google.com", "_blank"); // Open in a new tab
            // Example usage
            const jobDetails = extractJobDetails();
            console.log(jobDetails);
        };

        // Create a spacer element
        const spacer = document.createElement("span");
        spacer.className = "visibility-hidden";
        spacer.style.margin = "0 4px";

        // Insert the spacer and custom button after the "Easy Apply" button
        easyApplyButtonContainer.parentNode.insertBefore(
            spacer,
            easyApplyButtonContainer.nextSibling
        );
        easyApplyButtonContainer.parentNode.insertBefore(
            customButton,
            spacer.nextSibling
        );
        // }
    }
}

// Run the function on page load
addCustomButton();

// Observe the DOM for changes and reapply the modification if necessary
const observer = new MutationObserver(() => {
    addCustomButton();
});

observer.observe(document.body, { childList: true, subtree: true });
