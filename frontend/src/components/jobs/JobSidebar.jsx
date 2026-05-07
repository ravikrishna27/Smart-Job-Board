import { X } from 'lucide-react';
import JobFilters from './JobFilters';

export default function JobSidebar({ isOpen, onClose, filters, setFilters, clearFilters }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none lg:w-auto lg:shadow-none lg:bg-transparent lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full overflow-y-auto lg:overflow-visible p-6 lg:p-0">
          {/* Mobile Header */}
          <div className="flex justify-between items-center lg:hidden mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="card-custom p-6 sticky top-24">
            <JobFilters 
              filters={filters} 
              setFilters={setFilters} 
              clearFilters={clearFilters}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
