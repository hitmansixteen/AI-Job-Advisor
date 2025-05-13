import sys
import json
import requests
import google.generativeai as genai
import re

# Configure Gemini API
GENAI_API_KEY = "AIzaSyBAi53P9imOY4P0BCGN4G6XczBKVrJcBp8"  # 🔹 Replace with your actual API key
genai.configure(api_key=GENAI_API_KEY)

# ✅ Get user profile from Next.js API
NEXTJS_API_URL = "http://localhost:3000/api/getUser/"

def get_user_profile(email):
    try:
        response = requests.get(NEXTJS_API_URL + email)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(json.dumps({"error": f"Error fetching user profile: {str(e)}"}))
        sys.exit(1)

def analyze_skill_gap(user_profile, job_details):
    prompt = f"""
    You are an expert career advisor.

    User has the following skills: {", ".join(user_profile.get("skills", []))}

    The job they are interested in is titled: {job_details.get("name")}
    Here is the job description: {job_details.get("description")}
    Required skills for this job are: {", ".join(job_details.get("requiredSkills", []))}

    Please:
    1. List the skill gaps (skills required but not present in the user profile).
    2. For each gap, recommend:
       - One or two online courses(with their links).
       - A project idea to practice the skill.
       - An internship type to apply for.

    Strictly return only a valid JSON array of objects like this:
    [
      {{
        "skill": "ExampleSkill",
        "courses": ["Course 1", "Course 2"],
        "projects": ["Build a ..."],
        "internships": ["Frontend internship"]
      }}
    ]
    """

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)

        match = re.search(r"\[.*\]", response.text, re.DOTALL)
        if match:
            json_data = match.group(0)
            return json.loads(json_data)

        return []
    except Exception as e:
        return [{"error": f"Exception in Gemini API call: {str(e)}"}]

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python skill_gap_analysis.py <email> '<job_json>'"}))
        return

    email = sys.argv[1]
    try:
        job_details = json.loads(sys.argv[2])
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON format for job details."}))
        return

    user_profile = get_user_profile(email)
    gap_analysis = analyze_skill_gap(user_profile, job_details)

    print(json.dumps(gap_analysis))

if __name__ == "__main__":
    main()
