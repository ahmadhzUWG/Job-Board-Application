import './App.css';
import JobCard from './components/JobCard';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Registration from './components/Registration';
import AppNavbar from './components/AppNavbar';

function App() {

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
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
          <div>
            <video loop autoPlay muted style={{ width: "100vw", height: "100vh", objectFit: "cover", position: "fixed", top: 0, left: 0, zIndex: -1 }}>
              <source src="/assets/home-landing.mp4" type="video/mp4" />
            </video>
          </div>
      <AppNavbar/>
        <Routes>
          <Route path="/" element={
            <>
              <Registration />
            </>
          } />
          <Route path="/jobs" element={
            <>
              <h1 className='text-center'>Job Board</h1>
              {jobs?.map((job) => (<JobCard key={job.id} job={job} />))}
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
