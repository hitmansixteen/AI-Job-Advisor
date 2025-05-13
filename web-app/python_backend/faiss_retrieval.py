import sys
import faiss
import numpy as np
import pickle
import requests
from sentence_transformers import SentenceTransformer
import json
import os
import re
import subprocess  # Using subprocess to call Ollama like in Next.js

import sys
sys.stdout.reconfigure(encoding='utf-8')

# Get absolute path to the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load the FAISS index using the absolute path
index_path = os.path.join(script_dir, "jobs_index.index")
metadata_path = os.path.join(script_dir, "jobs_metadata.pkl")

# Load FAISS index
index = faiss.read_index(index_path)

# Load job metadata
with open(metadata_path, "rb") as f:
    jobs = pickle.load(f)

# Load Sentence Transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# API Endpoint to fetch user data
NEXTJS_API_URL = "http://localhost:3000/api/getUser/"  # Update if necessary

def get_user_profile(email):
    """Fetch user profile from Next.js API."""
    try:
        response = requests.get(NEXTJS_API_URL + email)
        response.raise_for_status()  # Raise error for bad responses (4xx, 5xx)
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching user profile: {e}")
        return None

def create_query_from_profile(user_profile):
    """Generate a meaningful query using user profile information."""
    skills = ", ".join(user_profile.get("skills", [])) or "no specific skills"
    experience = "; ".join(
    [f"{exp.get('position', 'Unknown position')} at {exp.get('company', 'Unknown company')}" 
     for exp in user_profile.get("experience", [])]
    ) or "No relevant experience mentioned"
    education = "; ".join(
    [f"{edu.get('degreeTitle', 'Unknown degree')} from {edu.get('institute', 'Unknown institute')}" 
     for edu in user_profile.get("education", [])]
    ) or "No education details provided"

    # Construct a natural language query
    query = f"Job for a candidate with skills in {skills}, having experience in {experience}, and education in {education}."
    return query

import google.generativeai as genai

# Configure Gemini API
GENAI_API_KEY = "AIzaSyBAi53P9imOY4P0BCGN4G6XczBKVrJcBp8"  # 🔹 Replace with your actual API key
genai.configure(api_key=GENAI_API_KEY)

def refine_with_gemini(user_profile, retrieved_jobs):
    """Use Gemini to rank and refine job recommendations."""
    
    prompt = f"""
    You are an AI system that ranks job listings based on a given user profile. 
    Return only a JSON array containing the top 10 ranked jobs, where each job is an object with:
    - "title": Job title
    - "description": Job description
    - "reason": Why this job was recommended (matching skills, experience, etc.)

    Strictly return only the JSON array without any additional text, explanations, or formatting.

    User Profile:
    Skills: {", ".join(user_profile.get("skills", []))}
    Experience: {user_profile.get("experience", "Not mentioned")}
    Education: {user_profile.get("education", "Not mentioned")}

    Job Listings:
    {json.dumps(retrieved_jobs, indent=2)}
    """

    try:
        # Call Gemini API
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)

        # Extract JSON from the response
        match = re.search(r"\[.*\]", response.text, re.DOTALL)
        if match:
            json_data = match.group(0)
            refined_jobs = json.loads(json_data)
            return refined_jobs

        print("No valid JSON found in Gemini response.")
        return retrieved_jobs  # Fallback to FAISS results

    except Exception as e:
        print(f"Exception in refining jobs with Gemini: {e}")
        return retrieved_jobs  # Fallback

def search_jobs(user_email, top_k=30):
    """Retrieve and refine job recommendations using FAISS and Llama 3.1."""
    user_profile = get_user_profile(user_email)
    if not user_profile:
        return json.dumps({"error": "User profile not found"})

    query = create_query_from_profile(user_profile)
    query_embedding = model.encode([query])

    _, indices = index.search(np.array(query_embedding), top_k)

    retrieved_jobs = [{"title": jobs[i]["name"], "description": jobs[i]["description"]} for i in indices[0]]

    # Use Llama to refine the job list
    refined_jobs = refine_with_gemini(user_profile, retrieved_jobs)

    return json.dumps(refined_jobs)  # Ensure JSON format

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No email provided"}))  # Return JSON error if no email is passed
        sys.exit(1)
    
    user_email = sys.argv[1]  # ✅ Read email from command-line arguments
    results = search_jobs(user_email)
    print(results)  # Print JSON response for Next.js API