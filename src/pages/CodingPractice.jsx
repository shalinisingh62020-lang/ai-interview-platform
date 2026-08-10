import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const questions = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers and a target value, return the indices of two numbers that add up to the target.",
    input: "nums = [2, 7, 11, 15], target = 9",
    output: "[0, 1]",
    explanation:
      "The numbers 2 and 7 add up to 9, so their indices are 0 and 1.",
    starterCode: `function twoSum(nums, target) {
  // Write your code here

}`,
  },

  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    description:
      "Write a function that reverses a given string and returns the reversed string.",
    input: 's = "hello"',
    output: '"olleh"',
    explanation:
      "The characters of the string are returned in reverse order.",
    starterCode: `function reverseString(s) {
  // Write your code here

}`,
  },

  {
    id: "find-maximum",
    title: "Find Maximum Number",
    difficulty: "Easy",
    description:
      "Given an array of numbers, return the largest number.",
    input: "nums = [10, 5, 25, 8]",
    output: "25",
    explanation:
      "25 is the largest number in the array.",
    starterCode: `function findMaximum(nums) {
  // Write your code here

}`,
  },

  {
    id: "palindrome",
    title: "Check Palindrome",
    difficulty: "Medium",
    description:
      "Write a function that checks whether a string is a palindrome.",
    input: 's = "madam"',
    output: "true",
    explanation:
      "madam reads the same from both directions.",
    starterCode: `function isPalindrome(s) {
  // Write your code here

}`,
  },

  {
    id: "count-vowels",
    title: "Count Vowels",
    difficulty: "Easy",
    description:
      "Write a function that counts the number of vowels in a string.",
    input: 's = "interview"',
    output: "4",
    explanation:
      "The vowels in interview are i, e, i and e.",
    starterCode: `function countVowels(s) {
  // Write your code here

}`,
  },
];

