from typing import List, Dict, Any, Optional

class CorpusCache:
    def __init__(self):
        self._jobs: List[Dict[str, Any]] = []
        self._tfidf_matrix: Optional[List[List[float]]] = None
        self._vocabulary: Optional[Dict[str, int]] = None
        self._is_dirty: bool = True

    def is_empty(self) -> bool:
        return len(self._jobs) == 0 or self._is_dirty

    def get_jobs(self) -> List[Dict[str, Any]]:
        return self._jobs

    def set_jobs(self, jobs: List[Dict[str, Any]]):
        self._jobs = jobs
        self._is_dirty = False

    def get_tfidf_data(self):
        return self._tfidf_matrix, self._vocabulary

    def set_tfidf_data(self, matrix: List[List[float]], vocabulary: Dict[str, int]):
        self._tfidf_matrix = matrix
        self._vocabulary = vocabulary
        self._is_dirty = False

    def invalidate(self):
        """
        Invalidates the cache, forcing TF-IDF vectors to rebuild on the next query.
        """
        self._jobs = []
        self._tfidf_matrix = None
        self._vocabulary = None
        self._is_dirty = True
        print("[CACHE] Cache successfully invalidated and flushed.")

# Global cache instance
job_corpus_cache = CorpusCache()
