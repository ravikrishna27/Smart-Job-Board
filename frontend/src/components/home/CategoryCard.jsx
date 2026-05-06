import * as Icons from 'lucide-react';

export default function CategoryCard({ category }) {
  // Dynamically resolve the icon component from lucide-react
  const IconComponent = Icons[category.iconName] || Icons.HelpCircle;

  return (
    <div className="card-custom p-6 flex flex-col items-center text-center group cursor-pointer hover:border-blue-200">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        <IconComponent size={32} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
      <p className="text-gray-500">{category.jobCount} Jobs</p>
    </div>
  );
}
