export default function StepPreferences({ formData, handleInputChange }) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Preferences</h2>

            <div className="mb-4">
                <label
                    htmlFor="preferredJobLocation"
                    className="block text-gray-700 font-medium mb-2"
                >
                    Preferred Job Location:
                </label>
                <input
                    id="preferredJobLocation"
                    type="text"
                    value={formData.preferredJobLocation}
                    onChange={(e) => handleInputChange("preferredJobLocation", e.target.value)}
                    placeholder="Enter your preferred job location"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-6">
                <label
                    htmlFor="interests"
                    className="block text-gray-700 font-medium mb-2"
                >
                    Interests:
                </label>
                <input
                    id="interests"
                    type="text"
                    value={formData.interests.join(",")} // Display interests as comma-separated
                    onChange={(e) =>
                        handleInputChange("interests", e.target.value.split(","))
                    }
                    placeholder="Enter your interests (comma separated)"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
}

