import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    skills: {
        type: [String], // Array of strings to store multiple skills
        required: true,
    },
    experience: {
        type: String, // Brief description or number of years
        required: true,
    },
    education: {
        type: String, // Degree and institution
        required: true,
    },
    preferredJobLocation: {
        type: String, // City, country, or "Remote"
        required: true,
    },
    interests: {
        type: [String], // Array of strings to store multiple interests
        required: true,
    },
    projects: {
        type: [String], // Array of strings to store multiple project names
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

export default mongoose.models.User || mongoose.model("User", userSchema);
