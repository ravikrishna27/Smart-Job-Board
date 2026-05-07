import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import Button from '../common/Button';

export default function SaveJobButton({ jobId }) {
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const saved = isJobSaved(jobId);

  const handleToggle = () => {
    toggleSaveJob(jobId);
    if (!saved) {
      toast.success('Job saved successfully!');
    } else {
      toast.info('Job removed from saved jobs.');
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleToggle}
      className={`p-3 ${saved ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300' : 'text-gray-500'}`}
      aria-label={saved ? "Unsave job" : "Save job"}
    >
      <Heart 
        size={20} 
        className={saved ? "fill-current" : ""} 
      />
    </Button>
  );
}
