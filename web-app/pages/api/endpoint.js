import connectDB from "@/lib/mongoose";
import Job from "@/models/job";

export default async function handler(req, res){
    await connectDB();

    if(req.method === "GET"){
        try{
            const jobs = await Job.find();
            return res.status(200).json(jobs);
        } catch(err){
            return res.status(500).json({ message: err.message });
        }
    }

    if(req.method === "POST"){
        try{
            const job = new Job(req.body);
            await job.save();
            return res.status(201).json(job);
        } catch(err){
            return res.status(500).json({ message: err.message });
        }
    }

    return res.status(405).end();
}