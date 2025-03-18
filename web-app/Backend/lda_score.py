from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import string
import pandas as pd
import numpy as np

def preprocess_text(text):
    # Preprocess the text: lowercasing, removing punctuation, stopwords, and stemming
    stemmer = PorterStemmer()
    stop_words = set(stopwords.words("english"))
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word not in stop_words and word not in string.punctuation]
    stemmed_tokens = [stemmer.stem(token) for token in tokens]
    return set(stemmed_tokens)

def calculate_similarity_using_lda(cv_data, job_data):
    # Preprocess both CV and job data
    cv_tokens = preprocess_text(cv_data)
    job_tokens = preprocess_text(job_data)
    
    vectorizer = TfidfVectorizer(stop_words='english')
    all_text = list(cv_tokens) + list(job_tokens)
    vectorized_text = vectorizer.fit_transform(all_text)

    lda = LatentDirichletAllocation(n_components=10, random_state=42)  # Assuming 3 topics for simplicity
    lda_matrix = lda.fit_transform(vectorized_text)

    resume_topics = lda_matrix[:len(cv_tokens)]
    job_topics = lda_matrix[len(cv_tokens):]

    lda_similarity_matrix = cosine_similarity(job_topics, resume_topics)

    return round(np.mean(lda_similarity_matrix) * 100, 4)
