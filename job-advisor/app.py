from flask import Flask, request, jsonify
from Backend.tfidf import calculate_similarity_using_lda_and_tfidf
from Backend.word2vec import calculate_similarity_using_word2vec
from PyPDF2 import PdfReader
from flask_cors import CORS
import os

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
    lda_tfidf = calculate_similarity_using_lda_and_tfidf(cv, job)
    word2vec = calculate_similarity_using_word2vec(cv, job)
    similarity = 0.4 * lda_tfidf + 0.6 * word2vec
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

if __name__ == '__main__':
    app.run(debug=True)
