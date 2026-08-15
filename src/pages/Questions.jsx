import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Questions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get job role and experience from Interview page
  const { jobRole, experience } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // GENERATE AI QUESTIONS
  // =====================================================

  useEffect(() => {
    const generateQuestions = async () => {
      if (!jobRole || !experience) {
        alert("Please select job role and experience first.");
        navigate("/interview");
        return;
      }

      try {
        setLoadingQuestions(true);

        const response = await fetch(
          "http://localhost:5000/generate-questions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobRole,
              experience,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to generate questions"
          );
        }

        if (!data.questions || data.questions.length === 0) {
          throw new Error("No questions were generated.");
        }

        setQuestions(data.questions);
      } catch (error) {
        console.error("Question Generation Error:", error);

       alert(
        error.message || "Unable to generate interview questions."
        );

        navigate("/interview");
      } finally {
        setLoadingQuestions(false);
      }
    };

    generateQuestions();
  }, [jobRole, experience, navigate]);

  // =====================================================
  // NEXT QUESTION
  // =====================================================

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

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;

      setCurrentQuestion(nextIndex);
      setAnswer(updatedAnswers[nextIndex]?.answer || "");
    } else {
      // Last question
      evaluateInterview(updatedAnswers);
    }
  };

  // =====================================================
  // PREVIOUS QUESTION
  // =====================================================

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

  // =====================================================
  // AI EVALUATION
  // =====================================================

  const evaluateInterview = async (finalAnswers) => {
    try {
      setLoading(true);

      const response = await fetch(
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

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md w-full">

          <div className="text-5xl mb-4">
            🤖
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Generating Your Interview
          </h1>

          <p className="text-gray-600 mb-4">
            AI is preparing questions based on:
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-blue-700">
              {jobRole}
            </p>

            <p className="text-sm text-blue-600 mt-1">
              {experience}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Please wait a moment...
          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // SAFETY CHECK
  // =====================================================

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No interview questions available.
          </p>

          <button
            onClick={() => navigate("/interview")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Start Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // INTERVIEW UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">

        {/* Header */}

        <div className="mb-6">

          <div className="flex justify-between items-center mb-4">

            <div>
              <p className="text-sm text-gray-500">
                {jobRole}
              </p>

              <p className="text-sm text-blue-600 font-medium">
                {experience}
              </p>
            </div>

            <div className="text-sm font-semibold text-gray-600">
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </div>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>

        </div>

        {/* Question */}

        <div className="mb-6">

          <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-3">
            AI Interview Question
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            AI Mock Interview
          </h1>

          <h2 className="text-xl font-semibold text-gray-800">
            {questions[currentQuestion]}
          </h2>

        </div>

        {/* Answer */}

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          disabled={loading}
          className="w-full h-40 border border-gray-300 rounded-lg p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {/* Buttons */}

        <div className="flex justify-between gap-4">

          <button
            onClick={previousQuestion}
            disabled={
              currentQuestion === 0 || loading
            }
            className="px-5 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
          >
            ← Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading
              ? "AI Evaluating..."
              : currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Next →"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Questions;