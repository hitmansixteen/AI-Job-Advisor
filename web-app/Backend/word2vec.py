import gensim
from gensim.models import Word2Vec
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import string

def preprocess_text(text):
    # Tokenize and clean the text (for simplicity, lowercasing and splitting by spaces)
    stemmer = PorterStemmer()
    stop_words = set(stopwords.words("english"))
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word not in stop_words and word not in string.punctuation]
    stemmed_tokens = [stemmer.stem(token) for token in tokens]
    return stemmed_tokens  # Return the stemmed tokens

def get_average_word2vec(tokens, model):
    # Get the Word2Vec vectors for each token in the document
    vectors = []
    for word in tokens:
        if word in model.wv:
            vectors.append(model.wv[word])
    
    # Calculate the average vector for the document
    if vectors:
        return np.mean(vectors, axis=0)
    else:
        return np.zeros(model.vector_size)  # Return zero vector if no words are in the model's vocabulary

def calculate_similarity(cv_data, job_data, word2vec_model):
    # Preprocess both CV and job data
    cv_tokens = preprocess_text(cv_data)
    job_tokens = preprocess_text(job_data)
    
    # Get the average Word2Vec vector for the CV and job description
    cv_vector = get_average_word2vec(cv_tokens, word2vec_model)
    job_vector = get_average_word2vec(job_tokens, word2vec_model)
    
    # Calculate the cosine similarity between the CV and job description vectors
    similarity = np.mean(cosine_similarity([cv_vector], [job_vector]))
    
    # Return the similarity as a percentage, rounded to 4 decimal places
    return round(similarity * 100, 4)

def calculate_similarity_using_word2vec(cv_data, job_data):
    # Tokenize the resumes and job descriptions (preprocess them first)
    cv_tokens = preprocess_text(cv_data)
    job_tokens = preprocess_text(job_data)
    
    # Create the tokenized corpus for Word2Vec model
    tokenized_corpus = [cv_tokens, job_tokens]

    # Train Word2Vec model on the tokenized corpus
    model = Word2Vec(sentences=tokenized_corpus, vector_size=1000, window=5, min_count=1, workers=2)

    # Calculate the similarity using the trained Word2Vec model
    return calculate_similarity(cv_data, job_data, model)
