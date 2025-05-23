import connectDB from '@/lib/mongoose';
import resumes from '@/models/cv';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { cvId, email } = req.body;

  if (!cvId || !email) {
    return res.status(400).json({ error: 'CV ID and email are required' });
  }

  try {
    await connectDB();

    // Verify the CV belongs to the user before deleting
    const cvToDelete = await resumes.findOne({ job_id: cvId, email });

    if (!cvToDelete) {
      return res.status(404).json({ error: 'CV not found or unauthorized' });
    }

    console.log(1)

    // Delete using the job_id and email combination
    const deletedCV = await resumes.findOneAndDelete({ job_id: cvId, email });

    console.log(2)

    if (!deletedCV) {
      return res.status(404).json({ error: 'CV not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'CV deleted successfully',
      deletedId: cvId
    });

  } catch (err) {
    console.error('Error deleting CV:', err);
    return res.status(500).json({ 
      error: 'Server error while deleting CV',
      details: err.message 
    });
  }
}