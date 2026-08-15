import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(
    searchParams.get("token") || ""
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://10.199.197.172:5000/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
     console.log("RESET RESPONSE:", data);
     alert(data.message || "Password reset failed");
     return;
    }
      alert("Password reset successfully 🎉");

      navigate("/login");

    } catch (error) {
      console.error("Reset password error:", error);

      alert(
        "Server error. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="text-5xl mb-4">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Reset Password
          </h1>

          <p className="text-gray-500 mt-2">
            Create a new password for your account.
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <form onSubmit={handleResetPassword}>

            {/* Token */}
            <div className="mb-5">

              <label className="block font-semibold text-gray-700 mb-2">
                Reset Token
              </label>

              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter reset token"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* New Password */}
            <div className="mb-5">

              <label className="block font-semibold text-gray-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Confirm Password */}
            <div className="mb-6">

              <label className="block font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading
                ? "Resetting..."
                : "Reset Password →"}
            </button>

          </form>

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

export default ResetPassword;