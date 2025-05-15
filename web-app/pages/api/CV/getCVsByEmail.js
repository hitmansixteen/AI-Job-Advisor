import connectDB from '@/lib/mongoose';
import resumes from '@/models/cv'; // Import the CV model as "resumes"

export default async function handler(req, res) {
  console.log('Request received:', req.method, req.query); // Log the incoming request

  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email } = req.query; // Extract email from query parameters

  if (!email) {
    console.error('Validation failed: Email is missing.'); // Log validation failure
    return res.status(400).json({ message: "Email is required." });
  }

  await connectDB(); // Connect to the database

  try {
    // Find all CVs with the given email
    const cvs = await resumes.find({ email }) // Populate job_id if needed

    if (cvs.length === 0) {
      console.error('No CVs found for email:', email); // Log if no CVs are found
      return res.status(200).json({ cvs: [] }); // Return an empty array in the same structure
    }

    return res.status(200).json({ cvs }); // Return the list of CVs
  } catch (error) {
    console.error('Error in API handler:', error); // Log the error
    return res.status(500).json({ message: "Internal server error." });
  }
}