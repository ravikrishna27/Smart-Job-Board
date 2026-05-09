import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { applicationService } from '../../services/applicationService';
import { getErrorMessage } from '../../utils/getErrorMessage';

// File validation schema
const applySchema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters").max(2000, "Cover letter is too long"),
  resume: z.any()
    .refine((files) => files?.length === 1, "Resume is required")
    .refine((files) => files?.[0]?.type === 'application/pdf', "Only .pdf format is supported")
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
});

export default function ApplyModal({ isOpen, onClose, job }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      coverLetter: ""
    }
  });

  const resumeFile = watch('resume');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('jobId', job._id || job.id);
      formData.append('coverLetter', data.coverLetter);
      formData.append('resume', data.resume[0]);

      await applicationService.applyToJob(formData);
      
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Apply to ${job?.company}`}>
      
      {isSuccess ? (
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <p className="text-sm text-gray-600">
            You are applying for the <span className="font-semibold text-gray-900">{job?.title}</span> position.
          </p>

          {/* File Upload UI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF only, max 5MB) *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="resume-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>{resumeFile?.[0] ? resumeFile[0].name : "Upload a file"}</span>
                    <input 
                      id="resume-upload" 
                      type="file" 
                      className="sr-only" 
                      accept=".pdf"
                      {...register('resume')}
                    />
                  </label>
                  {!resumeFile?.[0] && <p className="pl-1">or drag and drop</p>}
                </div>
                {!resumeFile?.[0] && <p className="text-xs text-gray-500">PDF up to 5MB</p>}
              </div>
            </div>
            {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
            <textarea 
              {...register('coverLetter')}
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors resize-none ${errors.coverLetter ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="Why are you a great fit for this role?"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 50 characters.</p>
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
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
