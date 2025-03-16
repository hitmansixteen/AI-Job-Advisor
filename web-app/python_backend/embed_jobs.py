import faiss
import requests
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle

model = SentenceTransformer("all-MiniLM-L6-v2")

API_URL = "http://localhost:3000/api/job"
response = requests.get(API_URL)
jobs = response.json()

job_descriptions = [job["description"] for job in jobs]

embeddings = model.encode(job_descriptions)

d = embeddings.shape[1]
index = faiss.IndexFlatL2(d)
index.add(np.array(embeddings))

faiss.write_index(index, "jobs_index.index")

with open("jobs_metadata.pkl", "wb") as f:
    pickle.dump(jobs, f)

print("FAISS index and job metadata saved.")