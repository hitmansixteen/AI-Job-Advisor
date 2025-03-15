import connectDB from "@/lib/mongoose";
import Job from "@/models/jobs";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        try {
            const topJobs = await Job.find().sort({ rating: -1 }).limit(3);
            return res.status(200).json(topJobs);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
