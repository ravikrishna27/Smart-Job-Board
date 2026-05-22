import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { userService } from '../services/userService';

const STORAGE_KEY = 'smart_job_board_saved_jobs';

export function useSavedJobs() {
  const { user } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState([]);

  // Fetch saved jobs from backend if logged in student, otherwise load from localStorage
  useEffect(() => {
    if (user && user.role === 'student') {
      const fetchSavedJobs = async () => {
        try {
          const response = await userService.getSavedJobs();
          // Extract job IDs
          const ids = response.data.map(job => job._id);
          setSavedJobIds(ids);
        } catch (error) {
          console.warn('Error fetching saved jobs from DB:', error);
        }
      };
      fetchSavedJobs();
    } else {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        setSavedJobIds(item ? JSON.parse(item) : []);
      } catch (error) {
        setSavedJobIds([]);
      }
    }
  }, [user]);

  const toggleSaveJob = async (jobId) => {
    const isSaved = savedJobIds.includes(jobId);
    
    // Optimistic UI update
    setSavedJobIds(prevIds => {
      if (isSaved) {
        return prevIds.filter(id => id !== jobId);
      } else {
        return [...prevIds, jobId];
      }
    });

    if (user && user.role === 'student') {
      try {
        if (isSaved) {
          await userService.unsaveJob(jobId);
        } else {
          await userService.saveJob(jobId);
        }
      } catch (error) {
        console.warn('Failed to sync saved job to DB:', error);
        // Rollback state if failed
        setSavedJobIds(prevIds => {
          if (isSaved) {
            return [...prevIds, jobId];
          } else {
            return prevIds.filter(id => id !== jobId);
          }
        });
      }
    } else {
      // LocalStorage sync
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        let ids = item ? JSON.parse(item) : [];
        if (isSaved) {
          ids = ids.filter(id => id !== jobId);
        } else {
          ids = [...ids, jobId];
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      } catch (error) {
        console.warn('Error saving to local storage', error);
      }
    }
  };

  const isJobSaved = (jobId) => savedJobIds.includes(jobId);

  return {
    savedJobIds,
    toggleSaveJob,
    isJobSaved
  };
}
