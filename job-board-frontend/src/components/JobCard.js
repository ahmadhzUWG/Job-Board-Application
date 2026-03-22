import React from 'react';
import EditJob from './EditJob.js';
import api from '../api/axiosConfig.js';
import { useNavigate } from "react-router-dom";

function JobCard({ job, userId, isEditing, onEdit, onCancel }) {
    const isRemote = job.remote;
    const isOwner = userId && job.employer.id === userId || job.employer === userId;
    const navigate = useNavigate();

    if (isEditing) {
        return <EditJob job={job} onClose={onCancel} />;
    }

    const handleDeleteJob = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("Are you sure you want to delete this job?");
        if (!isConfirmed) return;

        try {
            await api.delete(`/jobs/${job.id}`);
            console.log("Job deleted successfully");
            window.location.reload();
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
                                    <button className="btn btn-primary" onClick={onEdit}>
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDeleteJob}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobCard;