import React, { use } from 'react'
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { fetchRole } from "../utils/utils.js";

import './Dashboard.css';
import EmployerDashboard from './employerForms/EmployerDashboard.js';
import JobSeekerDashboard from './jobSeekerForms/JobSeekerDashboard.js';

function Dashboard() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [role, setRole] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadRole = async () => {
      const userRole = await fetchRole(user);
      if (isMounted) setRole(userRole);
    }

    loadRole();

    return () => { isMounted = false; };

  }, [user]);

  
  return (
    <div>
      {role === "EMPLOYER" &&
        <EmployerDashboard />
      }

      {role === "JOB_SEEKER" &&
        <JobSeekerDashboard />
      }
    </div >
  )
}


export default Dashboard;
