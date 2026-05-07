import { jobTypes, experienceLevels, salaryRanges } from '../../data/filterOptions';

export default function JobFilters({ filters, setFilters, clearFilters }) {
  
  // Helper to handle checkbox toggles for array-based filters
  const handleArrayFilterToggle = (category, value) => {
    setFilters(prev => {
      const currentList = prev[category] || [];
      if (currentList.includes(value)) {
        // Remove it
        return { ...prev, [category]: currentList.filter(item => item !== value) };
      } else {
        // Add it
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Remote Toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center">
          <input 
            type="checkbox" 
            className="peer sr-only" 
            checked={filters.remoteOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, remoteOnly: e.target.checked }))}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
        <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Remote Only</span>
      </label>

      {/* Job Type */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Job Type</h4>
        <div className="space-y-2">
          {jobTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={filters.jobTypes.includes(type)}
                onChange={() => handleArrayFilterToggle('jobTypes', type)}
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Experience Level</h4>
        <div className="space-y-2">
          {experienceLevels.map(level => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={filters.experienceLevels.includes(level)}
                onChange={() => handleArrayFilterToggle('experienceLevels', level)}
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Salary Range</h4>
        <div className="space-y-2">
          {salaryRanges.map(range => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={filters.salaryRanges.includes(range.label)}
                onChange={() => handleArrayFilterToggle('salaryRanges', range.label)}
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
