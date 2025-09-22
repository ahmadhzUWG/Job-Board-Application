import './App.css';
import JobBoard from './components/JobBoard';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import AppNavbar from './components/AppNavbar';
import BackgroundVideo from './components/BackgroundVideo';
import Footer from './components/Footer';
import Registration from './components/Registration';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Dashboard from './components/Dashboard';

function App() {

  const [user, setUser] = useState(undefined);
  const [jobs, setJobs] = useState();

  const getJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  useEffect(() => {
    getJobs();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <BackgroundVideo />
        <AppNavbar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ user === undefined ? null : user ? (<Navigate to="/dashboard" replace /> ) : (<Welcome />) } />
            <Route path="/jobs" element={<JobBoard jobs={jobs} />} />
            <Route path="/about" element={<div className='text-center mt-5 text-light fs-1'><h1>About Page</h1><p>This is a job board application built with React and Firebase.</p></div>} />
            <Route path="/dashboard" element={user === undefined ? null : user ? <Dashboard /> : <Navigate to="/" replace />} />
            <Route path="/registration" element={ <Registration /> } />
            <Route path="*" element={<div className='text-center mt-5 text-light fs-1'><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
          </Routes>
        </BrowserRouter>
      </main>

      <Footer />
    </div>
  );
}

export default App;
