from Backend.lda_score import calculate_similarity_using_lda
from Backend.word2vec import calculate_similarity_using_word2vec
from Backend.enhancer_module import enhance_description  

def calculate_combined_similarity(cv_data, job_data):
    """
    Calculate the combined similarity score using LDA and Word2Vec.
    """
    lda_similarity = calculate_similarity_using_lda(cv_data, job_data)
    word2vec_similarity = calculate_similarity_using_word2vec(cv_data, job_data)
    
    # Combine the scores (you can adjust the weights as needed)
    combined_similarity = 0.4 * lda_similarity + 0.6 * word2vec_similarity
    return combined_similarity

def rank_and_rearrange(items, job_description, item_type):
    """
    Rank and rearrange a list of items (projects, experience, etc.) based on their similarity to the job description.
    """
    ranked_items = []

    for item in items:
        if item_type in ["skills", "certifications"]:
            item_text = str(item)  # Convert to string
        else:
            if item_type == "projects":
                item_text = f"{item.get('title', '')} {item.get('description', '')} {item.get('technologies', '')}"
            elif item_type == "experience":
                item_text = f"{item.get('company', '')} {item.get('position', '')} {item.get('details', '')}"
            elif item_type == "publications":
                item_text = f"{item.get('title', '')} {item.get('link', '')} {item.get('date', '')}"

        # Ensure item_text is a string
        item_text = str(item_text)

        # Validate job_description
        if not isinstance(job_description, str):
            job_description = str(job_description)

        # Calculate similarity score
        similarity_score = calculate_combined_similarity(item_text, job_description)
        
        ranked_items.append({
            "item": item,
            "score": similarity_score
        })

    ranked_items.sort(key=lambda x: x["score"], reverse=True)
    sorted_items = [item["item"] for item in ranked_items]

    return sorted_items

def adjust_content_length(items, target_word_count):
    """
    Adjust the content length to match the target word count.
    """
    total_words = sum(len(str(item).split()) for item in items)
    
    while total_words > target_word_count:
        # Remove the item with the lowest similarity score
        items.pop()
        total_words = sum(len(str(item).split()) for item in items)
    
    item_number = 0
    while total_words < target_word_count and item_number < len(items):
        # Enhance the description of the first item (highest similarity score)
        items[item_number] = enhance_description(items[item_number])
        item_number += 1
        total_words = sum(len(str(item).split()) for item in items)
    
    return items

def customize_resume(user, job):
    """
    Customize the user's resume by ranking and rearranging projects, experience, publications, skills, and certifications.
    Ensure that projects, experience, and publications combined cover 2/3 of a letter-size page.
    """
    job_description = str(job)
    
    # Rank and rearrange each section
    user["projects"] = rank_and_rearrange(user["projects"], job_description, "projects")
    user["experience"] = rank_and_rearrange(user["experience"], job_description, "experience")
    user["publications"] = rank_and_rearrange(user["publications"], job_description, "publications")
    user["skills"] = rank_and_rearrange(user["skills"], job_description, "skills")
    user["certifications"] = rank_and_rearrange(user["certifications"], job_description, "certifications")

    # Combine projects, experience, and publications
    combined_items = user["projects"] + user["experience"] + user["publications"]
    
    
    target_word_count = 300
    
    # Adjust the content length
    adjusted_items = adjust_content_length(combined_items, target_word_count)
    
    # Distribute the adjusted items back to their respective sections
    # This is a simplified distribution, you might need a more sophisticated approach
    user["projects"] = adjusted_items[:len(user["projects"])]
    user["experience"] = adjusted_items[len(user["projects"]):len(user["projects"]) + len(user["experience"])]
    user["publications"] = adjusted_items[len(user["projects"]) + len(user["experience"]):]
    
    return user