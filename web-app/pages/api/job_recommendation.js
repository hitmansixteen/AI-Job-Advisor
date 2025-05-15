import { spawn } from "child_process";
import path from "path";
import connectDB from "../../lib/mongoose";
import Job from "../../models/jobs";

// Create a simple in-memory cache using a Map
const cache = new Map();

export default async function handler(req, res) {
  try {
    const { email } = req.query;
    console.log("Email:", email);

    // Check if the result is already in the cache
    if (cache.has(email)) {
      console.log("Cache hit for email:", email);
      return res.status(200).json(cache.get(email));
    }

    // Get Python script path
    const scriptPath = path.join(process.cwd(), "python_backend", "faiss_retrieval.py");

    // Spawn Python process
    const pythonProcess = spawn("python", [scriptPath, email]);

    let responseData = "";
    let errorData = "";

    // Capture output
    pythonProcess.stdout.on("data", (data) => {
      responseData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    // Handle process exit
    pythonProcess.on("close", async (code) => {
      if (code === 0) {
        try {
          console.log("Python Response:", responseData);
          const recommendedJobs = JSON.parse(responseData); // Parse FAISS output

          if (!Array.isArray(recommendedJobs) || recommendedJobs.length === 0) {
            // Cache the empty result
            cache.set(email, []);
            return res.status(200).json([]);
          }

          // Extract job titles
          const jobTitles = recommendedJobs.map(job => job.title.trim());

          // Connect to MongoDB
          await connectDB();

          // Fetch jobs from MongoDB based on titles
          const jobsFromDB = await Job.find({
            name: { $in: jobTitles } // Ensures exact match from FAISS results
          });

          console.log("Jobs from DB:", jobsFromDB);

          // Map FAISS reasons to full job details
          const enrichedJobs = jobsFromDB.map(job => {
            const matchedRecommendation = recommendedJobs.find(recJob => recJob.title === job.name);
            return {
              ...job.toObject(), // Convert Mongoose document to plain object
              reason: matchedRecommendation ? matchedRecommendation.reason : "No specific reason",
            };
          });

          console.log("Enriched Jobs:", enrichedJobs);

          // Cache the result
          cache.set(email, enrichedJobs);

          return res.status(200).json(enrichedJobs);
        } catch (error) {
          console.error("JSON Parse Error:", error);
          return res.status(500).json({ error: "Invalid JSON response from Python script." });
        }
      } else {
        console.error("Python Script Error:", errorData);
        return res.status(500).json({ error: "Error executing Python script.", details: errorData });
      }
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}