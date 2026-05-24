import React, { useState, useContext } from "react";
import axios from "axios";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContextProvider.jsx";

export default function ProfileSetup() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getCurrentUser } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  // Prevent users from selecting future dates
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateOfBirth) {
      setError("Please select your date of birth");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Update this endpoint to match your user backend route
      await axios.post(
        `${serverUrl}/api/user/complete-profile`,
        {
          dateOfBirth,
        },
        { withCredentials: true },
      );

      // Refresh user context so the modal disappears and app updates
      await getCurrentUser();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setTimeout(() => {
      setLoading(false);
    },200);}
  };

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="bg-white rounded-3xl w-full max-w-md p-8 md:p-10 relative overflow-hidden"
        style={{ boxShadow: "0px 10px 30px rgba(74, 158, 74, 0.2)" }} // Subtle green glow
      >
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-amber-400"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-2">Welcome!</h2>
          <p className="text-gray-500 text-sm md:text-base">
            Let's personalize your experience. When is your birthday?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dob"
              className="text-sm font-semibold text-gray-700 ml-1"
            >
              Date of Birth
            </label>
            <div className="relative">
              <input
                id="dob"
                type="date"
                max={today}
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all date-input cursor-pointer"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs font-medium ml-1 mt-1">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 text-amber-100 font-bold text-lg py-3 rounded-xl hover:bg-green-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-amber-100"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
