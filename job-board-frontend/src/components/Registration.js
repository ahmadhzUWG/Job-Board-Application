import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { app } from "../auth/firebase";
import { getAuth } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const HandleSignUp = async (e) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully");
    }
    catch (error) {
      console.error("Error signing up:", error);
      ProcessError(error);
    }
  };

  const HandleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
    }
    catch (error) {
      console.error("Error logging in:", error);
      ProcessError(error);
    }
  };

  const HandleGoogleLogIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("User signed in with Google successfully");
    }
    catch (error) {
      console.error("Error signing in with Google:", error);
      ProcessError(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <img
          src="/job-board-logo.png"
          alt="Job Board"
          style={{ maxWidth: "400px", marginBottom: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
        />

        <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <form className="form-group" onSubmit={HandleLogin}>
            <input
              className="form-control mb-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn w-100 mb-2 mt-2" style={{backgroundColor: window.PRIMARY_COLOR, color: window.SECONDARY_COLOR}} type="submit">
              Log in
            </button>
          </form>

          <button
            className="btn btn-primary w-100 mb-2" style={{backgroundColor: window.PRIMARY_COLOR, color: window.SECONDARY_COLOR}}
            onClick={() => HandleSignUp()}
          >
            Sign up
          </button>
          <button
            className="btn btn-primary w-100" style={{backgroundColor: window.COMPLEMENTARY_COLOR, color: window.PRIMARY_COLOR, borderColor: window.PRIMARY_COLOR}}
            onClick={() => HandleGoogleLogIn()}
          >
            <FcGoogle size={20} className="me-2" />
            Sign in with Google
          </button>

          {error && <small className="alert alert-danger mt-4">{error}</small>}
        </div>
      </div>
    </div>

  )

  function ProcessError(error) {
    setError(error.code);

    switch (error.code) {
      case "auth/email-already-in-use":
        setError("Email already in use. Please log in instead.");
        break;
      case "auth/invalid-email":
        setError("Invalid email format. Please enter a valid email.");
        break;
      case "auth/weak-password":
        setError("Weak password. Please use at least 6 characters.");
        break;
      case "auth/missing-password":
        setError("Missing password. Please enter a password.");
        break;
      case "auth/user-not-found":
        setError("User not found. Please sign up first.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password. Please try again.");
        break;
      case "auth/invalid-credential":
        setError("Invalid credentials. Please try again.");
        break;
      default:
        setError("Error signing up. Please try again.");
    }
  }
}

export default Registration
