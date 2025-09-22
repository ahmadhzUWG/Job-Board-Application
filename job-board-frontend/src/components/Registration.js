import { useLocation, Navigate } from "react-router-dom";
import { app } from "../auth/firebase.js";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Registration() {
  const auth = getAuth(app);
  const location = useLocation();
  const { email, password, fromSignup } = location.state || { fromSignup: false };

  if (!fromSignup) {
    return <Navigate to="/" replace />;
  }

  const HandleSignUp = async (e) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully");

    }
    catch (error) {
      console.error("Error signing up:", error);
      ProcessError(error, setError);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-light">
      <p>Registration Page</p>
      <p>{email ?? `hey`}</p>
      <p>{password ?? `nun`}</p>
    </div>
  )
}

export default Registration
