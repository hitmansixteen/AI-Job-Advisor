import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  title: { type: String, required: true },
  job_id: { type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true},
  summary: { type: String, required: true },
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
});

cvSchema.index({ job_id: 1, email: 1 }, { unique: true });

// Export the model as "resumes"
export default mongoose.models.resumes || mongoose.model("resumes", cvSchema);