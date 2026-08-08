import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">

        <h1 className="text-5xl font-bold text-gray-900">
          AI Interview Platform
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Practice AI-powered mock interviews, improve your interview skills,
          and confidently crack your dream job.
        </p>

        <div className="mt-8 flex gap-4">

          <button
            onClick={() => navigate("/questions")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Interview
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Login
          </button>

        </div>

      </section>

      <section className="py-20 px-6 bg-white">

        <h2 className="text-4xl font-bold text-center mb-12">
          Our Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              🤖 AI Mock Interview
            </h3>
            <p className="text-gray-600">
              Practice interviews with AI-generated questions.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              📄 Resume Analyzer
            </h3>
            <p className="text-gray-600">
              Get AI-powered suggestions to improve your resume.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              💻 Coding Practice
            </h3>
            <p className="text-gray-600">
              Solve coding challenges and prepare for interviews.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              📊 Performance Analytics
            </h3>
            <p className="text-gray-600">
              Track your interview performance.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;