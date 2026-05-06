import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import Button from '../common/Button';
import { UserPlus, Briefcase } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="bg-blue-50 rounded-3xl p-10 md:p-16 text-center max-w-5xl mx-auto border border-blue-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to jumpstart your career?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already found their dream jobs or the perfect candidates through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" icon={<UserPlus size={20} />} className="w-full sm:w-auto px-8 py-3">
                Create Account
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" icon={<Briefcase size={20} />} className="w-full sm:w-auto px-8 py-3 bg-white">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
