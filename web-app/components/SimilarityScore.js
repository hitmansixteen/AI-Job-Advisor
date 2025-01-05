import React, { useState } from 'react';
import styles from '@/styles/JobList.module.css'

const SimilarityScore = (props) => {
    const [cvFile, setCvFile] = useState(null);
    const jobDescription = props.job;
    const [similarityScore, setSimilarityScore] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSimilarityScore(null);
    
        if (!cvFile || !jobDescription) {
            setError('Please upload a CV and provide a job description.');
            return;
        }
    
        // Create FormData and append the necessary data
        const formData = new FormData();
        formData.append('cv_file', cvFile);
        formData.append('job_description', jobDescription);
    
        try {
            const response = await fetch('http://127.0.0.1:5000/api/calculate_similarity', {
                method: 'POST',
                body: formData,  // send the formData as the body
            });
    
            // Check if response status is OK
            if (response.ok) {
                const data = await response.json(); // Parse the JSON response
                console.log(data.cv);
                setSimilarityScore(data.similarity_score); // Assuming your API returns the similarity score as a key-value pair
            } 
            else {
                setError('Failed to calculate similarity score. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while calculating the similarity score.');
            console.error(err); 
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
        }}>
        <div style={{
                backgroundColor: 'rgb(255, 255, 255)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                width: '500px',
                textAlign: 'center',
                transition: 'transform 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <h1
                style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#0d0d52',
                }}
            >
                Resume-Job Similarity Score
            </h1>
            <form
                className="styles.form-container"
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        marginBottom: '20px',
                        textAlign: 'left',
                        width: '100%',
                    }}
                >
                    <label
                        style={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            marginBottom: '8px',
                            display: 'block',
                            color: '#333',
                        }}
                    >
                        Upload CV (PDF)
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{
                            fontSize: '1rem',
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '100%',
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        marginTop: '10px', padding: '12px 20px',
                        backgroundColor: '#4CAF50',color: 'white',
                        border: 'none', borderRadius: '6px',
                        cursor: 'pointer', fontSize: '1rem',
                        fontWeight: '600', width: '100%',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}>
                    Calculate Similarity Score
                </button>
            </form>

            {similarityScore && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: '#f0f8ff',
                        borderRadius: '6px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        fontSize: '1.2rem',
                        color: '#0d6efd',
                        fontWeight: '600',
                    }}
                >
                    <h2>Similarity Score: {similarityScore}%</h2>
                </div>
            )}

            {error && (
                <div
                    style={{
                        color: 'red',
                        marginTop: '10px',
                        fontSize: '1rem',
                        fontWeight: '600',
                    }}
                >
                    <p>{error}</p>
                </div>
            )}

            <button
                onClick={()=>props.setSimilarityTab(false)}
                style={{
                    marginTop: "25px",
                    padding: "10px 20px",
                    backgroundColor: "#999999",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Close
            </button>
        </div>
    </div>

    );
};

export default SimilarityScore;
