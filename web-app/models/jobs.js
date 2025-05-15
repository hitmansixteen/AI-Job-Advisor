import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  name: String,
  description: String,
  requiredSkills: [String],
  location: String,
  link: { type: String, unique: true },
  details: String,
  companyName: String,
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', jobSchema);