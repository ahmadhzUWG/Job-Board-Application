import React from 'react'
import { CardBody } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useState } from 'react';
import api from '../api/axiosConfig.js';
import { fetchUserByEmail } from '../utils/utils.js';
import JobAddress from './JobAddress.js';

function EditJob({ job, onClose }) {
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const [editedJob, setEditedJob] = useState({
        id: job.id,
        title: job.title,
        employmentType: job.employmentType,
        description: job.description,
        employer: job.employer,
        location: job.location || {
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: ''
        },
        remote: job.remote,
        postedDate: job.postedDate,
        salary: job.salary,
        closingDate: job.closingDate,
    });

    const handleEditJob = async (e) => {
            e.preventDefault();

            const isConfirmed = window.confirm("Are you sure you want to save changes to this job?");
            if (!isConfirmed) return;

            const userObj = await fetchUserByEmail(user.email);
            
            const finalJob = {
                ...editedJob,
                postedDate: new Date().toISOString().slice(0, 19),
                closingDate: new Date(editedJob.closingDate).toISOString().slice(0, 19),
                salary: Number(editedJob.salary),
                employer: { id: userObj.id },
                location: editedJob.remote ? null : {
                    address1: editedJob.location.address1,
                    address2: editedJob.location.address2,
                    city: editedJob.location.city,
                    state: editedJob.location.state,
                    zip: editedJob.location.zip
                }
            }

            try {
                const response = await api.put('/jobs', finalJob);
                console.log("Job updated successfully:", response.data);
                window.location.reload();

            } catch (error) {
                console.error("Error updating job:", error);
                console.log("Request body:", error.config.data);
            }
        
    }

    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center responsive-vh" style={{ overflowY: "auto" }}>
            <CardBody className="d-flex flex-column align-items-center shadow mt-4"
                style={{ padding: "2rem", borderRadius: "12px", height: "auto", width: "100%", maxWidth: "800px", backgroundColor: "#041a31d2", overflow: "visible" }}>

                <div className="position-relative w-100 mb-4">
                    <h2 className="text-light text-center m-0">Edit Job</h2>

                    <span className="text-danger position-absolute end-0 top-50 translate-middle-y fs-6">
                        * = required field
                    </span>
                </div>

                <form className="w-100 d-flex flex-column align-items-center" onSubmit={handleEditJob}>
                    <div className="row g-3 w-100">
                        <div className="col-4 mb-3">
                            <label htmlFor="jobTitle" className="form-label text-light">Title</label>
                            <span className="text-danger">*</span>
                            <input type="text" className="form-control" id="jobTitle" required value={editedJob.title} onChange={(e) => setEditedJob((prevJob) => ({ ...prevJob, title: e.target.value }))} />
                        </div>
                        <div className="col-4 mb-3">
                            <label htmlFor="jobType" className="form-label text-light">Job Type</label>
                            <span className="text-danger">*</span>
                            <select className="form-select" id="jobType" required value={editedJob.employmentType} onChange={(e) => setEditedJob((prevJob) => ({ ...prevJob, employmentType: e.target.value }))}>
                                <option value="" disabled selected hidden>Select Job Type</option>
                                <option value="FULL_TIME">Full-time</option>
                                <option value="PART_TIME">Part-time</option>
                                <option value="CONTRACT">Contract</option>
                            </select>
                        </div>
                        <div className="col-4 mb-3">
                            <label htmlFor="jobDescription" className="form-label text-light">Job Description</label>
                            <span className="text-danger">*</span>
                            <textarea className="form-control" id="jobDescription" rows="5" required value={editedJob.description} onChange={(e) => setEditedJob((prevJob) => ({ ...prevJob, description: e.target.value }))}></textarea>
                        </div>
                    </div>

                    <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="remoteToggle" checked={editedJob.remote} onChange={(e) => setEditedJob((prevJob) => ({ ...prevJob, remote: e.target.checked }))} />
                        <label className="form-check-label text-light" htmlFor="remoteToggle">Remote</label>
                    </div>

                    <div style={{ opacity: editedJob.remote ? 0.5 : 1 }}>
                        <JobAddress data={editedJob} setData={setEditedJob} required={!editedJob.remote} disabled={editedJob.remote} />
                    </div>

                    <div className="row g-3 w-100 mt-3">
                        <div className="col-6 mb-3">
                            <label htmlFor="salary" className="form-label text-light">Salary</label>
                            <span className="text-danger">*</span>
                            <input type="number" className="form-control" id="salary" required value={editedJob.salary} onChange={(e) => setEditedJob((prevJob) => ({ ...prevJob, salary: e.target.value }))} />
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="closingDate" className="form-label text-light">Closing Date</label>
                            <span className="text-danger">*</span>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="closingDate"
                                required
                                value={editedJob.closingDate}
                                onChange={(e) =>
                                    setEditedJob((prevJob) => ({
                                        ...prevJob,
                                        closingDate: e.target.value
                                    }))
                                }
                            />

                        </div>


                    </div>

                    <button type="submit" className="btn mt-3" style={{ backgroundColor: window.PRIMARY_COLOR, color: 'white' }}>Edit Job</button>
                    <button type="button" className="btn btn-secondary mt-2" onClick={onClose}>Cancel</button>
                </form>
            </CardBody>
        </div>
    )
}

export default EditJob
