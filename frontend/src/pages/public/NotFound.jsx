import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

export default function NotFound() {
  return (
    <div className="container-custom py-20 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to={ROUTES.HOME} className="btn-primary">
        Return to Home
      </Link>
    </div>
  );
}
