
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Interviews",
      value: "1",
      icon: "🎤",
    },
    {
      title: "Latest Score",
      value: "90%",
      icon: "⭐",
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
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

          <h1 className="text-3xl font-bold text-blue-600">
            Welcome{user?.name ? `, ${user.name}` : ""}! 🚀
          </h1>

          {user?.email && (
            <p className="text-gray-500 mt-2">
              {user.email}
            </p>
          )}

          <p className="text-gray-600 mt-3">
            Prepare smarter, practice better and crack your next interview.
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="text-3xl mb-3">
                {stat.icon}
              </div>

              <h2 className="text-gray-500">
                {stat.title}
              </h2>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stat.value}
              </p>
            </div>
          ))}

        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Mock Interview */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold text-gray-800">
              🎤 Mock Interview
            </h2>

            <p className="text-gray-600 mt-2 mb-4">
              Practice a real interview with AI-generated questions.
            </p>

            <button
              onClick={() => navigate("/interview")}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Start Interview
            </button>

          </div>

          {/* Practice Questions */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold text-gray-800">
              📝 Practice Questions
            </h2>

            <p className="text-gray-600 mt-2 mb-4">
              Improve your interview skills with practice questions.
            </p>

            <button
              onClick={() => navigate("/questions")}
              className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
            >
              Practice Now
            </button>

          </div>

          {/* Resume Analysis */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold text-gray-800">
              📄 Resume Analysis
            </h2>

            <p className="text-gray-600 mt-2 mb-4">
              Analyze your resume and get suggestions to improve it.
            </p>

            <button
              onClick={() => navigate("/resume")}
              className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700"
            >
              Analyze Resume
            </button>

          </div>

        </div>

        {/* Logout */}
        <div className="text-center mt-8">

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 underline"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;