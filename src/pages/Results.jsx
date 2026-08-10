
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = localStorage.getItem("interviewResults");

    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (error) {
        console.error("Result parsing error:", error);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">

          <div className="text-5xl mb-5">
            📊
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            No Interview Results
          </h1>

          <p className="text-gray-600 mb-6">
            Complete an interview first to see your AI-generated performance report.
          </p>

          <button
            onClick={() => navigate("/interview")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Interview 🚀
          </button>

        </div>
      </div>
    );
  }

  const score = Number(result.score) || 0;

  let scoreMessage = "Keep practicing! 💪";

  if (score >= 80) {
    scoreMessage = "Excellent performance! 🌟";
  } else if (score >= 60) {
    scoreMessage = "Good performance! 👍";
  } else if (score >= 40) {
    scoreMessage = "You're making progress! 🚀";
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            AI Interview Report
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interview Results 🎉
          </h1>

          <p className="text-gray-600">
            Here's a detailed analysis of your interview performance.
          </p>

        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">

          <p className="text-gray-500 font-medium mb-2">
            Overall Score
          </p>

          <div className="text-6xl font-bold text-blue-600 mb-3">
            {score}
            <span className="text-2xl text-gray-400">
              /100
            </span>
          </div>

          <p className="text-lg font-semibold text-gray-800 mb-2">
            {scoreMessage}
          </p>

          <p className="text-gray-600 max-w-2xl mx-auto">
            {result.feedback}
          </p>

        </div>

        {/* Individual Evaluations */}
        <div className="space-y-6">

          {result.evaluatedAnswers?.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >

              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Question {item.questionNumber}
                </h2>

                <span className="inline-flex items-center justify-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold">
                  {item.score}/100
                </span>

              </div>

              {/* Question */}
              <div className="mb-5">

                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Question
                </p>

                <p className="text-gray-800 font-medium">
                  {item.question ||
                    `Question ${item.questionNumber}`}
                </p>

              </div>

              {/* Answer */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-5">

                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Your Answer
                </p>

                <p className="text-gray-700 leading-relaxed">
                  {item.answer || "No answer provided."}
                </p>

              </div>

              {/* AI Feedback */}
              <div className="mb-5">

                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  AI Feedback
                </p>

                <p className="text-gray-700 leading-relaxed">
                  {item.feedback || "No feedback available."}
                </p>

              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Strengths */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">

                  <h3 className="font-bold text-gray-900 mb-3">
                    ✅ Strengths
                  </h3>

                  {item.strengths?.length > 0 ? (
                    <ul className="space-y-2 text-gray-700">

                      {item.strengths.map((strength, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-green-600">
                            •
                          </span>

                          <span>
                            {strength}
                          </span>
                        </li>
                      ))}

                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No strengths provided.
                    </p>
                  )}

                </div>

                {/* Improvements */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">

                  <h3 className="font-bold text-gray-900 mb-3">
                    🎯 Areas to Improve
                  </h3>

                  {item.improvements?.length > 0 ? (
                    <ul className="space-y-2 text-gray-700">

                      {item.improvements.map(
                        (improvement, i) => (
                          <li key={i} className="flex gap-2">

                            <span className="text-orange-600">
                              •
                            </span>

                            <span>
                              {improvement}
                            </span>

                          </li>
                        )
                      )}

                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No improvements provided.
                    </p>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

          <button
            onClick={() => navigate("/interview")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Take Another Interview
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            ← Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

export default Results;
