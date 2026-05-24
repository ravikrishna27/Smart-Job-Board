from typing import List, Dict, Any
from utils.skill_normalizer import normalize_skills_list
from ranking.semantic_search import clean_and_tokenize, calculate_term_frequencies, compute_idf, calculate_tfidf_vector, calculate_cosine_similarity

def calculate_resume_semantic_similarity(resume_text: str, job_description: str) -> float:
    """
    Computes direct TF-IDF Cosine Similarity between a candidate resume text and a job description.
    """
    if not resume_text or not job_description:
        return 0.0
        
    doc1_tokens = clean_and_tokenize(job_description)
    doc2_tokens = clean_and_tokenize(resume_text)
    
    if not doc1_tokens or not doc2_tokens:
        return 0.0
        
    corpus = [doc1_tokens, doc2_tokens]
    vocab = {word: idx for idx, word in enumerate(sorted(list(set(doc1_tokens + doc2_tokens))))}
    idf = compute_idf(corpus)
    
    tf1 = calculate_term_frequencies(doc1_tokens)
    tf2 = calculate_term_frequencies(doc2_tokens)
    
    vec1 = calculate_tfidf_vector(tf1, idf, vocab)
    vec2 = calculate_tfidf_vector(tf2, idf, vocab)
    
    return calculate_cosine_similarity(vec1, vec2)

def calculate_ats_skill_score(extracted_skills: List[str], required_skills: List[str]) -> int:
    """
    Computes ATS match percentage based on canonical normalized skill intersection.
    """
    if not required_skills:
        return 0
        
    extracted_norm = set(normalize_skills_list(extracted_skills))
    required_norm = set(normalize_skills_list(required_skills))
    
    matches = required_norm.intersection(extracted_norm)
    score = int((len(matches) / len(required_norm)) * 100)
    return score

def rank_candidates(job_skills: List[str], job_description: str, candidates_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ranks a list of candidates based on exact skill matches (ATS) and semantic resume-to-job similarity.
    Each candidate item contains: { "application_id": str, "resume_text": str, "extracted_skills": List[str] }
    """
    ranked_candidates = []
    
    for cand in candidates_list:
        ext_skills = cand.get("extracted_skills", [])
        resume_text = cand.get("resume_text", "")
        
        # 1. ATS Match Score
        ats_score = calculate_ats_skill_score(ext_skills, job_skills)
        
        # 2. Semantic Similarity Score
        semantic_sim = calculate_resume_semantic_similarity(resume_text, job_description)
        semantic_percentage = int(semantic_sim * 100)
        
        # 3. Hybrid fit score (0.6 * ATS + 0.4 * Semantic relevance)
        hybrid_score = int((0.6 * ats_score) + (0.4 * semantic_percentage))
        
        ranked_candidates.append({
            "applicationId": cand.get("applicationId"),
            "atsScore": ats_score,
            "semanticScore": semantic_percentage,
            "overallScore": hybrid_score,
            "breakdown": {
                "atsMatch": ats_score,
                "semanticRelevance": semantic_percentage
            }
        })
        
    # Sort by overallScore in descending order
    return sorted(ranked_candidates, key=lambda x: x["overallScore"], reverse=True)
