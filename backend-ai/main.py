from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from services.pdf_parser import extract_text_from_pdf_url
from services.nlp_analyzer import analyze_resume_text

# Step 15 Service Imports
from recommenders.job_recommender import recommend_jobs_to_student
from ranking.semantic_search import build_corpus_vectors, semantic_search_jobs
from ranking.applicant_ranker import rank_candidates
from analytics.dashboard_analytics import analyze_student_skill_gaps, analyze_recruiter_talent_pool
from cache.corpus_cache import job_corpus_cache

app = FastAPI(title="Smart Job Board - AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing Request/Response models
class AnalyzeRequest(BaseModel):
    resume_url: str
    job_skills: List[str] = []

class AnalyzeResponse(BaseModel):
    extracted_skills: List[str]
    ats_score: int
    ai_summary: str

# Step 15 Request models
class RecommendJobsRequest(BaseModel):
    student_profile: Dict[str, Any]
    all_jobs: List[Dict[str, Any]]

class SemanticSearchRequest(BaseModel):
    query: str
    all_jobs: List[Dict[str, Any]]

class RankApplicantsRequest(BaseModel):
    job_skills: List[str]
    job_description: str
    candidates_list: List[Dict[str, Any]]

class SkillGapRequest(BaseModel):
    student_skills: List[str]
    applied_jobs_required_skills: List[List[str]]

class RecruiterAnalyticsRequest(BaseModel):
    recruiter_jobs: List[Dict[str, Any]]
    applicants_profiles: List[Dict[str, Any]]

# Existing ATS resume analysis endpoint
@app.post("/analyze-resume", response_model=AnalyzeResponse)
async def analyze_resume(request: AnalyzeRequest):
    try:
        resume_text = await extract_text_from_pdf_url(request.resume_url)
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from the PDF.")
            
        analysis_result = analyze_resume_text(resume_text, request.job_skills)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- STEP 15 NEW ENDPOINTS ---

@app.post("/ai/recommend-jobs")
def recommend_jobs(request: RecommendJobsRequest):
    try:
        recommendations = recommend_jobs_to_student(request.student_profile, request.all_jobs)
        return {"status": "success", "data": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/semantic-search")
def semantic_search(request: SemanticSearchRequest):
    try:
        jobs = request.all_jobs
        
        # Check if cache is empty or job list changed
        if job_corpus_cache.is_empty() or len(job_corpus_cache.get_jobs()) != len(jobs):
            print("[CACHE] Rebuilding TF-IDF job corpus cache...")
            tfidf_matrix, idf, vocabulary = build_corpus_vectors(jobs)
            job_corpus_cache.set_jobs(jobs)
            job_corpus_cache.set_tfidf_data(tfidf_matrix, vocabulary)
            # Store idf in state for fast queries
            app.state.idf = idf
            
        tfidf_matrix, vocabulary = job_corpus_cache.get_tfidf_data()
        idf = getattr(app.state, "idf", {})
        
        results = semantic_search_jobs(request.query, jobs, tfidf_matrix, idf, vocabulary)
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/rank-applicants")
def rank_applicants(request: RankApplicantsRequest):
    try:
        rankings = rank_candidates(request.job_skills, request.job_description, request.candidates_list)
        return {"status": "success", "data": rankings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/skill-gap")
def skill_gap_analysis(request: SkillGapRequest):
    try:
        gap_report = analyze_student_skill_gaps(request.student_skills, request.applied_jobs_required_skills)
        return {"status": "success", "data": gap_report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/recruiter-skill-trends")
def recruiter_skill_trends(request: RecruiterAnalyticsRequest):
    try:
        trends = analyze_recruiter_talent_pool(request.recruiter_jobs, request.applicants_profiles)
        return {"status": "success", "data": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/flush-cache")
def flush_cache():
    job_corpus_cache.invalidate()
    return {"status": "success", "message": "Cache successfully flushed"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Engine (Step 15 Enriched)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
