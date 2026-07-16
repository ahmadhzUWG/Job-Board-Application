import './App.css';
import JobBoard from './components/JobBoard';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import AppNavbar from './components/AppNavbar';
import BackgroundVideo from './components/BackgroundVideo';
import Footer from './components/Footer';
import Registration from './components/registrationForms/Registration';
import PostJob from './components/employerForms/PostJob';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Dashboard from './components/Dashboard';
import { fetchUserByEmail } from './utils/utils';
import EmployerSettings from './components/employerForms/EmployerSettings';
import JobSeekerSettings from './components/jobSeekerForms/JobSeekerSettings';
import MyApplications from './components/jobSeekerForms/MyApplications';

function App() {

  const [user, setUser] = useState(undefined);
  const [role, setRole] = useState(undefined);
  const [jobs, setJobs] = useState([]);
  const [jobsApplied, setJobsApplied] = useState([]);
  const [userId, setUserId] = useState(undefined);

  // For fetching jobs to display in JobBoard
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getJobs();
  }, []);

  // For tracking user authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // For fetching user role and id
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadIdAndRole = async () => {
      const userObj = await fetchUserByEmail(user.email);
      if (isMounted) {
        setUserId(userObj.id);
        setRole(userObj.role);
      }
    };

    loadIdAndRole();

    return () => {
      isMounted = false;
    };
  }, [user]);


  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <BrowserRouter>
          <BackgroundVideo />
          <AppNavbar />
          <Routes>
            <Route path="/" element={user === undefined ? null : user ? (<Navigate to="/dashboard" replace />) : (<Welcome />)} />
            <Route path="/jobs" element={userId === undefined ? <div>Loading...</div> : (<JobBoard jobs={jobs} userId={userId} />)} />
            <Route path="/jobs/post" element={role === null ? (<Navigate to="/" replace />) : role === "EMPLOYER" ? (<PostJob />) : (<Navigate to="/dashboard" replace />)} />
            <Route path="/my-jobs" element={role === null ? (<Navigate to="/" replace />) : role === "EMPLOYER" ? (<JobBoard jobs={jobs.filter(job => job.employer.id === userId || job.employer === userId)} userId={userId} showHeader={false} />) : (<Navigate to="/dashboard" replace />)} />
            <Route path="/settings" element={role === null ? (<Navigate to="/" replace />) : role === "EMPLOYER" ? (<EmployerSettings />) : (<JobSeekerSettings />)} />
            <Route path="/about" element={<div className='text-center mt-5 text-light fs-1'><h1>About Page</h1><p>This is a job board application built with React and Firebase.</p></div>} />
            <Route path="/dashboard" element={user === undefined ? null : user ? <Dashboard /> : <Navigate to="/" replace />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/my-applications" element={role === null ? (<Navigate to="/" replace />) : role === "JOB_SEEKER" ? (userId === undefined ? <div>Loading...</div> : <MyApplications userId={userId} />) : (<Navigate to="/dashboard" replace />)} />
            <Route path="*" element={<div className='text-center mt-5 text-light fs-1'><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
          </Routes>
        </BrowserRouter>
      </main>

      <Footer />
    </div>
  );
}

export default App;
