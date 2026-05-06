import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

export default function Login() {
  return (
    <div className="container-custom py-12 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h1>
        <p className="text-gray-600 text-center mb-6">Login form will go here.</p>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
