import { spawn } from "child_process";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { job } = req.body;
  const userEmail = req.headers.email;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is missing in headers." });
  }

  if (!job || !job.name || !job.requiredSkills || !job.description) {
    return res.status(400).json({ error: "Incomplete job data provided." });
  }

  try {
    // Get full path to Python script
    const scriptPath = path.join(process.cwd(), "python_backend", "skill_gap_analysis.py");

    // Prepare the JSON string for job details
    const jobJsonString = JSON.stringify(job);

    // Spawn Python process
    const pythonProcess = spawn("python", [scriptPath, userEmail, jobJsonString]);

    let responseData = "";
    let errorData = "";

    // Capture Python stdout
    pythonProcess.stdout.on("data", (data) => {
      responseData += data.toString();
    });

    // Capture Python stderr
    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    // On Python process exit
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const parsedOutput = JSON.parse(responseData.trim());
          console.log("Parsed Output:", parsedOutput);
          return res.status(200).json(parsedOutput);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          return res.status(500).json({ error: "Invalid JSON response from Python script.", rawOutput: responseData });
        }
      } else {
        console.error("Python Script Error:", errorData);
        return res.status(500).json({ error: "Python script execution failed.", details: errorData });
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
