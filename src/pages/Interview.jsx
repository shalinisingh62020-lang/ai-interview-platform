
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Interview() {
  const navigate = useNavigate();

  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");

  const handleStartInterview = () => {
    if (!jobRole || !experience) {
      alert("Please select job role and experience level");
      return;
    }

    navigate("/questions", {
      state: {
        jobRole,
        experience,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🤖 AI-Powered Interview
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI Mock Interview
          </h1>

          <p className="text-gray-600">
            Choose your role and experience level to begin your
            personalized interview.
          </p>

        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Job Role */}
          <div className="mb-6">

            <label className="block font-semibold text-gray-800 mb-2">
              Job Role
            </label>

            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="">
                Select Job Role
              </option>

              <option value="Frontend Developer">
                Frontend Developer
              </option>

              <option value="Backend Developer">
                Backend Developer
              </option>

              <option value="Full Stack Developer">
                Full Stack Developer
              </option>

              <option value="Python Developer">
                Python Developer
              </option>

              <option value="Java Developer">
                Java Developer
              </option>

              <option value="Cybersecurity Analyst">
                Cybersecurity Analyst
              </option>
            </select>

          </div>

          {/* Experience */}
          <div className="mb-8">

            <label className="block font-semibold text-gray-800 mb-2">
              Experience Level
            </label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="">
                Select Experience
              </option>

              <option value="Fresher">
                Fresher
              </option>

              <option value="1-2 Years">
                1-2 Years
              </option>

              <option value="3-5 Years">
                3-5 Years
              </option>

              <option value="5+ Years">
                5+ Years
              </option>
            </select>

          </div>

          {/* Start Interview */}
          <button
            onClick={handleStartInterview}
            className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Start Interview 🚀
          </button>

          {/* Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-3 border border-gray-300 text-gray-700 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            ← Back to Dashboard
          </button>

        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-sm font-semibold text-gray-800">
              Role Based
            </p>
            <p className="text-xs text-gray-500">
              Questions matched to your role
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">🤖</div>
            <p className="text-sm font-semibold text-gray-800">
              AI Evaluation
            </p>
            <p className="text-xs text-gray-500">
              Get feedback on your answers
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-sm font-semibold text-gray-800">
              Performance
            </p>
            <p className="text-xs text-gray-500">
              Track your interview progress
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Interview;
