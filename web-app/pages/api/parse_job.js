import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from '@/lib/mongoose';
import Job from "@/models/jobs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", apiVersion: "v1" });

export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { rawJob } = req.body;

  console.log("Received rawJob:", rawJob);

  if (!rawJob || !rawJob.job_title || !rawJob.role_description || !rawJob.job_posting_url) {
    return res.status(400).json({ error: "Missing required fields in rawJob" });
  }

  try {
    // Connect to DB
    try {
      await connectDB();
      const count = await Job.countDocuments({});
      res.status(200).json({ count });
    } catch (err) {
      print(err.message);
    }
    // Check for duplicate link
    

    // 1. Generate description
    const descPrompt = `
Summarize the following job description into a clear and professional 1-2 sentence summary.

### Job Description:
${rawJob.role_description}
`;
    const descResult = await model.generateContent(descPrompt);
    const description = descResult.response.text().trim();

    // 2. Extract skills
    const skillPrompt = `
From the following job description and qualifications, extract a list of 5–10 technical or professional skills.

### Role Description:
${rawJob.role_description}

### Qualifications:
${(rawJob.qualifications || []).join("\n")}

Output only a comma-separated list.
`;
    const skillResult = await model.generateContent(skillPrompt);
    const skillsRaw = skillResult.response.text().trim();
    const requiredSkills = skillsRaw
      .replace(/[\n\r]/g, "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    // 3. Format location
    const workplace = rawJob.workplace_type || "Unknown";
    const location = workplace === "On-site" && rawJob.location
      ? `On-site (${rawJob.location.city}, ${rawJob.location.state}, ${rawJob.location.country})`
      : workplace;

    // 4. Compose details string
    const formatJobDetails = (rawJob) => {
  return `
COMPANY DETAILS\n
──────────────
• Name: ${rawJob.company?.name || "N/A"}
• LinkedIn: ${rawJob.company?.linkedin_url || "N/A"}
• Description: ${(rawJob.company?.description || "N/A").replace(/\n/g, ' ').trim()}
• Size: ${rawJob.company?.size || "N/A"}
• Industry: ${rawJob.company?.industry || "N/A"}

JOB OVERVIEW\n
───────────
• Title: ${rawJob.job_title || "N/A"}
• Type: ${rawJob.job_type || "N/A"}
• Workplace: ${rawJob.workplace_type || "N/A"}
• Location: ${rawJob.location?.city || "N/A"} ${rawJob.location?.state || ""} ${rawJob.location?.country || ""}
• Posted: ${rawJob.posting_details?.reposted || "N/A"}
• Applicants: ${rawJob.posting_details?.applicants || "N/A"}
• Job URL: ${rawJob.job_posting_url || "N/A"}

QUALIFICATIONS
──────────────
${rawJob.qualifications?.map(q => `• ${q}`).join('\n') || 'N/A'}

HIRING TEAM
───────────
${rawJob.hiring_team?.map(m => 
  `• ${m.name || "N/A"} (${m.role || "N/A"})\n  LinkedIn: ${m.linkedin_url || "N/A"}\n  Connection: ${m.connection_degree || "N/A"}`
).join('\n\n') || 'N/A'}

ROLE DESCRIPTION
───────────────
${rawJob.role_description || "N/A"}
`.trim();
};

// Usage:
const details = formatJobDetails(rawJob);



    // 5. Create new job entry
    const newJob = await Job.create({
        name: rawJob.job_title,
        description,
        requiredSkills,
        location,
        link: rawJob.job_posting_url, 
        details, 
        companyName: rawJob.company?.name || "Unknown",
      });

      return res.status(201).json({
      success: true,
      message: "Job successfully parsed and saved",
      job: {
        name: newJob.name,
        description: newJob.description,
        requiredSkills: newJob.requiredSkills,
        location: newJob.location,
        link: newJob.link,
        details: newJob.details,
        companyName: newJob.companyName,
      }
    });

  } catch (err) {
    console.error("Error saving job:", err);
    return res.status(500).json({ error: "Server error while saving job." });

  }
}
