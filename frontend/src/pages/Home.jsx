import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
              Report Civic Issues
              <br />
              <span className="text-blue-600">Quickly & Easily</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              CivicConnect helps citizens report potholes, garbage,
              water leaks, streetlight failures and more. Track the
              status of your complaints in real time.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/report"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Report an Issue
              </Link>

              <Link
                to="/dashboard"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="mt-12 md:mt-0 md:w-2/5">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
              alt="City"
              className="rounded-3xl shadow-xl"
            />
          </div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-8 pb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why CivicConnect?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4">
                📸 Upload Images
              </h3>
              <p className="text-gray-600">
                Attach photos of civic problems to provide clear
                evidence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4">
                🤖 AI Assistance
              </h3>
              <p className="text-gray-600">
                Gemini AI improves descriptions and predicts category
                and priority automatically.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4">
                📊 Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor complaint status from Pending to Resolved in
                your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;