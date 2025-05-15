import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

const SimilarityScore = (props) => {
    const { data: session } = useSession();
    const [cvFile, setCvFile] = useState(null);
    const jobDescription = props.job;
    const [similarityScore, setSimilarityScore] = useState(null);
    const [profileScore, setProfileScore] = useState(null);
    const [error, setError] = useState(null);
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'single', or 'user'
    const [userData, setUserData] = useState(null);
    const [profileSimilarity, setProfileSimilarity] = useState("Cannot calculate similarity score");

    // Fetch user data when component mounts
    useEffect(() => {
        if (session) {
            fetch(`/api/getUser/${session.user.email}`)
                .then(response => response.json())
                .then(data => {
                    setUserData(data);
                    console.log("User data:", data);
                })
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [session]);

    const formatUserProfile = (user) => {
    // Helper function to format dates
    const formatDate = (date) => {
        if (!date) return 'Present';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };

    // Format education section
    const educationStr = user.education?.length > 0 
        ? user.education.map(edu => 
            `- ${edu.degreeTitle || 'Degree not specified'} at ${edu.institute || 'Institution not specified'} (${formatDate(edu.startDate)} - ${formatDate(edu.endDate)})`
          ).join('\n')
        : 'No education information provided';

    // Format experience section
    const experienceStr = user.experience?.length > 0
        ? user.experience.map(exp => 
            `- ${exp.position || 'Position not specified'} at ${exp.company || 'Company not specified'} (${formatDate(exp.startDate)} - ${formatDate(exp.endDate)})\n  ${exp.details || 'No details provided'}`
          ).join('\n\n')
        : 'No experience information provided';

    // Format projects section
    const projectsStr = user.projects?.length > 0
        ? user.projects.map(proj =>
            `- ${proj.title || 'Untitled project'}\n  Technologies: ${proj.technologies || 'Not specified'}\n  ${proj.description || 'No description available'}`
          ).join('\n\n')
        : 'No projects listed';

    // Create the comprehensive profile string
    return `
    USER PROFILE SUMMARY
    ===================

    BASIC INFORMATION
    -----------------
    Name: ${user.name || 'Not provided'}
    Email: ${user.email || 'Not provided'}
    Contact: ${user.contact || 'Not provided'}
    Address: ${user.address || 'Not provided'}
    LinkedIn: ${user.linkedIn || 'Not provided'}
    GitHub: ${user.github || 'Not provided'}

    SUMMARY
    -------
    ${user.summary || 'No summary available'}

    EDUCATION
    ---------
    ${educationStr}

    WORK EXPERIENCE
    ---------------
    ${experienceStr}

    SKILLS
    ------
    ${user.skills?.join(', ') || 'No skills listed'}

    CERTIFICATIONS
    --------------
    ${user.certifications?.join(', ') || 'No certifications'}

    PROJECTS
    --------
    ${projectsStr}

    PUBLICATIONS
    ------------
    ${user.publications?.length > 0
        ? user.publications.map(pub =>
            `- ${pub.title || 'Untitled publication'} (${pub.date ? formatDate(pub.date) : 'Date not specified'})\n  ${pub.link || 'No link available'}`
        ).join('\n\n')
        : 'No publications listed'}
    `.trim();
    };

    const handleFileChange = (e) => setCvFile(e.target.files[0]);

    const formatCVContent = (cv) => {
        // Create a comprehensive text representation of the CV
        let content = `
        Title: ${cv.title}
        Summary: ${cv.summary}
        Contact: ${cv.contact}
        Address: ${cv.address}
        
        Education:
        ${cv.education?.map(edu => 
            `${edu.degreeTitle} at ${edu.institute} (${edu.startDate} - ${edu.endDate})`
        ).join('\n') || 'None'}
        
        Experience:
        ${cv.experience?.map(exp => 
            `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.details}`
        ).join('\n\n') || 'None'}
        
        Skills: ${cv.skills?.join(', ') || 'None'}
        
        Certifications: ${cv.certifications?.join(', ') || 'None'}
        
        Projects:
        ${cv.projects?.map(proj => 
            `${proj.title}\nTechnologies: ${proj.technologies}\n${proj.description}`
        ).join('\n\n') || 'None'}
        `;
        return content;
    };

    const calculateProfileSimilarity = async () => {
        setError(null);
        setSimilarityScore(null);

        if (!userData || !jobDescription) {
            setError('Data is missing. Please ensure you have a profile and a job description.');
            return;
        }

        setLoading(true);
        try {
            // Format the user profile data as text
            const formattedProfile = formatUserProfile(userData);

            const formData = new FormData();
            formData.append('profile', formattedProfile);
            formData.append('job_description', jobDescription);
            
            const response = await fetch('http://127.0.0.1:5000/api/profile_similarity', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to calculate similarity score');
            }

            const data = await response.json();
            setProfileSimilarity(data.similarity_score);
        } catch (err) {
            setError(err.message || 'An error occurred while calculating the similarity score.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData && jobDescription) {
            calculateProfileSimilarity();
        }
    }, [userData, jobDescription]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSimilarityScore(null);

        if (!cvFile || !jobDescription) {
            setError('Please upload a CV and provide a job description.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('cv_file', cvFile);
            formData.append('job_description', jobDescription);

            const response = await fetch('http://127.0.0.1:5000/api/calculate_similarity', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to calculate similarity score');
            }

            const data = await response.json();
            setSimilarityScore(data.similarity_score);
        } catch (err) {
            setError(err.message || 'An error occurred while calculating the similarity score.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    

    const handleRankCVs = async () => {
        setError(null);
        setCvs([]);
        setLoading(true);

        try {
            // Fetch user's CVs
            const response = await fetch(`/api/CV/getCVsByEmail?email=${session.user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch your CVs');
            }

            const { cvs: userCvs } = await response.json();
            if (!userCvs || userCvs.length === 0) {
                throw new Error('No CVs found for your account');
            }

            // Prepare data for ranking - format each CV's content
            const cvData = userCvs.map(cv => ({
                id: cv._id,
                title: cv.title,
                content: formatCVContent(cv)
            }));

            // Send to ranking API
            const rankResponse = await fetch('http://127.0.0.1:5000/api/calculate_rank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvs: cvData,
                    job_description: jobDescription
                }),
            });

            if (!rankResponse.ok) {
                throw new Error('Failed to calculate rankings');
            }

            const { scores } = await rankResponse.json();
            
            // Combine with CV data
            const rankedCVs = userCvs.map((cv, index) => ({
                id: cv._id,
                name: cv.title,
                score: scores[index],
                date: new Date(cv.createdAt || cv.date).toLocaleDateString(),
                skills: cv.skills || [],
                experience: cv.experience?.length || 0
            })).sort((a, b) => b.score - a.score);

            setCvs(rankedCVs);
        } catch (err) {
            setError(err.message || 'An error occurred while ranking CVs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Resume Matching</h2>
                    <button 
                        onClick={() => props.setSimilarityTab(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-4">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'single' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('single')}
                    >
                        Single CV
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'user' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('user')}
                    >
                        My CVs
                    </button>
                </div>

                {/* Profile Tab - Initial Screen */}
                {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <h3 className="text-lg font-semibold text-blue-800">Your Profile Match</h3>
                                {profileScore ? (
                                    <>
                                        <div className="text-3xl font-bold text-blue-600 mt-2">
                                            {profileScore}%
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            {profileScore > 80 ? 'Excellent match with your profile!' : 
                                            profileScore > 60 ? 'Good match with your profile' : 
                                            'Consider improving your profile or uploading a CV'}
                                        </div>
                                        <div className="mt-4 text-xs text-gray-500">
                                            Based on your profile information
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-500">
                                        {loading ? 'Calculating...' : profileSimilarity}
                                    </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('single')}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                            >
                                Upload CV
                            </button>
                            <button
                                onClick={() => setActiveTab('user')}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                            >
                                Compare My CVs
                            </button>
                        </div>

                        {userData && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-2">Your Profile Summary</h4>
                                <div className="text-sm text-gray-600 whitespace-pre-line">
                                    {formatUserProfile(userData)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Single CV Tab */}
                {activeTab === 'single' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !cvFile}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Calculating...' : 'Calculate Similarity'}
                        </button>

                        {similarityScore && (
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <h3 className="text-lg font-semibold text-blue-800">Similarity Score</h3>
                                <div className="text-3xl font-bold text-blue-600 mt-2">
                                    {similarityScore}%
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    {similarityScore > 80 ? 'Excellent match!' : 
                                     similarityScore > 60 ? 'Good match' : 
                                     'Consider improving your CV'}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* User CVs Tab */}
                {activeTab === 'user' && (
                    <div className="space-y-4">
                        <button
                            onClick={handleRankCVs}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Ranking...' : 'Rank My CVs'}
                        </button>

                        {cvs.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-700">Your CVs Ranking</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {cvs.map((cv, index) => (
                                        <div key={cv.id} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium">{cv.name}</div>
                                                    <div className="text-xs text-gray-500">{cv.date}</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-bold text-blue-600 mr-2">{cv.score}%</span>
                                                    {index === 0 && (
                                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                                            Best
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {cv.skills.slice(0, 5).map((skill, i) => (
                                                    <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {cv.experience} {cv.experience === 1 ? 'position' : 'positions'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

const formatUserProfile = (user) => {
  // Helper function to format dates
  const formatDate = (date) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Format education section
  const educationStr = user.education?.length > 0 
    ? user.education.map(edu => 
        `• ${edu.degreeTitle} at ${edu.institute} (${formatDate(edu.startDate)} - ${formatDate(edu.endDate)})`
      ).join('\n')
    : 'No education information';

  // Format experience section
  const experienceStr = user.experience?.length > 0
    ? user.experience.map(exp => 
        `• ${exp.position} at ${exp.company} (${formatDate(exp.startDate)} - ${formatDate(exp.endDate)})\n  ${exp.details || 'No details provided'}`
      ).join('\n\n')
    : 'No experience information';

  // Format projects section
  const projectsStr = user.projects?.length > 0
    ? user.projects.map(proj =>
        `• ${proj.title}\n  Technologies: ${proj.technologies || 'Not specified'}\n  ${proj.description || 'No description'}`
      ).join('\n\n')
    : 'No projects listed';

  // Create the comprehensive profile string
  const profileString = `
USER PROFILE SUMMARY
===================

BASIC INFORMATION
-----------------
Name: ${user.name || 'Not provided'}
Email: ${user.email || 'Not provided'}
Contact: ${user.contact || 'Not provided'}
Address: ${user.address || 'Not provided'}
LinkedIn: ${user.linkedIn || 'Not provided'}
GitHub: ${user.github || 'Not provided'}

EDUCATION
---------
${educationStr}

WORK EXPERIENCE
---------------
${experienceStr}

SKILLS
------
${user.skills?.join(', ') || 'No skills listed'}

CERTIFICATIONS
--------------
${user.certifications?.join(', ') || 'No certifications'}

PROJECTS
--------
${projectsStr}

PUBLICATIONS
------------
${user.publications?.length > 0
  ? user.publications.map(pub =>
      `• ${pub.title} (${pub.date ? formatDate(pub.date) : 'No date'})\n  ${pub.link || 'No link'}`
    ).join('\n\n')
  : 'No publications'}
`.trim();

  return profileString;
};


export default SimilarityScore;