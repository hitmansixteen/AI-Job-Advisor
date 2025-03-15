import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongoose';
import User from '@/models/user';

export default async function handler(req, res) {
  console.log('Request received:', req.method, req.body); // Log the incoming request

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const {
    name,
    email,
    password,
    contact,
    address,
    education,
    experience,
    certifications,
    publications,
    skills,
    projects,
    linkedIn,
    github,
  } = req.body;

  console.log('Received data:', { // Log the parsed request body
    name,
    email,
    contact,
    address,
    education,
    experience,
    certifications,
    publications,
    skills,
    projects,
    linkedIn,
    github,
  });

  // Validate required fields
  if (
    !name ||
    !email ||
    !password ||
    !contact ||
    !address ||
    !education ||
    !experience ||
    !skills
  ) {
    console.error('Validation failed: Required fields are missing.'); // Log validation failure
    return res.status(400).json({ message: "Required fields are missing." });
  }

  await connectDB();

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('User already exists:', email); // Log duplicate user error
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully.'); // Log successful password hashing

    // Create a new user with all fields
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      address,
      education,
      experience,
      certifications: certifications || [],
      publications: publications || [],
      skills,
      projects: projects || [],
      linkedIn: linkedIn || "",
      github: github || "",
    });

    console.log('New user created:', newUser); // Log the new user object

    // Save the new user to the database
    await newUser.save();
    console.log('User saved to the database.'); // Log successful save

    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error('Error in API handler:', error); // Log the error
    return res.status(500).json({ message: "Internal server error." });
  }
}