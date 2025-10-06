import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { app } from "../auth/firebase.js";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ProcessError, ValidateSignup } from "../utils/utils.js";
import "./Welcome.css";
import TypewriterBanner from "./TypewriterBanner.js";

function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth(app);
  const navigate = useNavigate();

  const HandleSignUp = async (e) => {
    e.preventDefault();

    const isValid = await ValidateSignup(email, password, setError);
    console.log("isValid:", isValid);
    if (!isValid) return;
    
    navigate("/registration", { state: { email, password, fromSignup: true}, replace: true });
  };

  const HandleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");

      navigate("/jobs", { replace: true });
    }
    catch (error) {
      console.error("Error logging in:", error);
      ProcessError(error, setError);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">

        {/* Content */}
        <div className="d-flex flex-column align-items-center">

          {/* Typewriter Effect */}
          <TypewriterBanner />

          {/* Logo */}
          <img
            src="/assets/job-board-logo.png"
            alt="Job Board"
            className="img-fluid"
            style={{
              maxWidth: "400px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              opacity: 0.9,
              marginBottom: "20px"
            }}
          />

          {/* Form Card */}
          <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%", backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px' }}>
            <form className="form-group" onSubmit={HandleLogin} noValidate>
              <input
                className="form-control mb-2"
                type="email"
                required
                onInvalid={(e) => e.target.setCustomValidity('')}
                onInput={(e) => e.target.setCustomValidity('')}
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
              <button className="btn w-100 mb-2 mt-2" style={{ backgroundColor: window.PRIMARY_COLOR, color: "#FFFFFF" }} type="submit">
                Log in
              </button>
            </form>
            <button
              className="btn w-100" style={{ backgroundColor: window.PRIMARY_COLOR, color: "#FFFFFF" }}
              onClick={(e) => HandleSignUp(e)}
            >
              Sign up
            </button>
            {error && <small className="alert alert-danger mt-4">{error}</small>}
          </div>

        </div>
      </div>
    </div>

  )
}

export default Welcome;
