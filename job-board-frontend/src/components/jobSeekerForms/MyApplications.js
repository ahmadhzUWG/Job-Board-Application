import React from 'react'
import JobCard from '../JobCard';
import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig.js';

function MyApplications({ userId }) {
    const [jobsApplied, setJobsApplied] = React.useState([]);

    const fetchJobsApplied = async () => {
        if (!userId) return;

        try {
            const response = await api.get(`/job-applications`);
            const applications = response.data;
            const appliedJobs = applications
                .filter(application => application.applicant.id === userId)
                .map(application => application.job);
            setJobsApplied(appliedJobs);
        } catch (error) {
            console.error("Error fetching jobs applied:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchJobsApplied();
        }
    }, [userId]);

    return (
        <div className="container">
            <h1 id="job-board" className='text-center text-light'>Job Applications</h1>
            {jobsApplied.map(job => (
                <JobCard
                    key={job.id}
                    job={job}
                    userId={userId}
                    removeApplication={(jobId) => {
                        setJobsApplied(prev =>
                            prev.filter(job => job.id !== jobId)
                        );
                    }}
                />
            ))}
        </div>
    )
}

export default MyApplications
