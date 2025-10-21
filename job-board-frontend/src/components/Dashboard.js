import React, { use } from 'react'
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import api from '../api/axiosConfig'

import './Dashboard.css';
import { Navigate } from 'react-router-dom';
import { CardBody } from 'react-bootstrap';

function Dashboard() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [role, setRole] = useState('');

  useEffect(() => {
    const FetchRole = async () => {
      try {
        const response1 = await api.get(`/employers/${user.email}`);
        setRole("EMPLOYER");
        return;
      } catch (err) {
        console.log(user.email, "Email not found in employers");
      }

      try {
        const response1 = await api.get(`/job-seekers/${user.email}`);
        setRole("JOBSEEKER");
        return;
      } catch (err) {
        console.log(user.email, ": Email not found in Job Seekers");
      }
    };

    FetchRole();
  }, [user.email]);

  return (
    <div>
      {role === "EMPLOYER" &&
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
          <div className="container">

            <div className="row mb-4">
              <h2 className="text-center mt-4 text-white">Analytics</h2>
              <div className="d-flex justify-content-center align-items-center w-100">
                <CardBody
                  className="shadow"
                  style={{ padding: "2rem", borderRadius: "12px", maxWidth: "800px", width: "90%", backgroundColor: "#041a31ff", }}
                >
                  <h3 className="text-center text-white">Coming Soon!</h3>
                  
                </CardBody>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 my-2">
                <button className="btn dashboard-button w-100">Post a Job</button>
              </div>
              <div className="col-md-6 my-2">
                <button className="btn dashboard-button w-100">View Applicants</button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 my-2">
                <button className="btn dashboard-button w-100">My Jobs</button>
              </div>
              <div className="col-md-6 my-2">
                <button className="btn dashboard-button w-100">Settings</button>
              </div>
            </div>

          </div>
        </div>




      }
      {role === "JOBSEEKER" &&
        <h1>Job Seeker Dashboard</h1>
      }
    </div>
  )
}


export default Dashboard;
