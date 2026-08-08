
import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    totalQuestions = 5,
    answered = 0,
    score = 0,
    feedback = "Keep practicing!",
    evaluatedAnswers = [],
  } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Interview Results 🎉
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Here is your interview performance.
        </p>

        {/* Score */}
        <div className="bg-blue-50 rounded-xl p-8 text-center mb-6">
          <p className="text-gray-600 mb-2">
            Your Score
          </p>

          <p className="text-6xl font-bold text-blue-600">
            {score}%
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-gray-50 rounded-xl p-5 text-center">
            <p className="text-gray-500">
              Total Questions
            </p>

            <p className="text-3xl font-bold mt-2">
              {totalQuestions}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 text-center">
            <p className="text-gray-500">
              Answered
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {answered}
            </p>
          </div>

        </div>

        {/* Feedback */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-lg mb-2">
            Overall Feedback 💡
          </h2>

          <p className="text-gray-700">
            {feedback}
          </p>
        </div>

        {/* Individual Results */}
        {evaluatedAnswers.length > 0 && (
          <div className="mb-8">

            <h2 className="text-2xl font-bold mb-4">
              Answer Evaluation 📝
            </h2>

            <div className="space-y-4">

              {evaluatedAnswers.map((item) => (
                <div
                  key={item.questionNumber}
                  className="border rounded-xl p-5"
                >

                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">
                      Question {item.questionNumber}
                    </h3>

                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold">
                      {item.score}%
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">
                    <strong>Your Answer:</strong>{" "}
                    {item.answer || "No answer provided"}
                  </p>

                  <p className="text-gray-700">
                    <strong>Feedback:</strong>{" "}
                    {item.feedback}
                  </p>

                </div>
              ))}

            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">

          <button
            onClick={() => navigate("/interview")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            🔄 Retake Interview
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100"
          >
            🏠 Back to Dashboard
          </button>

        </div>

      </div>
    </div>
  );
}

export default Results;