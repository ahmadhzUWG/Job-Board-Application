import api from '../api/axiosConfig';

export function ProcessError(error, setError) {
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

export async function ValidateSignup(email, password, setError) {
  setError("");

  email = email?.trim();
  password = password?.trim();

  if (!email) {
    setError("Please enter a valid email address.");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return false;
  }

  try {
    const response1 = await api.get(`/employers/${email}`);
    setError("Email already in use. Please log in instead.");
    return false;
  } catch (err) {
    console.log("Email not found in employers");
  }

  try {
    const response1 = await api.get(`/job-seekers/${email}`);
    setError("Email already in use. Please log in instead.");
    return false;
  } catch (err) {
    console.log("Email not found in Job Seekers");
  }

  if (!password) {
    setError("Please enter a password.");
    return false;
  }

  if (password.length < 6) {
    setError("Password is too weak. Use at least 6 characters.");
    return false;
  }

  return true;
}