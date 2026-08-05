import StatCard from "../component/StatCard";

function Dashboard() {
  const stats = [
    { title: "Total Interviews", value: "15" },
    { title: "Average Score", value: "82%" },
    { title: "Coding Questions", value: "120" },
    { title: "Resume Score", value: "90%" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome 👋
        </h1>

        <p className="text-gray-600 mt-2">
          Ready to practice your next AI interview?
        </p>

        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Start Interview
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3">
          <li>✅ Frontend Developer Interview</li>
          <li>✅ Java Developer Interview</li>
          <li>✅ HR Interview</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;