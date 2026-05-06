import { MapPin, DollarSign, Briefcase, Clock } from 'lucide-react';
import Button from '../common/Button';

export default function JobCard({ job }) {
  return (
    <div className="card-custom p-6 flex flex-col h-full group">
      {/* Header: Company & Title */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-gray-500 font-medium">{job.company}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">
          {job.company.charAt(0)}
        </div>
      </div>

      {/* Meta Info */}
      <div className="space-y-2 mb-6 text-sm text-gray-600 flex-grow">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-400" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-gray-400" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>Posted {job.postedAt}</span>
        </div>
      </div>

      {/* Skills/Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer / CTA */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}
