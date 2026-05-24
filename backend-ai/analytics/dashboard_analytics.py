from typing import List, Dict, Any, Set
from utils.skill_normalizer import normalize_skills_list

def analyze_student_skill_gaps(
    student_skills: List[str],
    applied_jobs_required_skills: List[List[str]]
) -> Dict[str, Any]:
    """
    Computes exact matched, missing, and upskilling strategies for students.
    """
    student_norm = set(normalize_skills_list(student_skills))
    
    # Aggregate all required skills from target jobs
    all_required = set()
    for job_skills in applied_jobs_required_skills:
        all_required.update(normalize_skills_list(job_skills))
        
    matched = all_required.intersection(student_norm)
    missing = all_required.difference(student_norm)
    
    # Sort for consistent display
    matched_list = sorted(list(matched))
    missing_list = sorted(list(missing))
    
    # Generate intelligent improvements
    suggestions = []
    if missing_list:
        primary_missing = missing_list[:3]
        suggestions.append(f"We highly recommend learning {', '.join(primary_missing[:-1])} and {primary_missing[-1]} if you want to complete 100% of your target requirements.")
        suggestions.append("Add a personal project using these technologies to your resume to increase your ATS scoring immediately.")
    else:
        suggestions.append("Outstanding! Your skillset perfectly aligns with all of your target applications. Start preparing for technical interviews!")
        
    # Calculate alignment percentage
    alignment_rate = 100
    if all_required:
        alignment_rate = int((len(matched) / len(all_required)) * 100)
        
    return {
        "alignmentRate": alignment_rate,
        "matchedSkills": matched_list,
        "missingSkills": missing_list,
        "suggestions": suggestions
    }

def analyze_recruiter_talent_pool(
    recruiter_jobs: List[Dict[str, Any]],
    applicants_profiles: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Computes recruiter insights around talent demand vs supply.
    recruiter_jobs: List of jobs, e.g. [{"title": "React Eng", "skills": ["React", "Node"]}]
    applicants_profiles: List of profiles, e.g. [{"name": "A", "skills": ["React"]}]
    """
    demand_counts = {}
    supply_counts = {}
    
    total_jobs = len(recruiter_jobs)
    total_applicants = len(applicants_profiles)
    
    # Count skills in demand
    for job in recruiter_jobs:
        job_skills = normalize_skills_list(job.get("skills", []))
        for skill in job_skills:
            demand_counts[skill] = demand_counts.get(skill, 0) + 1
            
    # Count skills in candidate pool supply
    for app in applicants_profiles:
        app_skills = normalize_skills_list(app.get("skills", []))
        for skill in app_skills:
            supply_counts[skill] = supply_counts.get(skill, 0) + 1
            
    # Calculate shortages
    shortages = []
    for skill, demand_freq in demand_counts.items():
        # Demand rate
        demand_pct = int((demand_freq / max(1, total_jobs)) * 100)
        
        # Supply rate (number of applicants who have it)
        supply_freq = supply_counts.get(skill, 0)
        supply_pct = int((supply_freq / max(1, total_applicants)) * 100)
        
        if demand_pct > 30 and supply_pct < 40:
            shortages.append({
                "skill": skill,
                "deficit": demand_pct - supply_pct,
                "recruiterDemandRate": demand_pct,
                "applicantSupplyRate": supply_pct,
                "message": f"{demand_pct}% of your postings require {skill}, but only {supply_pct}% of candidates possess it."
            })
            
    return {
        "shortages": sorted(shortages, key=lambda x: x["deficit"], reverse=True)[:5],
        "topDemandSkills": sorted([{"skill": s, "count": c} for s, c in demand_counts.items()], key=lambda x: x["count"], reverse=True)[:5],
        "topSupplySkills": sorted([{"skill": s, "count": c} for s, c in supply_counts.items()], key=lambda x: x["count"], reverse=True)[:5]
    }
