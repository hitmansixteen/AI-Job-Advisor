import { spawn } from "child_process";

export default async function handler(req, res) {

  console.log("generating resume");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { formData, job } = req.body;

  // Validate input
  if (!formData || !job) {
    return res.status(400).json({ error: "Missing formData or job in request body" });
  }

  // The system prompt for Llama
  const systemPrompt = `
    You are a resume generator AI. Your task is to create a tailored resume for a user based on their provided details and a given job description.

    --- User Details ---
    ${JSON.stringify(formData, null, 2)}

    --- Job Description ---
    ${JSON.stringify(job, null, 2)}

    --- Instructions ---
    Analyze the user details and match them with the job description.
    Generate a tailored resume with the following sections ONLY (Always include the ## before the below-mentioned sections only):

    ## Summary
    ## Work Experience (Don't use ## for each work experience entry)
    ## Education
    ## Certifications
    ## Publications
    ## Projects
    ## Skills
    ## LinkedIn
    ## GitHub

    ONLY provide the above sections in a structured format. The output must contain only the fields that exist in the original user data. If a user has not provided data for a specific field, it should remain empty in the output.

    The output format must be JSON and the same as the user format:

    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      contact: { type: String, required: true },
      address: { type: String, required: true },
      education: [{ degreeTitle: String, institute: String, startDate: Date, endDate: Date }],
      experience: [{ company: String, position: String, startDate: Date, endDate: Date, details: String }],
      certifications: [String],
      publications: [{ title: String, link: String, date: Date }],
      skills: [String],
      projects: [{ title: String, description: String, technologies: String }],
      linkedIn: String,
      github: String,
    }

    Ensure that the generated resume adheres strictly to this format without adding any additional information or explanations.
    PROVIDE OUTPUT IN JSON FORMAT.
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
        // Parse the output into JSON and sanitize it
        const jsonResponse = parseResumeOutput(llmOutput);
    
        if (jsonResponse) {
          return res.status(200).json(jsonResponse);
        } else {
          return res.status(500).json({ error: "Failed to parse resume sections" });
        }
      } else {
        return res.status(500).json({ error: "Error generating resume with Llama" });
      }
    });

    // Handle process errors
    llmProcess.on("error", (error) => {
      console.error("Error during Llama process:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    });
  } catch (error) {
    console.error("Error during Llama process:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to parse Llama output into JSON and validate against schema
function parseResumeOutput(output) {
  try {
    // Extract JSON from the output
    const jsonStart = output.indexOf("{");
    const jsonEnd = output.lastIndexOf("}") + 1;
    const jsonString = output.slice(jsonStart, jsonEnd);

    // Parse the JSON string
    const jsonResponse = JSON.parse(jsonString);

    // Define the schema
    const schema = {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      contact: { type: String, required: true },
      address: { type: String, required: true },
      summary: String,
      education: [{ degreeTitle: String, institute: String, startDate: Date, endDate: Date }],
      experience: [{ company: String, position: String, startDate: Date, endDate: Date, details: String }],
      certifications: [String],
      publications: [{ title: String, link: String, date: Date }],
      skills: [String],
      projects: [{ title: String, description: String, technologies: String }],
      linkedIn: String,
      github: String,
    };

    // Sanitize the JSON response
    const sanitizedResponse = {};

    // Iterate over the schema and ensure all fields are present
    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        if (jsonResponse.hasOwnProperty(key)) {
          // If the field exists in the response, copy it
          sanitizedResponse[key] = jsonResponse[key];
        } else {
          // If the field is missing, set it to null or an appropriate empty value
          if (schema[key].type === Array) {
            sanitizedResponse[key] = [];
          } else if (schema[key].type === String) {
            sanitizedResponse[key] = "";
          } else if (schema[key].type === Date) {
            sanitizedResponse[key] = null;
          } else if (typeof schema[key] === 'object' && schema[key].type === Array) {
            sanitizedResponse[key] = [];
          } else {
            sanitizedResponse[key] = null;
          }
        }
      }
    }

    // Remove any extra fields that are not in the schema
    for (const key in jsonResponse) {
      if (!schema.hasOwnProperty(key)) {
        delete jsonResponse[key];
      }
    }

    return sanitizedResponse;
  } catch (error) {
    console.error("Error parsing Llama output:", error);
    return null;
  }
}