function CodingPractice() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState(
    questions[0].starterCode
  );

  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [solved, setSolved] = useState([]);

  const currentQuestion = questions[currentIndex];

  const handleQuestionChange = (index) => {
    setCurrentIndex(index);

    setCode(questions[index].starterCode);

    setSubmissionResult(null);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setSubmissionResult({
        success: false,
        message: "Please write some code first.",
      });

      return;
    }

    setLoading(true);
    setSubmissionResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/coding/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problemId: currentQuestion.id,
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Submission failed."
        );
      }

      setSubmissionResult(data);

      if (data.passed) {
        setSolved((previous) => {
          if (previous.includes(currentQuestion.id)) {
            return previous;
          }

          return [...previous, currentQuestion.id];
        });
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message:
          error.message ||
          "Could not connect to the backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode(currentQuestion.starterCode);
    setSubmissionResult(null);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);
      setCode(questions[nextIndex].starterCode);
      setSubmissionResult(null);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;

      setCurrentIndex(previousIndex);
      setCode(
        questions[previousIndex].starterCode
      );
      setSubmissionResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            💻 Coding Practice
          </h1>

          <p className="text-gray-600 mt-2">
            Solve coding problems and test your solutions
            against multiple test cases.
          </p>

          <div className="mt-4 flex flex-wrap gap-4">

            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-700">
                Questions:
              </span>{" "}
              {questions.length}
            </div>

            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-green-700">
                Solved:
              </span>{" "}
              {solved.length}
            </div>

            <div className="bg-purple-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-purple-700">
                Progress:
              </span>{" "}
              {Math.round(
                (solved.length / questions.length) * 100
              )}
              %
            </div>

          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Problems */}
        <div className="bg-white rounded-xl shadow-md p-4 h-fit">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Problems
          </h2>

          <div className="space-y-2">

            {questions.map((question, index) => (

              <button
                key={question.id}
                onClick={() =>
                  handleQuestionChange(index)
                }
                className={`w-full text-left p-3 rounded-lg transition ${
                  currentIndex === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >

                <div className="flex justify-between items-center">

                  <span>
                    {solved.includes(question.id)
                      ? "✅ "
                      : ""}
                    {index + 1}. {question.title}
                  </span>

                  <span className="text-xs">
                    {question.difficulty}
                  </span>

                </div>

              </button>
            ))}

          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-3 space-y-6">

          {/* Problem */}
          <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex justify-between items-center gap-3">

              <h2 className="text-2xl font-bold text-gray-800">
                {currentQuestion.title}
              </h2>

              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                {currentQuestion.difficulty}
              </span>

            </div>

            <p className="text-gray-700 mt-4">
              {currentQuestion.description}
            </p>

            <div className="mt-5">

              <h3 className="font-bold text-gray-800">
                Example
              </h3>

              <div className="bg-gray-900 text-white rounded-lg p-4 mt-2">

                <p>
                  <span className="text-gray-400">
                    Input:
                  </span>{" "}
                  {currentQuestion.input}
                </p>

                <p className="mt-2">
                  <span className="text-gray-400">
                    Output:
                  </span>{" "}
                  {currentQuestion.output}
                </p>

              </div>

            </div>

            <div className="mt-4">

              <h3 className="font-bold text-gray-800">
                Explanation
              </h3>

              <p className="text-gray-600 mt-1">
                {currentQuestion.explanation}
              </p>

            </div>

          </div>

          {/* Editor */}
          <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex justify-between items-center mb-3">

              <h2 className="text-xl font-bold text-gray-800">
                Write Your Solution
              </h2>

              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Reset Code
              </button>

            </div>

            <textarea
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              spellCheck="false"
              className="w-full h-80 bg-gray-900 text-green-400 p-5 rounded-lg font-mono text-sm outline-none resize-none"
            />

            <div className="flex gap-3 mt-4">

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
              >
                {loading
                  ? "⏳ Running Tests..."
                  : "▶ Run Tests"}
              </button>

              <button
                onClick={handleReset}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
              >
                Reset
              </button>

            </div>

          </div>

          {/* Test Results */}
          {submissionResult && (
            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🧪 Test Results
              </h2>

              {!submissionResult.success ? (

                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                  ❌{" "}
                  {submissionResult.message}
                </div>

              ) : (

                <>
                  <div
                    className={`p-4 rounded-lg mb-4 font-semibold ${
                      submissionResult.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {submissionResult.passed
                      ? "🎉 All test cases passed!"
                      : "❌ Some test cases failed."}

                    <div className="mt-1">
                      Passed:{" "}
                      {submissionResult.passedTests}/
                      {submissionResult.totalTests}
                    </div>
                  </div>

                  <div className="space-y-3">

                    {submissionResult.results.map(
                      (test, index) => (

                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            test.passed
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >

                          <div className="font-semibold">
                            {test.passed
                              ? "✅"
                              : "❌"}{" "}
                            Test Case {index + 1}
                          </div>

                          {!test.passed &&
                            test.expected && (
                              <div className="mt-2 text-sm">

                                <p>
                                  <strong>
                                    Expected:
                                  </strong>{" "}
                                  {test.expected}
                                </p>

                                <p>
                                  <strong>
                                    Your Output:
                                  </strong>{" "}
                                  {test.actual ||
                                    test.message ||
                                    "No output"}
                                </p>

                              </div>
                            )}

                          {test.time && (
                            <p className="text-xs text-gray-500 mt-2">
                              Runtime: {test.time}s
                            </p>
                          )}

                          {test.stderr && (
                            <p className="text-sm text-red-600 mt-2">
                              Error: {test.stderr}
                            </p>
                          )}

                        </div>

                      )
                    )}

                  </div>
                </>
              )}

            </div>
          )}

          {/* Navigation */}
          <div className="bg-white rounded-xl shadow-md p-4 flex justify-between">

            <button
              onClick={previousQuestion}
              disabled={currentIndex === 0}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ← Previous
            </button>

            <span className="flex items-center text-gray-600 font-medium">
              {currentIndex + 1} / {questions.length}
            </span>

            <button
              onClick={nextQuestion}
              disabled={
                currentIndex === questions.length - 1
              }
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Next →
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default CodingPractice;