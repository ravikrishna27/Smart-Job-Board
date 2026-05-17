import spacy
from typing import List, Dict, Any

# Load English tokenizer, tagger, parser, NER and word vectors
# Note: we need to ensure python -m spacy download en_core_web_sm is run before using this
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback/warning if model isn't downloaded yet
    print("Warning: en_core_web_sm model not found. Run: python -m spacy download en_core_web_sm")
    nlp = None

# A basic deterministic list of common tech skills for our rule-based matching
COMMON_SKILLS = {
    "javascript", "js", "python", "java", "c++", "c#", "ruby", "php", "go", "rust", "typescript", "ts",
    "react", "react.js", "reactjs", "angular", "vue", "vue.js", "vuejs", "svelte", "next.js", "nextjs",
    "node.js", "nodejs", "express", "django", "flask", "spring", "spring boot", "laravel",
    "sql", "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "cassandra",
    "aws", "amazon web services", "gcp", "google cloud", "azure", "docker", "kubernetes", "k8s",
    "git", "github", "gitlab", "ci/cd", "jenkins", "linux", "html", "css", "tailwind", "bootstrap"
}

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts technical skills from raw resume text.
    For this implementation, we use a simple rule-based approach matched against a predefined set.
    """
    extracted = set()
    text_lower = text.lower()
    
    # Simple deterministic matching
    for skill in COMMON_SKILLS:
        # We look for the skill surrounded by non-alphanumeric chars to avoid substring matches 
        # (e.g. matching "go" inside "good")
        # In a real app, spaCy's EntityRuler would be better for this.
        if f" {skill} " in f" {text_lower} " or f" {skill}\n" in f" {text_lower} " or f" {skill}," in f" {text_lower} ":
            # Normalize variations
            if skill in ["js"]: skill = "javascript"
            elif skill in ["ts"]: skill = "typescript"
            elif skill in ["reactjs", "react.js"]: skill = "react"
            elif skill in ["nodejs", "node.js"]: skill = "node"
            elif skill in ["nextjs"]: skill = "next.js"
            elif skill in ["vuejs", "vue.js"]: skill = "vue"
            elif skill in ["mongo"]: skill = "mongodb"
            elif skill in ["postgres"]: skill = "postgresql"
            
            extracted.add(skill.capitalize() if skill not in ["aws", "gcp", "ci/cd", "html", "css", "sql"] else skill.upper())
            
    return list(extracted)

def calculate_ats_score(extracted_skills: List[str], required_skills: List[str]) -> int:
    """
    Calculates a basic ATS match score (0-100) based on skill intersection.
    """
    if not required_skills:
        return 0
        
    extracted_lower = [s.lower() for s in extracted_skills]
    required_lower = [s.lower() for s in required_skills]
    
    # Normalize node vs node.js, react vs react.js in required skills just in case
    normalized_reqs = []
    for req in required_lower:
        if req == "node.js": normalized_reqs.append("node")
        elif req == "react.js": normalized_reqs.append("react")
        else: normalized_reqs.append(req)
    
    matches = 0
    for req in normalized_reqs:
        # Check if the required skill exists in extracted skills (or as a substring, e.g. "React" in "React.js")
        if any(req in ext or ext in req for ext in extracted_lower):
            matches += 1
            
    score = int((matches / len(normalized_reqs)) * 100)
    return score

def generate_ai_summary(extracted_skills: List[str], score: int) -> str:
    """
    Generates a brief qualitative summary of the candidate's profile based on extracted data.
    """
    skill_count = len(extracted_skills)
    
    if skill_count == 0:
        return "The resume parser could not identify standard technical skills from the provided document. Manual review recommended."
        
    summary = f"Candidate possesses {skill_count} identifiable technical skills. "
    
    if score >= 80:
        summary += "They appear to be a highly competitive match for this role based on skill requirements."
    elif score >= 50:
        summary += "They meet several core requirements for the role but may require training in some areas."
    else:
        summary += "They appear to be missing significant required skills for this position."
        
    return summary

def analyze_resume_text(text: str, job_skills: List[str] = []) -> Dict[str, Any]:
    """
    Main orchestration function for NLP analysis.
    """
    extracted_skills = extract_skills_from_text(text)
    score = calculate_ats_score(extracted_skills, job_skills)
    summary = generate_ai_summary(extracted_skills, score)
    
    return {
        "extracted_skills": extracted_skills,
        "ats_score": score,
        "ai_summary": summary
    }
