import User from '@/models/user';
import connectDB from '@/lib/mongoose';

export default async function handler(req, res) {
    const { email } = req.query;

    await connectDB();

    if (req.method === "GET") {
        try {
            const user = await User.findOne({ email }).select('-password'); // Exclude password from the response
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
