from typing import List, Set

SKILL_MAPPING = {
    "reactjs": "React",
    "react.js": "React",
    "react": "React",
    
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "node": "Node.js",
    
    "typescript": "TypeScript",
    "ts": "TypeScript",
    
    "javascript": "JavaScript",
    "js": "JavaScript",
    
    "nextjs": "Next.js",
    "next.js": "Next.js",
    
    "vuejs": "Vue.js",
    "vue.js": "Vue.js",
    "vue": "Vue.js",
    
    "angular": "Angular",
    "angularjs": "Angular",
    
    "aws": "AWS",
    "amazon web services": "AWS",
    
    "gcp": "GCP",
    "google cloud": "GCP",
    
    "azure": "Azure",
    
    "docker": "Docker",
    
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    
    "html": "HTML",
    "html5": "HTML",
    
    "css": "CSS",
    "css3": "CSS",
    
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    
    "springboot": "Spring Boot",
    "spring boot": "Spring Boot",
    "spring": "Spring Boot",
    
    "django": "Django",
    "flask": "Flask",
    "python": "Python",
    "java": "Java",
    "golang": "Go",
    "go": "Go",
    "rust": "Rust",
    "ruby": "Ruby",
    "php": "PHP",
    "laravel": "Laravel",
    
    "mysql": "MySQL",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "redis": "Redis",
    "sqlite": "SQLite",
    
    "git": "Git",
    "github": "Git",
    "gitlab": "Git",
    "ci/cd": "CI/CD",
    "jenkins": "Jenkins",
    "linux": "Linux",
    "graphql": "GraphQL",
    "rest": "REST API",
    "api": "REST API"
}

def normalize_skill(skill: str) -> str:
    """
    Normalizes a single skill string to a canonical representation.
    """
    cleaned = skill.strip().lower()
    return SKILL_MAPPING.get(cleaned, skill.strip())

def normalize_skills_list(skills: List[str]) -> List[str]:
    """
    Cleans, normalizes, and deduplicates a list of skills.
    """
    normalized_set = set()
    for s in skills:
        if s:
            normalized_set.add(normalize_skill(s))
    return sorted(list(normalized_set))
