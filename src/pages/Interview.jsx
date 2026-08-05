import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Interview() {
  const navigate = useNavigate();

  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [questions, setQuestions] = useState("5");

  const handleGenerate = (e) => {
    e.preventDefault();

    if (!jobRole || !experience) {
      alert("Please fill all fields!");
      return;
    }

    navigate("/questions");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          AI Interview Setup
        </h1>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Job Role</label>
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Experience</option>
              <option>Fresher</option>
              <option>1-2 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Number of Questions
            </label>
            <select
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Generate Interview
          </button>
        </form>
      </div>
    </div>
  );
}

export default Interview;