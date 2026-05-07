import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

// 1. Define the validation schema using Zod
const applySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  resumeUrl: z.string().url("Please enter a valid URL to your resume (e.g. Google Drive, Dropbox)"),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters").max(2000, "Cover letter is too long"),
});

export default function ApplyModal({ isOpen, onClose, job }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: "",
      email: "",
      resumeUrl: "",
      portfolioUrl: "",
      coverLetter: ""
    }
  });

  // 3. Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the validated data (in a real app, this goes to backend)
    console.log("Application Data:", data);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Application submitted successfully!");
    
    // Auto-close after brief success state
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    reset(); // Clear form when closed
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Apply to ${job?.company}`}>
      
      {isSuccess ? (
        // Success State UI
        <div className="py-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Application Sent!</h4>
          <p className="text-gray-600">
            The team at {job?.company} will review your application soon. Good luck!
          </p>
        </div>
      ) : (
        // Application Form
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            You are applying for the <span className="font-semibold text-gray-900">{job?.title}</span> position.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input 
              {...register('fullName')}
              type="text" 
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="Jane Doe"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input 
              {...register('email')}
              type="email" 
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="jane@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (URL) *</label>
            <input 
              {...register('resumeUrl')}
              type="url" 
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${errors.resumeUrl ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="https://docs.google.com/..."
            />
            {errors.resumeUrl && <p className="text-red-500 text-xs mt-1">{errors.resumeUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio/LinkedIn (Optional)</label>
            <input 
              {...register('portfolioUrl')}
              type="url" 
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${errors.portfolioUrl ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="https://linkedin.com/in/..."
            />
            {errors.portfolioUrl && <p className="text-red-500 text-xs mt-1">{errors.portfolioUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
            <textarea 
              {...register('coverLetter')}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors resize-none ${errors.coverLetter ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="Why are you a great fit for this role?"
            />
            {errors.coverLetter && <p className="text-red-500 text-xs mt-1">{errors.coverLetter.message}</p>}
          </div>

          <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
            >
              {isSubmitting ? 'Applying...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
