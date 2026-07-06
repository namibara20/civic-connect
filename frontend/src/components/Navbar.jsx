import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide"
          >
            CivicConnect
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/dashboard"
              className="hover:text-blue-200 transition"
            >
              Community Feed
            </Link>

            <Link
              to="/map"
              className="hover:text-blue-200 transition"
            >
              Map
            </Link>

            <Link
              to="/myreports"
              className="hover:text-blue-200 transition"
            >
              My Reports
            </Link>

            <Link
              to="/report"
              className="hover:text-blue-200 transition"
            >
              Report Issue
            </Link>

            <Link
              to="/analytics"
              className="hover:text-blue-200 transition"
            >
              Analytics
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-white flex flex-col p-4 gap-4">

          <Link to="/dashboard">Community Feed</Link>

          <Link to="/map">Map</Link>

          <Link to="/myreports">My Reports</Link>

          <Link to="/report">Report Issue</Link>

          <Link to="/analytics">Analytics</Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 rounded-lg py-2"
          >
            Logout
          </button>

        </div>
      )}
    </>
  );
}

export default Navbar;