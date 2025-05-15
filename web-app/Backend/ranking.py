from Backend.lda_score import calculate_similarity_using_lda
from Backend.word2vec import calculate_similarity_using_word2vec

def calculate_similarity(cv, job):
    """
    Calculate the similarity score for a single CV and job description.
    """
    lda_score = calculate_similarity_using_lda(cv, job)
    word2vec_score = calculate_similarity_using_word2vec(cv, job)
    similarity = 0.4 * lda_score + 0.6 * word2vec_score
    return similarity

def rank_cvs(cvs, job_description):
    """
    Calculate similarity scores for a list of CVs and return the scores in the same order as the CVs.
    """
    scores = []
    for cv in cvs:
        # Calculate similarity score for each CV
        score = calculate_similarity(str(cv), str(job_description))
        scores.append(score)
    return scores
