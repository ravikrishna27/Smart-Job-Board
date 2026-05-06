import { Search, MapPin } from 'lucide-react';
import Button from '../common/Button';

export default function SearchBar() {
  return (
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
      {/* Job Title Input */}
      <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
        <Search className="text-gray-400 mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Job title, keyword, or company" 
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 focus:ring-0"
        />
      </div>

      {/* Location Input */}
      <div className="flex-1 flex items-center px-4 py-2">
        <MapPin className="text-gray-400 mr-3" size={20} />
        <input 
          type="text" 
          placeholder="City, state, or remote" 
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 focus:ring-0"
        />
      </div>

      {/* Search Button */}
      <div className="flex-shrink-0 pt-2 md:pt-0">
        <Button variant="primary" className="w-full md:w-auto px-8 py-3 h-full">
          Search Jobs
        </Button>
      </div>
    </div>
  );
}
