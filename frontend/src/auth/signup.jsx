import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
function Signup() {

    const [name, setName] = useState("");

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

    const handleSignup = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log(userCredential.user);

        alert("Account Created Successfully!");
    } catch (error) {
        alert(error.message);
    }
};
  return (
    <div>
      <h1>Create Account</h1>

      <form>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button
    type="button"
    onClick={handleSignup}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;