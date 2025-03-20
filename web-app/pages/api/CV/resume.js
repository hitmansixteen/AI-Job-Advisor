import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios"; // For making HTTP requests

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Use your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", apiVersion: "v1" }); // Use a supported model

export default async function handler(req, res) {
  console.log("Generating resume");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let { formData, job } = req.body;

  // Validate input
  if (!formData || !job) {
    return res.status(400).json({ error: "Missing formData or job in request body" });
  }

  // Extract email from formData
  const { email } = formData;

  // Step 1: Check if a CV already exists for this email and job
  try {
    const checkCVResponse = await axios.get(`http://localhost:3000/api/CV/getCVsByEmail?email=${email}`);
    
    // Check if the response is successful
    if (checkCVResponse.status !== 200) {
      console.error("Failed to fetch CVs:", checkCVResponse.data.message);
      return res.status(checkCVResponse.status).json({ error: "Failed to fetch CVs." });
    }

    const existingCVs = checkCVResponse.data.cvs;

    // Check if a CV with the same job_id already exists
    const existingCV = existingCVs.find((cv) => cv.job_id === job._id.toString());

    if (existingCV) {
      console.log("CV already exists.");
      return res.status(200).json(existingCV); // Return the existing CV
    }
  } catch (error) {
    console.error("Error checking for existing CV:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to check for existing CV." });
  }

  // Step 2: Generate a summary using Gemini
  const systemPrompt = `
You are an AI resume writer. Based on the provided user information and job description, generate a **concise 2-3 sentence CV summary** that directly highlights the most relevant skills, experiences, and achievements. 

### User Information:
${JSON.stringify({
  name: formData.name,
  skills: formData.skills,
  experience: formData.experience,
  projects: formData.projects,
})}

### Job Description:
${job}

### Guidelines:
1. The summary must be **only 2-3 sentences** long.
2. Use strong action verbs and industry-relevant keywords.
3. Do **not** include introductory phrases, explanations, or meta-comments—**output only the plain text summary**.
4. Ensure clarity, professionalism, and alignment with the job description.

### Output:
`;

  try {
    // Generate content using Gemini
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const summary = response.text();

    // Add the generated summary to formData
    formData.summary = summary.trim();

    // Step 3: Customize the resume using the Flask API
    try {
      const flaskResponse = await axios.post(
        "http://127.0.0.1:5000/api/customize_resume_using_similarity_score",
        { formData, job }
      );

      if (flaskResponse.status === 200) {
        formData = flaskResponse.data; // Update formData with the customized resume
      } else {
        console.error("Failed to customize resume:", flaskResponse.data.error);
        return res.status(flaskResponse.status).json({ error: "Failed to customize resume." });
      }
    } catch (err) {
      console.error("Flask API error:", err.message);
      return res.status(500).json({ error: "Failed to customize resume." });
    }

    // Step 4: Save the CV to the database
    try {
      // Assign job_id and title only if they exist in the job object
      formData.job_id = job._id.toString();
      formData.title = job.name;

      const saveCVResponse = await axios.post("http://localhost:3000/api/CV/save_cv", { resume: formData });
      
      if (saveCVResponse.status === 201) {
        console.log("CV saved to the database.");
        return res.status(200).json(formData); // Return the saved CV
      } else {
        console.error("Failed to save CV:", saveCVResponse.data.message);
        return res.status(saveCVResponse.status).json({ error: "Failed to save CV." });
      }
    } catch (error) {
      console.error("Error saving CV:", error.response?.data || error.message);
      return res.status(500).json({ error: "Failed to save CV." });
    }
  } catch (error) {
    console.error("Error during Gemini process or Flask API call:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}