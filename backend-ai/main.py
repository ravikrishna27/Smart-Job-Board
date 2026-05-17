from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

from services.pdf_parser import extract_text_from_pdf_url
from services.nlp_analyzer import analyze_resume_text

app = FastAPI(title="Smart Job Board - AI Resume Parser")

# Enable CORS for Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the Node.js backend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    resume_url: str
    job_skills: List[str] = []

class AnalyzeResponse(BaseModel):
    extracted_skills: List[str]
    ats_score: int
    ai_summary: str

@app.post("/analyze-resume", response_model=AnalyzeResponse)
async def analyze_resume(request: AnalyzeRequest):
    try:
        # 1. Download and parse PDF
        resume_text = await extract_text_from_pdf_url(request.resume_url)
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from the PDF.")
            
        # 2. Analyze text and match with job skills
        analysis_result = analyze_resume_text(resume_text, request.job_skills)
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Resume Parser"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
