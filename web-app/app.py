from flask import Flask, request, jsonify
from Backend.lda_score import calculate_similarity_using_lda
from Backend.word2vec import calculate_similarity_using_word2vec
from Backend.CustomizeCV import customize_resume
from Backend.ranking import rank_cvs
from PyPDF2 import PdfReader
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# Directory to store uploaded files temporarily
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def extract_pdf_contents(file_path):
    try:
        reader = PdfReader(file_path)
        content = []

        for page in reader.pages:
            content.append(page.extract_text())

        return "\n".join(content)
    
    except Exception as e:
        return f"An error occurred: {e}"

def calculate_similarity(cv_location, job):
    cv = extract_pdf_contents(cv_location)
    lda_score = calculate_similarity_using_lda(cv, job)
    word2vec = calculate_similarity_using_word2vec(cv, job)
    similarity = 0.4 * lda_score + 0.6 * word2vec
    return cv, similarity

@app.route('/api/calculate_similarity', methods=['POST'])
def calculate_similarity_endpoint():
    if 'cv_file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['cv_file']
    job = request.form.get('job_description')
    print (job)

    if not file or not job:
        return jsonify({"error": "Both cv_file and job_description are required"}), 400

    # Save the uploaded file temporarily
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Calculate similarity
    cv, similarity = calculate_similarity(file_path, job)

    # Clean up by removing the temporary file after processing
    os.remove(file_path)

    return jsonify({"similarity_score": similarity, "cv": cv})

@app.route('/api/calculate_rank', methods=['POST'])
def calculate_rank():
    """
    API endpoint to calculate similarity scores for a list of CVs.
    """
    try:
        # Get JSON data from the request
        data = request.get_json()
        # Validate input

        cvs = data.get('cvs', [])
        job_description = data.get('job_description', '')

        # Calculate similarity scores
        scores = rank_cvs(cvs, job_description)


        # Return the scores as JSON
        return jsonify({"scores": scores}), 200

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    


@app.route('/api/customize_resume_using_similarity_score', methods=['POST'])
def customize_resume_using_similarity_score():
    try:
        # Ensure the request contains JSON data
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        # Parse the JSON input
        data = request.get_json()

        # Validate required keys
        if "formData" not in data or "job" not in data:
            return jsonify({"error": "Missing required fields: 'formData' and 'job'"}), 400

        # Process the resume customization
        customized = customize_resume(data["formData"], data["job"])

        # Return the result as a JSON object
        return jsonify(customized), 200

    except Exception as e:
        # Log the error for debugging
        print("Error in customize_resume_using_similarity_score:", str(e))
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
