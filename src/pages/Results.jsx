import { useLocation } from "react-router-dom";

function Results() {
  const location = useLocation();

  const { totalQuestions, answered } = location.state || {
    totalQuestions: 0,
    answered: 0,
  };

  const score =
    totalQuestions > 0
      ? Math.round((answered / totalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl text-center">

        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 Interview Completed
        </h1>

        <div className="space-y-4 text-left mt-6">
          <div className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span>Total Questions</span>
            <span className="font-bold">{totalQuestions}</span>
          </div>

          <div className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span>Answered</span>
            <span className="font-bold">{answered}</span>
          </div>

          <div className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span>Score</span>
            <span className="font-bold text-blue-600">{score}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Results;