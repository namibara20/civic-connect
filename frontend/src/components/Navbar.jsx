import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide"
        >
          CivicConnect
        </Link>

        {/* Navigation Links */}
       <div className="flex items-center gap-6">

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
  );
}

export default Navbar;