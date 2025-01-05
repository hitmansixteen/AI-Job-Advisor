import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import pdf from "html-pdf";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, workExperience, education, projects, skills } = req.body;

    // Job Description (for tailoring the resume)
    const jobDescription = `
      We are looking for a software engineer with 3+ years of experience in Python and Django.
      The candidate should have strong skills in REST APIs, and excellent problem-solving abilities.
      Good communication skills are a must.
    `;

    // The system prompt for Ollama
    const systemPrompt = `
      You are a resume generator AI. Your task is to create a tailored resume
      for a user based on their provided details and a given job description.
      
      --- User Details ---
      Name: ${name}
      Email: ${email}
      Work Experience: ${workExperience}
      Education: ${education}
      Projects: ${projects}
      Skills: ${skills}

      --- Job Description ---
      ${jobDescription}

      --- Instructions ---
      Analyze the user details and match them with the job description.
      Generate a tailored resume emphasizing the user's relevant experiences,
      skills, and projects with respect to the job description. Use concise and professional language.
      Format each section clearly (e.g., Work Experience, Education, etc.).
    `;

    try {
      // Spawn the Ollama process
      const llmProcess = spawn("ollama", ["run", "llama3.1:latest"]);
      let llmOutput = "";

      // Send the prompt to Ollama
      llmProcess.stdin.write(systemPrompt);
      llmProcess.stdin.end();

      // Capture the output from Ollama
      llmProcess.stdout.on("data", (data) => {
        llmOutput += data.toString();
      });

      // Handle process closure
      llmProcess.on("close", async (code) => {
        if (code === 0) {
          // Convert Ollama output to PDF
          const pdfOptions = { format: "Letter" };
          const pdfFilePath = path.join(process.cwd(), "resume.pdf");

          pdf.create(llmOutput, pdfOptions).toFile(pdfFilePath, (err, result) => {
            if (err) {
              console.error("Error generating PDF:", err);
              res.status(500).json({ error: "Failed to generate PDF" });
            } else {
              // Send the PDF back to the client
              res.setHeader("Content-Type", "application/pdf");
              res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
              const pdfStream = fs.createReadStream(pdfFilePath);
              pdfStream.pipe(res);
            }
          });
        } else {
          res.status(500).json({ error: "Error generating resume with Ollama" });
        }
      });
    } catch (error) {
      console.error("Error during Ollama process:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
