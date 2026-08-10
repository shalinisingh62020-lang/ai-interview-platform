
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const stats = [
    {
      title: "Total Interviews",
      value: "15",
      icon: "🎤",
    },
    {
      title: "Average Score",
      value: "82%",
      icon: "📊",
    },
    {
      title: "Coding Questions",
      value: "120",
      icon: "💻",
    },
    {
      title: "Resume Score",
      value: "90%",
      icon: "📄",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-8 mb-8">

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome to AI Interview Platform 👋
          </h1>

          <p className="text-blue-100 text-lg">
            Improve your interview skills, practice coding,
            and get AI-powered feedback.
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >

              <div className="flex justify-between items-center mb-4">

                <div className="text-4xl">
                  {stat.icon}
                </div>

                <span className="text-sm text-gray-400">
                  Overview
                </span>

              </div>

              <h2 className="text-gray-500 font-medium mb-2">
                {stat.title}
              </h2>

              <p className="text-3xl font-bold text-gray-800">
                {stat.value}
              </p>

            </div>
          ))}

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Quick Actions 🚀
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Interview */}
            <button
              onClick={() => navigate("/interview")}
              className="text-left border rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition"
            >

              <div className="text-3xl mb-3">
                🎤
              </div>

              <h3 className="text-xl font-bold mb-2">
                Start Interview
              </h3>

              <p className="text-gray-500">
                Practice a new AI mock interview.
              </p>

            </button>

            {/* Coding */}
            <button
              onClick={() => navigate("/coding-practice")}
              className="text-left border rounded-xl p-6 hover:border-purple-500 hover:shadow-md transition"
            >

              <div className="text-3xl mb-3">
                💻
              </div>

              <h3 className="text-xl font-bold mb-2">
                Coding Practice
              </h3>

              <p className="text-gray-500">
                Solve coding problems and test your skills.
              </p>

            </button>

            {/* Resume */}
            <button
              onClick={() => navigate("/resume")}
              className="text-left border rounded-xl p-6 hover:border-green-500 hover:shadow-md transition"
            >

              <div className="text-3xl mb-3">
                📄
              </div>

              <h3 className="text-xl font-bold mb-2">
                Analyze Resume
              </h3>

              <p className="text-gray-500">
                Upload your resume and get an AI-style analysis.
              </p>

            </button>

          </div>

        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Progress 📈
          </h2>

          {/* Interview Progress */}
          <div className="mb-5">

            <div className="flex justify-between mb-2">

              <span className="font-medium text-gray-700">
                Interview Preparation
              </span>

              <span className="font-semibold text-blue-600">
                75%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div className="bg-blue-600 h-3 rounded-full w-3/4"></div>

            </div>

          </div>

          {/* Coding Progress */}
          <div>

            <div className="flex justify-between mb-2">

              <span className="font-medium text-gray-700">
                Coding Practice
              </span>

              <span className="font-semibold text-purple-600">
                60%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div className="bg-purple-600 h-3 rounded-full w-3/5"></div>

            </div>

          </div>

        </div>

        {/* Logout */}
        <div className="flex justify-center mt-8 mb-4">

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition shadow-md"
          >
            Logout 🚪
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
