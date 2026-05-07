import { MapPin, DollarSign, Briefcase, Clock, Building } from 'lucide-react';
import Button from '../common/Button';
import SaveJobButton from './SaveJobButton';

export default function JobHeader({ job, onApplyClick }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          {/* Left: Info */}
          <div className="flex items-start gap-6">
            <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl font-bold text-2xl flex-shrink-0">
              {job.company.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4 font-medium">
                <span className="flex items-center gap-1.5 text-gray-900">
                  <Building size={18} className="text-gray-400" /> {job.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={18} className="text-gray-400" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-green-600">
                  <DollarSign size={18} /> {job.salary}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Briefcase size={14} /> {job.type}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {job.experienceLevel}
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Clock size={14} /> Posted {job.postedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 border-t border-gray-100 pt-6 lg:pt-0 lg:border-t-0">
            <SaveJobButton jobId={job.id} />
            <Button variant="primary" className="flex-1 lg:flex-none px-8 py-3 text-lg" onClick={onApplyClick}>
              Apply Now
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
