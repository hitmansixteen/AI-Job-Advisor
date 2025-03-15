import connectDB from "@/lib/mongoose";
import Job from "@/models/jobs";
import User from "@/models/user";

export default async function handler(req, res) {
    await connectDB();
    let { email } = req.query;

    if (req.method === "GET") {
        try {

            // Validate input
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Get all jobs
            const allJobs = await Job.find();

            // Filter jobs where at least two skills match
            const matchingJobs = allJobs.filter(job => {
                const matchedSkills = job.requiredSkills.filter(skill => 
                    user.skills.includes(skill)
                );
                return matchedSkills.length >= 2; // At least two matching skills
            });

            return res.status(200).json(matchingJobs);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
