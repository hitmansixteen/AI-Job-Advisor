import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", apiVersion: "v1" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { user, job } = req.body;

  if (!user || !job) {
    return res.status(400).json({ error: "Missing user or job in request body" });
  }

  const systemPrompt = `
You are a professional cover letter writer. Write a concise and compelling **2-3 paragraph cover letter body** based on the following:

### User Profile:
${JSON.stringify({
  name: user.name,
  education: user.education,
  experience: user.experience,
  skills: user.skills,
  projects: user.projects,
})}

### Job Description:
${JSON.stringify(job)}

### Guidelines:
1. Do NOT include the greeting ("Dear...") or closing ("Sincerely...").
2. The cover letter should be 2-3 paragraphs long.
3. Focus on aligning the user's most relevant experience, skills, and achievements with the job requirements.
4. Use a professional and confident tone.
5. Mention the company or job title if available.
6. Avoid repetition. Be clear and concise.
7. Do NOT include any metadata or commentary—only return the cover letter **body text**.

### Output:
`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const coverLetterBody = response.text().trim();

    // Append signature
    const signature = `\n\nSincerely,\n${user.name}\n${user.email}\n${user.contact}\n${user.address}`;
    const fullCoverLetter = coverLetterBody + signature;

    return res.status(200).json({ coverLetter: fullCoverLetter });
  } catch (error) {
    console.error("Error generating cover letter with Gemini:", error);
    return res.status(500).json({ error: "Failed to generate cover letter." });
  }
}
