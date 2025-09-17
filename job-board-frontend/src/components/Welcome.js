import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { app } from "../auth/firebase.js";
import { getAuth } from "firebase/auth";
import Typewriter from "./typewritter.tsx";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userSignedUp, setUserSignedUp] = useState(false);

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  // Redirect if already logged in  
  //auth.onAuthStateChanged((user) => {
   // if (user) {
    //  navigate("/jobs");
    //}
 // });

  const checkUserSignedUp = async (email) => {
    try {
      const response1 = await api.get(`/employers/${email}`);
      const response2 = await api.get(`/job-seekers/${email}`);
      setUserSignedUp(response1.data.exists || response2.data.exists);
      console.log("User signed up:", response1.data.exists || response2.data.exists);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("User not found in either collection"); 
        return false;
      }
    }

    return false;
  }

  const HandleSignUp = async (e) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully");
      navigate("/registration", { state: { email, password }, replace: true } );

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
      setUserSignedUp(checkUserSignedUp(email));

      if (userSignedUp) {
        console.log("User already signed up, navigating to jobs");
        navigate("/jobs", { replace: true });
      } else {
        console.log("User not signed up, navigating to registration");
        console.log(`User email and pass:,  ${email}, ${password}`);
        navigate("/registration", { state: { email, password }, replace: true } );
      }
    }
    catch (error) {
      console.error("Error logging in:", error);
      ProcessError(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">

        {/* Content */}
        <div className="d-flex flex-column align-items-center">

          {/* Typewriter Effect */}
          <Typewriter
            text={[
              "Discover Jobs and Unlock Your Potential",
              "Connect with Top Employers",
              "Your Dream Job Awaits",   
            ]}
            speed={65}
            waitTime={2000}
            deleteSpeed={50}
            initialDelay={100}
            cursorChar={"|"}
            className="custom-typewriter mb-4"
          />

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
              className="btn btn-primary w-100" style={{ backgroundColor: window.PRIMARY_COLOR, color: "#FFFFFF" }}
              onClick={() => HandleSignUp()}
            >
              Sign up
            </button>
            {error && <small className="alert alert-danger mt-4">{error}</small>}
          </div>

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
