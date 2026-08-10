import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          AI Interview 🤖
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 font-medium text-gray-700">

          <Link
            to="/"
            className="hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/interview"
            className="hover:text-blue-600 transition"
          >
            Interview
          </Link>

          <Link
            to="/resume"
            className="hover:text-blue-600 transition"
          >
            Resume
          </Link>

          <Link
            to="/coding-practice"
            className="hover:text-blue-600 transition"
          >
            Coding
          </Link>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;