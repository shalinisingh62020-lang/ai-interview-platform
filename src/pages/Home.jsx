
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="max-w-3xl">

            <p className="text-blue-200 font-semibold mb-4">
              AI-POWERED INTERVIEW PREPARATION
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Prepare Smarter.
              <br />
              Interview Better. 🚀
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Practice mock interviews, solve coding problems,
              analyze your resume, and improve your performance
              with AI-powered feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">

              <Link
                to="/signup"
                className="bg-white text-blue-600 px-7 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
              >
                Get Started →
              </Link>

              <Link
                to="/login"
                className="border border-white px-7 py-3 rounded-lg font-semibold text-center hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Everything You Need to Prepare 🎯
          </h2>

          <p className="text-gray-500">
            One platform for your complete interview preparation.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Mock Interview */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

            <div className="text-4xl mb-4">
              🎤
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              AI Mock Interview
            </h3>

            <p className="text-gray-500">
              Practice realistic interview questions based on
              your role and experience level.
            </p>

          </div>

          {/* AI Evaluation */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

            <div className="text-4xl mb-4">
              🤖
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              AI Evaluation
            </h3>

            <p className="text-gray-500">
              Get scores, feedback, strengths and improvement
              suggestions for your answers.
            </p>

          </div>

          {/* Coding */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

            <div className="text-4xl mb-4">
              💻
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Coding Practice
            </h3>

            <p className="text-gray-500">
              Solve programming problems and test your solutions
              against multiple test cases.
            </p>

          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

            <div className="text-4xl mb-4">
              📄
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Resume Analysis
            </h3>

            <p className="text-gray-500">
              Upload your resume and discover skills,
              missing skills and improvement suggestions.
            </p>

          </div>

        </div>

      </section>

      {/* How It Works */}
      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>

            <p className="text-gray-500">
              Start preparing in just three simple steps.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="text-center">

              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>

              <h3 className="text-xl font-bold mb-2">
                Choose Your Role
              </h3>

              <p className="text-gray-500">
                Select your desired job role and experience level.
              </p>

            </div>

            <div className="text-center">

              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>

              <h3 className="text-xl font-bold mb-2">
                Practice
              </h3>

              <p className="text-gray-500">
                Answer interview questions and solve coding problems.
              </p>

            </div>

            <div className="text-center">

              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>

              <h3 className="text-xl font-bold mb-2">
                Improve
              </h3>

              <p className="text-gray-500">
                Review your scores and AI feedback to improve.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">

        <div className="max-w-5xl mx-auto text-center px-6 py-16">

          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Ready to Start Your Interview Preparation?
          </h2>

          <p className="text-gray-300 mb-8">
            Practice today and become more confident for your next interview.
          </p>

          <Link
            to="/signup"
            className="inline-block bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Preparing 🚀
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;
