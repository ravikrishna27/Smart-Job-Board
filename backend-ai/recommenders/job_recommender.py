from typing import List, Dict, Any, Tuple
from constants.weights import SKILL_WEIGHT, TITLE_SIMILARITY_WEIGHT, SAVED_JOB_WEIGHT, DIVERSITY_FACTOR
from utils.skill_normalizer import normalize_skills_list, normalize_skill
from ranking.semantic_search import clean_and_tokenize, calculate_term_frequencies, compute_idf, calculate_tfidf_vector, calculate_cosine_similarity

def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Utility to calculate cosine similarity between two text strings.
    """
    if not text1 or not text2:
        return 0.0
    tokens1 = clean_and_tokenize(text1)
    tokens2 = clean_and_tokenize(text2)
    if not tokens1 or not tokens2:
        return 0.0
    vocab = {word: idx for idx, word in enumerate(sorted(list(set(tokens1 + tokens2))))}
    idf = compute_idf([tokens1, tokens2])
    vec1 = calculate_tfidf_vector(calculate_term_frequencies(tokens1), idf, vocab)
    vec2 = calculate_tfidf_vector(calculate_term_frequencies(tokens2), idf, vocab)
    return calculate_cosine_similarity(vec1, vec2)

def recommend_jobs_to_student(
    student_profile: Dict[str, Any],
    all_jobs: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Personalized, explainable, and diverse job recommendation algorithm.
    student_profile format: {
        "skills": List[str],
        "appliedJobTitles": List[str],
        "appliedJobDescriptions": List[str],
        "savedJobTitles": List[str],
        "savedJobDescriptions": List[str]
    }
    """
    if not all_jobs:
        return []

    # 1. Compile student skills
    student_skills = set(normalize_skills_list(student_profile.get("skills", [])))
    
    # 2. Compile student keywords/interest profile
    applied_titles = " ".join(student_profile.get("appliedJobTitles", []))
    applied_descs = " ".join(student_profile.get("appliedJobDescriptions", []))
    saved_titles = " ".join(student_profile.get("savedJobTitles", []))
    saved_descs = " ".join(student_profile.get("savedJobDescriptions", []))
    
    student_title_interests = f"{applied_titles} {saved_titles}"
    student_history_interests = f"{applied_descs} {saved_descs}"

    scored_jobs = []
    
    for job in all_jobs:
        job_id = job.get("_id")
        job_title = job.get("title", "")
        job_industry = job.get("companyIndustry", "General")
        job_skills = set(normalize_skills_list(job.get("skills", [])))
        job_desc = job.get("description", "")
        
        # --- SCORING MODULE ---
        
        # A. Skill Match Score (0 - 100)
        skill_score = 0.0
        matched_skills = []
        if job_skills:
            intersection = job_skills.intersection(student_skills)
            matched_skills = list(intersection)
            skill_score = (len(intersection) / len(job_skills)) * 100.0
            
        # B. Title Similarity Score (0 - 100)
        title_score = 0.0
        if student_title_interests.strip() and job_title.strip():
            title_score = calculate_text_similarity(job_title, student_title_interests) * 100.0
            
        # C. Saved/Application History Score (0 - 100)
        history_score = 0.0
        if student_history_interests.strip() and job_desc.strip():
            history_score = calculate_text_similarity(job_desc, student_history_interests) * 100.0
            
        # Weighted Aggregation
        overall_score = (
            (SKILL_WEIGHT * skill_score) +
            (TITLE_SIMILARITY_WEIGHT * title_score) +
            (SAVED_JOB_WEIGHT * history_score)
        )
        
        # --- EXPLAINABILITY MODULE ---
        reasons = []
        if matched_skills:
            reasons.append(f"Recommended because you know {', '.join(matched_skills[:2])}")
        else:
            reasons.append("Great entry point for your background")
            
        if title_score > 40:
            reasons.append(f"Matches your interest in {job_title} roles")
        elif history_score > 30:
            reasons.append("Aligned with your past search history")
            
        scored_jobs.append({
            "job": job,
            "score": round(overall_score),
            "reasons": reasons[:2], # Cap at 2 high-quality reasons
            "breakdown": {
                "skillsScore": round(skill_score),
                "titleScore": round(title_score),
                "historyScore": round(history_score)
            },
            "industry": job_industry
        })
        
    # --- DIVERSITY / EXPLORATION MODULE ---
    # Sort initially
    scored_jobs = sorted(scored_jobs, key=lambda x: x["score"], reverse=True)
    
    diverse_recommendations = []
    industry_counts = {}
    
    for item in scored_jobs:
        score = item["score"]
        ind = item["industry"] or "General"
        
        # Apply diversity penalty based on category over-representation
        penalty_count = industry_counts.get(ind, 0)
        
        # Penalize if we have already recommended 2+ of the same industry
        if penalty_count >= 1:
            penalty = round(penalty_count * DIVERSITY_FACTOR * 10)
            score = max(5, score - penalty)
            item["score"] = score
            
        diverse_recommendations.append(item)
        industry_counts[ind] = industry_counts.get(ind, 0) + 1
        
    # Re-sort after applying diversity adjustments
    return sorted(diverse_recommendations, key=lambda x: x["score"], reverse=True)
