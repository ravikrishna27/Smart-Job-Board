import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { mockJobs } from '../../data/jobs';
import { salaryRanges as salaryOptions } from '../../data/filterOptions';
import { useDebounce } from '../../hooks/useDebounce';

import JobSearchBar from '../../components/jobs/JobSearchBar';
import JobSidebar from '../../components/jobs/JobSidebar';
import SortDropdown from '../../components/jobs/SortDropdown';
import JobList from '../../components/jobs/JobList';
import EmptyState from '../../components/jobs/EmptyState';
import Button from '../../components/common/Button';

export default function Jobs() {
  // We'll use searchParams to sync state to URL later. For now, simple state.
  const [searchParams, setSearchParams] = useSearchParams();

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Sort state
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Filter state
  const [filters, setFilters] = useState({
    remoteOnly: searchParams.get('remote') === 'true',
    jobTypes: searchParams.getAll('type'),
    experienceLevels: searchParams.getAll('level'),
    salaryRanges: searchParams.getAll('salary'),
  });

  // Action: Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      remoteOnly: false,
      jobTypes: [],
      experienceLevels: [],
      salaryRanges: [],
    });
    setSearchParams({}); // Clear URL
  };

  // Derived State: Filtered & Sorted Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...mockJobs];

    // 1. Search Query
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some(skill => skill.toLowerCase().includes(q))
      );
    }

    // 2. Remote Only
    if (filters.remoteOnly) {
      result = result.filter(job => job.isRemote);
    }

    // 3. Job Types
    if (filters.jobTypes.length > 0) {
      result = result.filter(job => filters.jobTypes.includes(job.type));
    }

    // 4. Experience Levels
    if (filters.experienceLevels.length > 0) {
      result = result.filter(job => filters.experienceLevels.includes(job.experienceLevel));
    }

    // 5. Salary Ranges
    if (filters.salaryRanges.length > 0) {
      // Find the actual min/max values for the selected labels
      const selectedRanges = salaryOptions.filter(opt => filters.salaryRanges.includes(opt.label));
      
      result = result.filter(job => {
        // A job passes if its baseSalary falls in AT LEAST ONE selected range
        return selectedRanges.some(range => job.baseSalary >= range.min && job.baseSalary <= range.max);
      });
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === 'highest_salary') {
        return b.baseSalary - a.baseSalary;
      }
      if (sortBy === 'newest') {
        return new Date(b.postedDate) - new Date(a.postedDate);
      }
      // 'relevant' is default (no explicit sort, or could do search rank)
      return 0; 
    });

    return result;
  }, [debouncedSearch, filters, sortBy]);

  // Sync state changes to URL
  useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (filters.remoteOnly) params.set('remote', 'true');
    filters.jobTypes.forEach(t => params.append('type', t));
    filters.experienceLevels.forEach(l => params.append('level', l));
    filters.salaryRanges.forEach(s => params.append('salary', s));
    
    // We only update if it actually changed, to prevent infinite loops 
    // In a real app, you might use a custom hook for this 2-way binding.
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters, sortBy, setSearchParams]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-custom">
        
        {/* Header & Main Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Next Job</h1>
          <JobSearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <JobSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            filters={filters}
            setFilters={setFilters}
            clearFilters={handleClearFilters}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Controls Bar (Mobile Filter Toggle & Sort) */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <Button 
                variant="outline" 
                className="lg:hidden"
                icon={<Filter size={18} />}
                onClick={() => setIsSidebarOpen(true)}
              >
                Filters
              </Button>
              
              <div className="ml-auto">
                <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Dynamic Job Rendering */}
            {filteredAndSortedJobs.length > 0 ? (
              <JobList jobs={filteredAndSortedJobs} />
            ) : (
              <EmptyState clearFilters={handleClearFilters} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
