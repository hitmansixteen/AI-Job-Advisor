export default function StepProfessional({ formData, handleInputChange }) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Professional Information</h2>

            <div className="mb-4">
                <label
                    htmlFor="skills"
                    className="block text-gray-700 font-medium mb-2"
                >
                    Skills:
                </label>
                <input
                    id="skills"
                    type="text"
                    value={formData.skills.join(",")} // Display skills as comma-separated
                    onChange={(e) =>
                        handleInputChange("skills", e.target.value.split(","))
                    }
                    placeholder="Enter your skills (comma separated)"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="experience"
                    className="block text-gray-700 font-medium mb-2"
                >
                    Experience:
                </label>
                <input
                    id="experience"
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="Enter your experience"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-6">
                <label
                    htmlFor="education"
                    className="block text-gray-700 font-medium mb-2"
                >
                    Education:
                </label>
                <input
                    id="education"
                    type="text"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder="Enter your education background"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
}

