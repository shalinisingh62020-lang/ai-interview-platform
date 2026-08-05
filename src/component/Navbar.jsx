import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        
        <h1 className="text-2xl font-bold text-blue-600">
          AI Interview
        </h1>

        <div className="flex gap-6 font-medium">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>

          <Link to="/signup" className="hover:text-blue-600">
            Signup
          </Link>

          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>

          <Link to="/interview" className="hover:text-blue-600">
            Interview
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;