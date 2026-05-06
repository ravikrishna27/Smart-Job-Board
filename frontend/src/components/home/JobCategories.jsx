import { mockCategories } from '../../data/categories';
import SectionTitle from '../common/SectionTitle';
import CategoryCard from './CategoryCard';

export default function JobCategories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <SectionTitle 
          title="Browse by Category" 
          subtitle="Find the job that's perfect for you. We have over 10,000 jobs available."
          centered={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
