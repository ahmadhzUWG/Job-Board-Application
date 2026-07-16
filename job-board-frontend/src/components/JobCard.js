import React from 'react';
import EditJob from './employerForms/EditJob.js';
import api from '../api/axiosConfig.js';
import { useNavigate, Link } from "react-router-dom";
import { fetchRole } from '../utils/utils.js';
import { getAuth } from "firebase/auth";
import { useEffect, useState } from 'react';
import { applyForJob, deleteJobApplication } from '../utils/utils.js';

function JobCard({ job, userId, isEditing, onEdit, onCancel, removeApplication }) {
    const auth = getAuth();
    const user = auth.currentUser;
    const [isJobSeeker, setIsJobSeeker] = useState(false);
    const [hasNotApplied, setHasNotApplied] = useState(true);
    const isRemote = job.remote;
    const isOwner = userId && job.employer.id === userId || job.employer === userId;
    const [jobApplications, setJobApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const checkIfJobSeeker = async () => {
            try {
                const response = await api.get(`/job-applications`);
                const applications = response.data;
                setJobApplications(applications);

                const userRole = await fetchRole(user);
                if (isMounted) {
                    setIsJobSeeker(userRole === "JOB_SEEKER");
                    setHasNotApplied(!applications?.some(application => application.job.id === job.id && application.applicant.id === userId));
                }
            }
            catch (error) {
                console.error("Error fetching job applications:", error);
            }


        }

        checkIfJobSeeker();

        return () => { isMounted = false; };

    }, [user]);


    if (isEditing) {
        return <EditJob job={job} onClose={onCancel} />;
    }

    const handleDeleteApplication = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("Are you sure you want to delete this application?");
        if (!isConfirmed) return;

        try {
            const applicationToDelete = jobApplications.find(application => application.job.id === job.id && application.applicant.id === userId);
            if (applicationToDelete) {
                await deleteJobApplication(applicationToDelete.id);
                setHasNotApplied(true);
                alert("Application deleted successfully!");
                if (removeApplication) {
                    removeApplication(job.id);
                }
            }
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    }

    const handleApply = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("Are you sure you want to apply for this job?");
        if (!isConfirmed) return;

        try {
            await applyForJob(job.id, userId);

            const response = await api.get(`/job-applications`);
            const applications = response.data;
            const appliedJobs = applications
                .filter(application => application.applicant.id === userId)
                .map(application => application.job);

            setJobApplications(applications);
            setHasNotApplied(false);
            alert("Application submitted successfully!");
        } catch (error) {
            console.error("Error applying for job:", error);
        }
    }

    const handleDeleteJob = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("Are you sure you want to delete this job?");
        if (!isConfirmed) return;

        try {
            await api.delete(`/jobs/${job.id}`);
            console.log("Job deleted successfully");
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    }

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h4 className="card-header">{job.employer.name}</h4>
                            <h5 className="card-title">{job.title}</h5>
                            <h5 className="card-subtitle">${job.salary}/yr</h5>
                            <p className="card-text">{job.description}</p>
                            <p className="card-footer">
                                {isRemote
                                    ? "Remote"
                                    : `${job.location.city}, ${job.location.state}`}
                            </p>

                            {isOwner && (
                                <div className="d-flex justify-content-center gap-2">
                                    <button type="button" className="btn" style={{ backgroundColor: window.SECONDARY_COLOR, color: 'white' }} onClick={onEdit}>
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={handleDeleteJob}
                                        style={{ backgroundColor: window.SECONDARY_COLOR, color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}

                            {isJobSeeker && (
                                <>
                                    <div className="d-flex justify-content-center gap-2 position-relative">
                                        {!hasNotApplied && (
                                            <>
                                                <img
                                                    src="/assets/checkicon.svg"
                                                    alt="Check Icon"
                                                    width="20"
                                                    height="20"
                                                    className="position-absolute top-50 end-0 translate-middle-y"
                                                />

                                                <button
                                                    type="button"
                                                    className="btn"
                                                    onClick={handleDeleteApplication}
                                                    style={{ backgroundColor: window.SECONDARY_COLOR, color: "white" }}
                                                >
                                                    Delete Application
                                                </button>
                                            </>

                                        )}


                                    </div>

                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={handleApply}
                                        style={{ backgroundColor: window.SECONDARY_COLOR, color: 'white', display: hasNotApplied ? 'inline-block' : 'none' }}
                                    >
                                        Apply
                                    </button>


                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobCard;