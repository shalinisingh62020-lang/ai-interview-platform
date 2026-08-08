
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Resume() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/resume-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Upload failed");
        return;
      }

      setMessage(
        `Resume uploaded successfully! 🎉 ${data.fileName}`
      );

    } catch (error) {
      console.log("Resume upload error:", error);
      setMessage("Server error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-center text-blue-600 mb-3">
            Resume Analysis 📄
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Upload your resume for analysis.
          </p>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">

            <div className="text-5xl mb-4">
              📄
            </div>

            <h2 className="text-xl font-semibold mb-2">
              Upload Your Resume
            </h2>

            <p className="text-gray-500 mb-5">
              PDF or DOCX files are supported.
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border rounded-lg p-3"
            />

            {file && (
              <p className="text-green-600 mt-4 font-semibold">
                Selected: {file.name}
              </p>
            )}

          </div>

          {/* Analyze */}
          <button
            onClick={analyzeResume}
            disabled={uploading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading
              ? "Uploading Resume..."
              : "Analyze Resume"}
          </button>

          {/* Message */}
          {message && (
            <div className="mt-5 bg-blue-50 text-blue-700 p-4 rounded-lg text-center">
              {message}
            </div>
          )}

          {/* Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-4 border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100"
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

export default Resume;