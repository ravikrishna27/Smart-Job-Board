import { SearchX } from 'lucide-react';
import Button from '../common/Button';

export default function EmptyState({ clearFilters }) {
  return (
    <div className="card-custom p-12 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
        <SearchX size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
      <p className="text-gray-500 max-w-md mb-8">
        We couldn't find any jobs matching your current search and filter criteria. Try adjusting your filters or search terms.
      </p>
      <Button variant="primary" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
}
