import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import Button from '../common/Button';

// Zod Schema matches backend validation
const jobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.coerce.number().min(0, 'Salary cannot be negative'),
  jobType: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Internship']),
  experienceLevel: z.enum(['Entry Level', 'Mid Level', 'Senior Level', 'Executive']),
  isRemote: z.boolean().default(false),
  description: z.string().min(10, 'Description is too short'),
  skills: z.array(z.object({ value: z.string().min(1, 'Skill is required') })).min(1, 'At least one skill is required'),
  requirements: z.array(z.object({ value: z.string() })).optional(),
  responsibilities: z.array(z.object({ value: z.string() })).optional(),
});

export default function JobForm({ initialData, onSubmit, isSubmitting, submitText = 'Save Job' }) {
  // Transform initial flat arrays (['React', 'Node']) to object arrays for useFieldArray ([{ value: 'React' }])
  const defaultValues = {
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    salary: initialData?.salary || 0,
    jobType: initialData?.jobType || 'Full-Time',
    experienceLevel: initialData?.experienceLevel || 'Mid Level',
    isRemote: initialData?.isRemote || false,
    description: initialData?.description || '',
    skills: initialData?.skills ? initialData.skills.map(s => ({ value: s })) : [{ value: '' }],
    requirements: initialData?.requirements ? initialData.requirements.map(r => ({ value: r })) : [{ value: '' }],
    responsibilities: initialData?.responsibilities ? initialData.responsibilities.map(r => ({ value: r })) : [{ value: '' }],
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues
  });

  // Reset form when initialData changes (useful for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  // Field Arrays for dynamic lists
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });
  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({ control, name: 'requirements' });
  const { fields: respFields, append: appendResp, remove: removeResp } = useFieldArray({ control, name: 'responsibilities' });

  const handleFormSubmit = (data) => {
    // Transform object arrays back to flat arrays before submitting to backend
    const formattedData = {
      ...data,
      skills: data.skills.map(s => s.value).filter(Boolean),
      requirements: data.requirements?.map(r => r.value).filter(Boolean) || [],
      responsibilities: data.responsibilities?.map(r => r.value).filter(Boolean) || [],
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      
      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input type="text" {...register('title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Senior Frontend Engineer" />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input type="text" {...register('company')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. TechNova" />
            {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input type="text" {...register('location')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. San Francisco, CA" />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Salary (USD) *</label>
            <input type="number" {...register('salary')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 120000" />
            {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>}
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
            <select {...register('jobType')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            {errors.jobType && <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
            <select {...register('experienceLevel')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
            {errors.experienceLevel && <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>}
          </div>
        </div>

        {/* Remote Checkbox */}
        <div className="flex items-center">
          <input type="checkbox" id="isRemote" {...register('isRemote')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-900">
            This is a remote position
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Description</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
          <textarea {...register('description')} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the role..."></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
      </div>

      {/* Dynamic Arrays */}
      <div className="space-y-8">
        
        {/* Skills */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Required Skills *</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ value: '' })} icon={<Plus size={16} />}>Add Skill</Button>
          </div>
          <div className="space-y-3">
            {skillFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input {...register(`skills.${index}.value`)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. React" />
                <button type="button" onClick={() => removeSkill(index)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>}
        </div>

        {/* Requirements */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendReq({ value: '' })} icon={<Plus size={16} />}>Add Requirement</Button>
          </div>
          <div className="space-y-3">
            {reqFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input {...register(`requirements.${index}.value`)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 3+ years of experience" />
                <button type="button" onClick={() => removeReq(index)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Responsibilities</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendResp({ value: '' })} icon={<Plus size={16} />}>Add Responsibility</Button>
          </div>
          <div className="space-y-3">
            {respFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input {...register(`responsibilities.${index}.value`)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Lead the frontend architecture" />
                <button type="button" onClick={() => removeResp(index)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="pt-6 border-t flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="px-8 py-3">
          {isSubmitting ? 'Saving...' : submitText}
        </Button>
      </div>

    </form>
  );
}
