import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Questions() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const nextQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer(updatedAnswers[currentQuestion + 1] || "");
    } else {
  fetch("http://localhost:5000/answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answers: updatedAnswers,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Interview Completed!");

      navigate("/results", {
        state: {
          totalQuestions: questions.length,
          answered: updatedAnswers.filter(
            (answer) => answer && answer.trim() !== ""
          ).length,
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
};

  const previousQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswer(updatedAnswers[currentQuestion - 1] || "");
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Questions...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          AI Interview
        </h1>

        <h2 className="text-xl font-semibold mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </h2>

        <p className="mb-6 text-lg">
          {questions[currentQuestion]}
        </p>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full border rounded-lg p-3 h-40"
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