import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Resume() {

  const navigate = useNavigate();

  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [resumeText, setResumeText] =
    useState("");

  const [score, setScore] =
    useState(null);

  const [skills, setSkills] =
    useState([]);

  const [missingSkills, setMissingSkills] =
    useState([]);

  const [suggestions, setSuggestions] =
    useState([]);


  // =================================================
  // FILE SELECT
  // =================================================

  const handleFileChange = (e) => {

    const selectedFile =
      e.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    setMessage("");

    setResumeText("");

    setScore(null);

    setSkills([]);

    setMissingSkills([]);

    setSuggestions([]);
  };


  // =================================================
  // ANALYZE RESUME
  // =================================================

  const analyzeResume =
    async () => {

      if (!file) {

        alert(
          "Please upload your resume first."
        );

        return;
      }


      // PDF only
      if (
        file.type !==
        "application/pdf"
      ) {

        alert(
          "Please upload a PDF resume."
        );

        return;
      }


      const formData =
        new FormData();

      formData.append(
        "resume",
        file
      );


      setUploading(true);

      setMessage("");


      try {

        const response =
          await fetch(
            "http://localhost:5000/resume-upload",
            {
              method: "POST",
              body: formData,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setMessage(
            data.message ||
              "Resume analysis failed."
          );

          return;
        }


        // Message
        setMessage(
          "Resume analyzed successfully! 🎉"
        );


        // Data
        setResumeText(
          data.resumeText || ""
        );

        setScore(
          data.score ?? 0
        );

        setSkills(
          data.skills || []
        );

        setMissingSkills(
          data.missingSkills || []
        );

        setSuggestions(
          data.suggestions || []
        );


      } catch (error) {

        console.log(
          "Resume upload error:",
          error
        );

        setMessage(
          "Server error. Please try again."
        );

      } finally {

        setUploading(false);
      }
    };


  // =================================================
  // UI
  // =================================================

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">


        {/* =========================================
            HEADER
        ========================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h1 className="text-3xl font-bold text-center text-blue-600 mb-3">
            Resume Analysis 📄
          </h1>

          <p className="text-center text-gray-600">
            Upload your resume and get an instant analysis.
          </p>

        </div>


        {/* =========================================
            UPLOAD CARD
        ========================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-8">


          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">

            <div className="text-5xl mb-4">
              📄
            </div>


            <h2 className="text-xl font-semibold mb-2">
              Upload Your Resume
            </h2>


            <p className="text-gray-500 mb-5">
              PDF files are supported.
            </p>


            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full border rounded-lg p-3"
            />


            {file && (

              <p className="text-green-600 mt-4 font-semibold">
                Selected: {file.name}
              </p>

            )}

          </div>


          {/* =======================================
              ANALYZE BUTTON
          ======================================= */}

          <button
            onClick={analyzeResume}
            disabled={uploading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >

            {uploading
              ? "Analyzing Resume..."
              : "Analyze Resume"}

          </button>


          {/* =======================================
              MESSAGE
          ======================================= */}

          {message && (

            <div className="mt-5 bg-blue-50 text-blue-700 p-4 rounded-lg text-center">
              {message}
            </div>

          )}

        </div>


        {/* =========================================
            SCORE
        ========================================= */}

        {score !== null && (

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 text-center">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Resume Score
            </h2>


            <div className="text-6xl font-bold text-blue-600">
              {score}/100
            </div>


            <p className="text-gray-500 mt-3">
              Based on skills, projects, experience and education.
            </p>

          </div>

        )}


        {/* =========================================
            SKILLS
        ========================================= */}

        {skills.length > 0 && (

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              🛠️ Skills Found
            </h2>


            <div className="flex flex-wrap gap-3">

              {skills.map(
                (skill) => (

                  <span
                    key={skill}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          </div>

        )}


        {/* =========================================
            MISSING SKILLS
        ========================================= */}

        {missingSkills.length > 0 && (

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              ⚠️ Skills You Can Add
            </h2>


            <div className="flex flex-wrap gap-3">

              {missingSkills.map(
                (skill) => (

                  <span
                    key={skill}
                    className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full"
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          </div>

        )}


        {/* =========================================
            SUGGESTIONS
        ========================================= */}

        {suggestions.length > 0 && (

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              💡 Improvement Suggestions
            </h2>


            <div className="space-y-3">

              {suggestions.map(
                (suggestion, index) => (

                  <div
                    key={index}
                    className="bg-blue-50 text-blue-700 p-4 rounded-lg"
                  >
                    {index + 1}. {suggestion}
                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* =========================================
            EXTRACTED TEXT
        ========================================= */}

        {resumeText && (

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              📋 Extracted Resume Text
            </h2>


            <div className="bg-gray-50 border rounded-lg p-5 max-h-96 overflow-y-auto whitespace-pre-wrap text-gray-700">
              {resumeText}
            </div>

          </div>

        )}


        {/* =========================================
            BACK TO DASHBOARD
        ========================================= */}

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="w-full mt-8 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
        >
          ← Back to Dashboard
        </button>


      </div>

    </div>

  );
}

export default Resume;