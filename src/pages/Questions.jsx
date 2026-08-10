
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
  const [loading, setLoading] = useState(false);

  const nextQuestion = () => {
    if (!answer.trim()) {
      alert("Please enter your answer first.");
      return;
    }

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = {
      question: questions[currentQuestion],
      answer: answer.trim(),
    };

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;

      setCurrentQuestion(nextIndex);
      setAnswer(updatedAnswers[nextIndex]?.answer || "");
    } else {
      evaluateInterview(updatedAnswers);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = {
      question: questions[currentQuestion],
      answer: answer.trim(),
    };

    setAnswers(updatedAnswers);

    const previousIndex = currentQuestion - 1;

    setCurrentQuestion(previousIndex);
    setAnswer(updatedAnswers[previousIndex]?.answer || "");
  };

  const evaluateInterview = async (finalAnswers) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: finalAnswers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI evaluation failed"
        );
      }

      // Save complete evaluation result
      localStorage.setItem(
        "interviewResults",
        JSON.stringify(data)
      );

      navigate("/results");
    } catch (error) {
      console.error("AI Evaluation Error:", error);

      alert(
        "AI evaluation failed. Please check that the backend and OpenAI API are running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          AI Mock Interview
        </h1>

        <div className="mb-6">
          <p className="text-gray-500 mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>

          <h2 className="text-xl font-semibold">
            {questions[currentQuestion]}
          </h2>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          disabled={loading}
          className="w-full h-40 border border-gray-300 rounded-lg p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0 || loading}
            className="px-5 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "AI Evaluating..."
              : currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Next"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Questions;
