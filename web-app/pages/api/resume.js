import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios"; // For making HTTP requests

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Use your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", apiVersion: "v1" }); // Use a supported model

const cache = new Map();

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

  // Create a unique key for caching
  const cacheKey = JSON.stringify({ formData, job });

  // Check if the response is already cached
  if (cache.has(cacheKey)) {
    return res.status(200).json(cache.get(cacheKey));
  }

  // The system prompt for Gemini
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

    try {
      const response = await fetch('http://127.0.0.1:5000/api/customize_resume_using_similarity_score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData, job }), 
      });
  
      console.log("Response Status:", response.status);  // Debugging
  
      const responseData = await response.json();  
  
      if (response.ok) {
          formData = responseData;
      } else {
          console.error("Failed to customize resume:", responseData.error);
      }
    } catch (err) {
        console.error("Fetch error:", err.message);
    }


    // Cache the response
    cache.set(cacheKey, formData);

    return res.status(200).json(formData);
  } catch (error) {
    console.error("Error during Gemini process or Flask API call:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}