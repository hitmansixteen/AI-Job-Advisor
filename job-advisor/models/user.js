const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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

export default mongoose.models.User || mongoose.model("User", userSchema);