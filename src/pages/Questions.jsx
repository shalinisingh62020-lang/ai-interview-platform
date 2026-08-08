
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Questions() {
  const navigate = useNavigate();

  const questions = [
    "Tell me about yourself.",
    "What is React?",
    "What is Virtual DOM?",
    "What is the difference between let, var and const?",
    "Explain the useState Hook.",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [evaluating, setEvaluating] = useState(false);

  const nextQuestion = () => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = answer;

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;

      setCurrentQuestion(nextIndex);
      setAnswer(updatedAnswers[nextIndex] || "");
    } else {
      finishInterview(updatedAnswers);
    }
  };

  const previousQuestion = () => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = answer;

    setAnswers(updatedAnswers);

    if (currentQuestion > 0) {
      const previousIndex = currentQuestion - 1;

      setCurrentQuestion(previousIndex);
      setAnswer(updatedAnswers[previousIndex] || "");
    }
  };

  const finishInterview = async (finalAnswers) => {
    setEvaluating(true);

    try {
      // Save answers in MongoDB
      await fetch("http://localhost:5000/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: finalAnswers,
        }),
      });

      // Evaluate answers
      const evaluationResponse = await fetch(
        "http://localhost:5000/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: finalAnswers,
          }),
        }
      );

      const evaluationData = await evaluationResponse.json();

      if (!evaluationResponse.ok) {
        throw new Error(
          evaluationData.message || "Evaluation failed"
        );
      }

      navigate("/results", {
        state: {
          totalQuestions: questions.length,
          answered: finalAnswers.filter(
            (item) => item && item.trim() !== ""
          ).length,
          score: evaluationData.score,
          feedback: evaluationData.feedback,
          evaluatedAnswers: evaluationData.evaluatedAnswers,
        },
      });
    } catch (error) {
      console.log("Evaluation error:", error);

      alert("Could not evaluate interview. Please try again.");
      setEvaluating(false);
    }
  };

  if (evaluating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">
            Evaluating Your Interview 🤖
          </h2>

          <p className="text-gray-600">
            Please wait while we calculate your score...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          AI Interview 🤖
        </h1>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="font-semibold text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {questions[currentQuestion]}
        </h2>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full border rounded-lg p-4 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between mt-6">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Next Question"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Questions;
