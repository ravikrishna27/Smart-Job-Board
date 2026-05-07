import { useState, useEffect } from 'react';

const STORAGE_KEY = 'smart_job_board_saved_jobs';

export function useSavedJobs() {
  // Initialize state directly from localStorage if available
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return [];
    }
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobIds));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [savedJobIds]);

  const toggleSaveJob = (jobId) => {
    setSavedJobIds((prevIds) => {
      if (prevIds.includes(jobId)) {
        return prevIds.filter((id) => id !== jobId);
      } else {
        return [...prevIds, jobId];
      }
    });
  };

  const isJobSaved = (jobId) => savedJobIds.includes(jobId);

  return {
    savedJobIds,
    toggleSaveJob,
    isJobSaved
  };
}
