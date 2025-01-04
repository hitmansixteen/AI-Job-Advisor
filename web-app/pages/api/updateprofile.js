// pages/api/user/update.js

import connectDB from "@/lib/mongoose";
import User from "@/models/user"; // assuming you have a User model

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { email } = req.body; // user email to identify the user
    const { name, skills, experience, education, preferredJobLocation, interests } = req.body;

    try {
      await connectDB();

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { name, skills, experience, education, preferredJobLocation, interests },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
