import connectDB from "@/lib/mongoose";
import Job from "@/models/jobs";

export default async function handler(req, res) {
    let { name } = req.query; 
    await connectDB();

    if (req.method === "GET") {
        try {

            name = decodeURIComponent(name)
            const job = await Job.findOne({ name });

            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            return res.status(200).json(job);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
