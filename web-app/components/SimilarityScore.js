import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const SimilarityScore = (props) => {
    const { data: session } = useSession();
    const [cvFile, setCvFile] = useState(null);
    const jobDescription = props.job;
    const [similarityScore, setSimilarityScore] = useState(null);
    const [error, setError] = useState(null);
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => setCvFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSimilarityScore(null);

        if (!cvFile || !jobDescription) {
            setError('Please upload a CV and provide a job description.');
            return;
        }

        const formData = new FormData();
        formData.append('cv_file', cvFile);
        formData.append('job_description', jobDescription);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/calculate_similarity', { method: 'POST', body: formData });
            if (response.ok) {
                const data = await response.json();
                setSimilarityScore(data.similarity_score);
            } else {
                setError('Failed to calculate similarity score. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while calculating the similarity score.');
            console.error(err);
        }
    };

    const handleRankCVs = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch CVs by email
            const response = await fetch(`http://localhost:3000/api/CV/getCVsByEmail?email=${session.user.email}`);
            if (!response.ok)
                throw new Error('Failed to fetch CVs.');
            const data = await response.json();
            const cvs = data.cvs;

            // Extract CV content and names
            const cvList = {...cvs}
            const cvNames = cvs.map(cv => cv.title);   

            // Call the Flask API to calculate similarity scores for all CVs
            const rankResponse = await fetch('http://127.0.0.1:5000/api/calculate_rank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cvs: cvList, job_description: jobDescription }),
            });

            if (!rankResponse.ok) throw new Error('Failed to calculate similarity scores.');
            const rankData = await rankResponse.json();

            // Combine CV names with their scores
            const rankedCVs = cvNames.map((name, index) => ({
                name: name,
                score: rankData.scores[index], // Assuming the API returns scores in the same order as the CVs
            }));

            

            // Sort CVs by score in descending order
            rankedCVs.sort((a, b) => b.score - a.score);
            setCvs(rankedCVs);
        } catch (err) {
            setError('An error occurred while ranking CVs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ backgroundColor: 'rgb(255, 255, 255)', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', width: '100%', textAlign: 'center', transition: 'transform 0.2s ease-in-out' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#0d0d52' }}>Resume-Job Similarity Score</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '20px', textAlign: 'left', width: '100%' }}>
                        <label style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#333' }}>Upload CV (PDF)</label>
                        <input type="file" accept=".pdf" onChange={handleFileChange} style={{ fontSize: '1rem', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', cursor: 'pointer' }} />
                    </div>
                    <button type="submit" style={{ marginTop: '5px', padding: '6px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', width: '60%', transition: 'background-color 0.3s ease, transform 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45a049')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}>Calculate Similarity Score</button>
                </form>

                {similarityScore && (
                    <div style={{ marginTop: '10px', padding: '6px', backgroundColor: '#f0f8ff', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontSize: '1rem', color: '#0d6efd', fontWeight: '600' }}>
                        <h2>Similarity Score: {similarityScore}%</h2>
                    </div>
                )}

                <button onClick={handleRankCVs} style={{ marginTop: '15px', padding: '6px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', width: '60%', transition: 'background-color 0.3s ease' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')} disabled={loading}>
                    {loading ? 'Ranking CVs...' : 'Rank Existing CVs'}
                </button>

                {cvs.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Ranked CVs</h2>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}> {/* Scrollable container */}
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {cvs.map((cv, index) => (
                                    <li key={index} style={{ marginBottom: '5px', padding: '5px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#333' }}>{cv.name}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0d6efd' }}>{cv.score}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{ color: 'red', marginTop: '10px', fontSize: '1rem', fontWeight: '600' }}>
                        <p>{error}</p>
                    </div>
                )}

                <button onClick={() => props.setSimilarityTab(false)} style={{ marginTop: '15px', padding: '10px', backgroundColor: '#999999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', width: '80%', transition: 'background-color 0.3s ease' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#777777')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#999999')}>Close</button>
            </div>
        </div>
    );
};

export default SimilarityScore;