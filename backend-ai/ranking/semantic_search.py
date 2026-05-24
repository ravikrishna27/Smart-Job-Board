import math
import re
from typing import List, Dict, Any, Tuple
from utils.skill_normalizer import normalize_skills_list

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "of", 
    "about", "as", "is", "are", "was", "were", "be", "been", "being", "that", "this", "these", 
    "those", "have", "has", "had", "do", "does", "did", "i", "you", "he", "she", "it", "we", "they"
}

def clean_and_tokenize(text: str) -> List[str]:
    """
    Cleans text, removes punctuation, downcases, removes stopwords, and tokenizes.
    """
    if not text:
        return []
    # Replace special characters and punctuation with spaces
    cleaned = re.sub(r'[^\w\s\-\#\.\+]', ' ', text.lower())
    tokens = cleaned.split()
    return [t for t in tokens if t not in STOPWORDS and len(t) > 1]

def calculate_term_frequencies(tokens: List[str]) -> Dict[str, float]:
    """
    Computes Term Frequency (TF) for a tokenized text.
    """
    if not tokens:
        return {}
    tf = {}
    for token in tokens:
        tf[token] = tf.get(token, 0) + 1
    total_tokens = len(tokens)
    return {word: count / total_tokens for word, count in tf.items()}

def compute_idf(corpus_tokens: List[List[str]]) -> Dict[str, float]:
    """
    Computes Inverse Document Frequency (IDF) for all words in the corpus documents.
    IDF = ln(1 + (N / (1 + doc_freq)))
    """
    num_docs = len(corpus_tokens)
    doc_frequencies = {}
    for tokens in corpus_tokens:
        unique_tokens = set(tokens)
        for token in unique_tokens:
            doc_frequencies[token] = doc_frequencies.get(token, 0) + 1
            
    idf = {}
    for word, freq in doc_frequencies.items():
        idf[word] = math.log(1 + (num_docs / (1 + freq)))
    return idf

def calculate_tfidf_vector(tf: Dict[str, float], idf: Dict[str, float], vocabulary: Dict[str, int]) -> List[float]:
    """
    Generates a TF-IDF vector of length len(vocabulary) for a document.
    """
    vector = [0.0] * len(vocabulary)
    for word, tf_val in tf.items():
        if word in vocabulary:
            idx = vocabulary[word]
            vector[idx] = tf_val * idf.get(word, 0.0)
    return vector

def calculate_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Computes cosine similarity between two numeric vectors.
    """
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm_a = math.sqrt(sum(a * a for a in vec1))
    norm_b = math.sqrt(sum(b * b for b in vec2))
    
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot_product / (norm_a * norm_b)

def build_corpus_vectors(jobs_list: List[Dict[str, Any]]) -> Tuple[List[List[float]], Dict[str, float], Dict[str, int]]:
    """
    Builds the vocabulary, IDF mapping, and TF-IDF matrices for a list of job documents.
    """
    documents_tokens = []
    for job in jobs_list:
        content = f"{job.get('title', '')} {job.get('company', '')} {job.get('description', '')} {' '.join(job.get('skills', []))}"
        documents_tokens.append(clean_and_tokenize(content))
        
    # Get global vocabulary
    vocab_set = set()
    for tokens in documents_tokens:
        vocab_set.update(tokens)
        
    vocabulary = {word: idx for idx, word in enumerate(sorted(list(vocab_set)))}
    idf = compute_idf(documents_tokens)
    
    tfidf_matrix = []
    for tokens in documents_tokens:
        tf = calculate_term_frequencies(tokens)
        vector = calculate_tfidf_vector(tf, idf, vocabulary)
        tfidf_matrix.append(vector)
        
    return tfidf_matrix, idf, vocabulary

def semantic_search_jobs(query: str, jobs_list: List[Dict[str, Any]], tfidf_matrix: List[List[float]], idf: Dict[str, float], vocabulary: Dict[str, int]) -> List[Dict[str, Any]]:
    """
    Searches jobs by calculating hybrid similarity (Cosine Similarity on query TF-IDF + Skills Overlap).
    """
    query_tokens = clean_and_tokenize(query)
    if not query_tokens or not jobs_list:
        return [{"job": job, "score": 0.0, "cosine_sim": 0.0, "skill_overlap": 0.0} for job in jobs_list]
        
    query_tf = calculate_term_frequencies(query_tokens)
    query_vector = calculate_tfidf_vector(query_tf, idf, vocabulary)
    
    query_skills = set(normalize_skills_list(query_tokens))
    
    scored_results = []
    for idx, job in enumerate(jobs_list):
        job_vector = tfidf_matrix[idx]
        
        # 1. Cosine similarity score
        cosine_sim = calculate_cosine_similarity(query_vector, job_vector)
        
        # 2. Skill overlap score
        job_skills = set(normalize_skills_list(job.get("skills", [])))
        skill_overlap = 0.0
        if query_skills:
            intersection = query_skills.intersection(job_skills)
            skill_overlap = len(intersection) / len(query_skills)
            
        # 3. Hybrid score (0.7 * Cosine Similarity + 0.3 * Skill Overlap)
        hybrid_score = (0.7 * cosine_sim) + (0.3 * skill_overlap)
        
        scored_results.append({
            "job": job,
            "score": round(hybrid_score * 100),
            "cosine_sim": round(cosine_sim * 100),
            "skill_overlap": round(skill_overlap * 100)
        })
        
    # Sort in descending order
    return sorted(scored_results, key=lambda x: x["score"], reverse=True)
