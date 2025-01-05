import { spawn } from "child_process";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, workExperience, education, projects, skills } = req.body;

    // Job Description (for tailoring the resume)
    const jobDescription = `
      We are looking for a software engineer with 3+ years of experience in Python and Django.
      The candidate should have strong skills in REST APIs, and excellent problem-solving abilities.
      Good communication skills are a must.
    `;

    // The system prompt for Llama
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
      Generate a tailored resume with the following sections:
      ## Summary
      ## Work Experience
      ## Education
      ## Projects
      ## Skills

      Only provide the above sections in a structured format. Do not include any other information or explanations.
    `;

    try {
      // Spawn the Llama process
      const llmProcess = spawn("ollama", ["run", "llama3.1:latest"]);
      let llmOutput = "";

      // Send the prompt to Llama
      llmProcess.stdin.write(systemPrompt);
      llmProcess.stdin.end();

      // Capture the output from Llama
      llmProcess.stdout.on("data", (data) => {
        llmOutput += data.toString();
      });

      // Handle process closure
      llmProcess.on("close", async (code) => {
        if (code === 0) {
          // Parse the output into JSON
          const jsonResponse = parseResumeOutput(llmOutput);

          if (jsonResponse) {
            res.status(200).json(jsonResponse);
          } else {
            res.status(500).json({ error: "Failed to parse resume sections" });
          }
        } else {
          res.status(500).json({ error: "Error generating resume with Llama" });
        }
      });
    } catch (error) {
      console.error("Error during Llama process:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

// Function to parse Llama output into JSON
function parseResumeOutput(output) {
  try {
    const sections = ["Summary", "Work Experience", "Education", "Projects", "Skills"];
    const result = {};

    // Loop through sections and extract their content
    sections.forEach((section) => {
      const regex = new RegExp(`## ${section}\\n([\\s\\S]*?)(?=##|$)`, "g");
      const match = regex.exec(output);

      if (match) {
        result[section.toLowerCase()] = match[1].trim(); // Save section content in JSON
      }
    });

    return result;
  } catch (error) {
    console.error("Error parsing Llama output:", error);
    return null;
  }
}
