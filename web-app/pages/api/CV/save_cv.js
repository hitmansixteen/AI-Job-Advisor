import connectDB from '@/lib/mongoose';
import resumes from '@/models/cv'; // Import the resumes model

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { resume } = req.body; // Extract the resume object from the request body

  // Validate that the resume object is provided
  if (!resume) {
    console.error('Validation failed: Resume object is missing.');
    return res.status(400).json({ message: 'Resume object is required.' });
  }

  // Validate required fields in the resume object
  const requiredFields = ['title', 'job_id', 'name', 'email', 'summary', 'contact', 'address', 'skills'];
  const missingFields = requiredFields.filter(field => !resume[field]);

  if (missingFields.length) {
    console.error('Validation failed: Missing fields:', missingFields);
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  await connectDB(); // Connect to the database

  try {
    // Check if a CV with the same job_id and email already exists
    const existingCV = await resumes.findOne({ job_id: resume.job_id, email: resume.email });
    if (existingCV) {
      console.error('CV already exists for this job and email:', { job_id: resume.job_id, email: resume.email });
      return res.status(200).json({ message: 'CV already exists for this job and email.' });
    }

    // Create a new CV document
    const newCV = new resumes({
      ...resume,
    });

    // Save the new CV to the database
    await newCV.save();

    // Return the saved CV data
    return res.status(201).json({ message: 'CV created successfully.', data: newCV });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}