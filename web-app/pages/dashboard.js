import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaUser, FaFileAlt, FaTrash, FaSpinner, FaPlus, FaEdit, FaKey, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from "react-icons/fa";
import axios from "axios";

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchUserData();
        }
    }, [status, router]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            
            // Fetch user data from MongoDB
            const userRes = await axios.get(`/api/getUser/${session.user.email}`);
            setUserData(userRes.data);
            
            // Fetch user's CVs
            const response = await fetch(`/api/CV/getCVsByEmail?email=${session.user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch your CVs');
            }
            const { cvs: userCvs } = await response.json();
            const reversedCVs = [...userCvs].reverse(); 
            setCvs(reversedCVs);
            
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCV = async (cvId) => {
        if (confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
            const email = session.user.email;
            try {
                await fetch('/api/CV/delete-cv', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cvId, email }),
                });
                alert('CV deleted successfully');
                fetchUserData(); // Refresh the data
            } catch (error) {
                console.error("Error deleting CV:", error);
                alert('Failed to delete CV');
            }
        }
    };

    const handleEditCV = async (id) => {
        try {
            const res = await fetch(`/api/getJobFromJobID?jobId=${id}`);
            const data = await res.json();

            if (res.ok && data.job?._id) {
            router.push({
                pathname: "/customized_cv",
                query: { job: JSON.stringify(data.job) },
            })
            } else {
            console.error('Failed to retrieve job data:', data.error || data);
            }
        } catch (error) {
            console.error('Error editing CV:', error);
        }
    };


    if (status === "loading" || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-24 py-12">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Dashboard</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - User Data */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-center mb-6">
                            <div className="mr-4">
                                <FaUser className="text-6xl text-gray-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{userData?.name || session.user.name}</h2>
                                <p className="text-gray-600">{session.user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <FaEnvelope className="text-gray-500 mr-3" />
                                <span>{userData?.email}</span>
                            </div>
                            
                            {userData?.contact && (
                                <div className="flex items-center">
                                    <FaPhone className="text-gray-500 mr-3" />
                                    <span>{userData.contact}</span>
                                </div>
                            )}
                            
                            {userData?.address && (
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="text-gray-500 mr-3" />
                                    <span>{userData.address}</span>
                                </div>
                            )}
                            
                            {userData?.linkedIn && (
                                <div className="flex items-center">
                                    <FaLinkedin className="text-gray-500 mr-3" />
                                    <a href={userData.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        LinkedIn Profile
                                    </a>
                                </div>
                            )}
                            
                            {userData?.github && (
                                <div className="flex items-center">
                                    <FaGithub className="text-gray-500 mr-3" />
                                    <a href={userData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        GitHub Profile
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    {userData?.skills?.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {userData.skills.map((skill, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Account Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push("/user/chngpasspage")}
                            className="flex items-center justify-center w-full bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg"
                        >
                            <FaKey className="mr-2" />
                            Change Password
                        </button>
                        <button
                            onClick={() => router.push("/user/profile")}
                            className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                        >
                            <FaEdit className="mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Right Column - CVs */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold">Your CVs ({cvs.length})</h2>
                            <button 
                                onClick={() => router.push('/job/allJobs')}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                <FaPlus className="mr-2" />
                                Create New CV
                            </button>
                        </div>
                        
                        {cvs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <FaFileAlt className="mx-auto text-4xl mb-4" />
                                <p>You haven't created any CVs yet.</p>
                                <button 
                                    onClick={() => router.push('/cv/new')}
                                    className="mt-4 flex items-center justify-center mx-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    <FaPlus className="mr-2" />
                                    Create Your First CV
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {cvs.map((cv) => (
                                            <tr key={cv._id}>
                                                <td className="px-6 py-4 whitespace-nowrap overflow-x-auto">
                                                    <a 
                                                        onClick={() => handleEditCV(cv.job_id)}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                                    >
                                                        {cv.title}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 overflow-y-auto">
                                                    {cv.summary}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}