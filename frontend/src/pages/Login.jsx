import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
  auth,
  email,
  password
);

alert("Login Successful!");

if (userCredential.user.email === "snami41745@gmail.com") {
  navigate("/admin");
} else {
  navigate("/dashboard");
}
    } catch (error) {
      alert(error.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
    <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">

      <h1 className="text-3xl font-bold text-center text-gray-800">
        Welcome Back
      </h1>

      <p className="text-center text-gray-500 mt-2">
        Login to CivicConnect
      </p>

      <div className="mt-8">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login
        </button>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>

      </div>

    </div>
  </div>
);
}

export default Login;