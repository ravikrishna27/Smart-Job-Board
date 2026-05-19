import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { salaryRanges as salaryOptions } from '../../data/filterOptions';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/getErrorMessage';

import JobSearchBar from '../../components/jobs/JobSearchBar';
import JobSidebar from '../../components/jobs/JobSidebar';
import SortDropdown from '../../components/jobs/SortDropdown';
import JobList from '../../components/jobs/JobList';
import EmptyState from '../../components/jobs/EmptyState';
import Button from '../../components/common/Button';

// A simple Skeleton Card for loading states
const JobSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // API State
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, count: 0 });

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Sort state
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');

  // Filter state
  const [filters, setFilters] = useState({
    jobTypes: searchParams.get('jobType') ? searchParams.get('jobType').split(',') : [],
    experienceLevels: searchParams.get('experienceLevel') ? searchParams.get('experienceLevel').split(',') : [],
    salaryRanges: [],
    remoteOnly: false,
    location: searchParams.get('location') || '',
  });

  // Action: Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ jobTypes: [], experienceLevels: [], salaryRanges: [], remoteOnly: false, location: '' });
    setSortBy('-createdAt');
    setSearchParams({});
  };

  // Sync state changes to URL
  useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('keyword', debouncedSearch);
    if (sortBy && sortBy !== '-createdAt') params.set('sort', sortBy);
    if (filters.jobTypes && filters.jobTypes.length > 0) params.set('jobType', filters.jobTypes.join(','));
    if (filters.experienceLevels && filters.experienceLevels.length > 0) params.set('experienceLevel', filters.experienceLevels.join(','));
    if (filters.location) params.set('location', filters.location);
    
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters, sortBy, setSearchParams]);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const params = {
          keyword: debouncedSearch || undefined,
          jobType: filters.jobTypes?.length > 0 ? filters.jobTypes.join(',') : undefined,
          experienceLevel: filters.experienceLevels?.length > 0 ? filters.experienceLevels.join(',') : undefined,
          location: filters.location || undefined,
          sort: sortBy,
          page: 1,
          limit: 10
        };

        const response = await jobService.getJobs(params);
        setJobs(response.data);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          count: response.count
        });
      } catch (error) {
        toast.error('Failed to fetch jobs: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [debouncedSearch, filters, sortBy]);

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
            {/* Controls Bar */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <Button 
                variant="outline" 
                className="lg:hidden"
                icon={<Filter size={18} />}
                onClick={() => setIsSidebarOpen(true)}
              >
                Filters
              </Button>
              
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing {pagination.count} results
              </div>

              <div className="ml-auto">
                <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Dynamic Job Rendering */}
            <div className="space-y-4">
              {isLoading ? (
                // Show Skeletons
                <>
                  <JobSkeleton />
                  <JobSkeleton />
                  <JobSkeleton />
                  <JobSkeleton />
                </>
              ) : jobs.length > 0 ? (
                <JobList jobs={jobs} />
              ) : (
                <EmptyState clearFilters={handleClearFilters} />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
