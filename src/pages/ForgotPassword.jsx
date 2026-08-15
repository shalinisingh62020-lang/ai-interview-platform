import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://10.199.197.172:5000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setMessage(data.message);
      setEmail("");

    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Server error. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🔐</div>

            <h1 className="text-3xl font-bold text-gray-800">
              Forgot Password?
            </h1>

            <p className="text-gray-500 mt-2">
              Enter your email to receive a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <label className="block font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>

          {message && (
            <p className="text-green-600 text-center mt-5 font-medium">
              {message}
            </p>
          )}

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              ← Back to Login
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;