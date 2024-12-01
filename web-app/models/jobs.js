import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requiredSkills: {
        type: [String],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rating: {
        type: Number, 
        min: 0,       
        max: 5,       
        default: 0,   
    },
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
