// pages/api/user/update.js

import connectDB from "@/lib/mongoose";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const {
      email,
      name,
      contact,
      address,
      skills,
      experience,
      education,
      certifications,
      publications,
      projects,
      linkedIn,
      github,
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required for updating the profile." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          contact,
          address,
          skills,
          experience,
          education,
          certifications,
          publications,
          projects,
          linkedIn,
          github,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
