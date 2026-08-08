
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-3">
          AI Mock Interview 🤖
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Select your role and experience level to start your interview.
        </p>

        {/* Job Role */}
        <div className="mb-5">
          <label className="block font-semibold text-gray-700 mb-2">
            Job Role
          </label>

          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Job Role</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">
              Full Stack Developer
            </option>
            <option value="Python Developer">Python Developer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Cybersecurity Analyst">
              Cybersecurity Analyst
            </option>
          </select>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">
            Experience Level
          </label>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1-2 Years">1-2 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </div>

        {/* Start */}
        <button
          onClick={handleStartInterview}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start Interview 🚀
        </button>

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-3 border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Interview;