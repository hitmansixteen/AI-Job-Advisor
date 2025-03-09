import { spawn } from "child_process";
import path from "path";

export default async function handler(req, res) {
  try {
    const { email } = req.query;
    console.log("Email:", email);

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
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          console.log("Python Response:", responseData);
          const parsedData = JSON.parse(responseData); // Ensure Python returns valid JSON
          return res.status(200).json(parsedData);
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
