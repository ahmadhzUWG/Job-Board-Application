import api from '../api/axiosConfig';
import { updatePassword } from "firebase/auth";

export async function changeUserFields(firebaseUser, userObj, updatedFields) {
  try {
    if (userObj.role === "EMPLOYER") {
      await api.patch(`/employers/${userObj.id}`, updatedFields);
    } else if (userObj.role === "JOB_SEEKER") {
      await api.patch(`/job-seekers/${userObj.id}`, updatedFields);
    }

    if (updatedFields.password) {
      await updatePassword(firebaseUser, updatedFields.password);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user fields:", error);
    return { success: false, error: error.message };
  }
}


  export async function fetchRole(user) {
    if (!user || !user.email) return null;

    try {
      await api.get(`/employers/email/${user.email}`);
      return "EMPLOYER";
    } catch (err) {
      console.log(user.email, "Email not found in employers");
    }

    try {
      await api.get(`/job-seekers/email/${user.email}`);
      return "JOB_SEEKER";
    } catch (err) {
      console.log(user.email, ": Email not found in Job Seekers");
    }

    return null;
  }

  export async function fetchUserByEmail(email) {
    if (!email) return null;

    try {
      const response = await api.get(`/employers/email/${email}`);
      return response.data;
    } catch (err) {
      console.log("Error fetching employer by email:", err.response?.data || err);
    }

    try {
      const response = await api.get(`/job-seekers/email/${email}`);
      return response.data;
    } catch (err) {
      console.log("Error fetching job seeker by email:", err.response?.data || err);
    }
    return null;
  }

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
      const response1 = await api.get(`/employers/email/${email}`);
      setError("Email already in use. Please log in instead.");
      return false;
    } catch (err) {
      console.log("Email not found in employers");
    }

    try {
      const response1 = await api.get(`/job-seekers/email/${email}`);
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

  export async function uploadFileToS3(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error);
      return null;
    }

  }

  export async function deleteFileFromS3(profileImageUrl) {
    if (!profileImageUrl) return false;

    try {
      await api.delete('/file', { params: { fileUrl: profileImageUrl } });
      return true;
    } catch (error) {
      console.error("Error deleting file:", error.response?.data || error);
      return false;
    }
  }
