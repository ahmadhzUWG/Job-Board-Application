import React from 'react'
import { CardBody, ToggleButton } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useState } from 'react';
import api from '../api/axiosConfig.js';
import { fetchUserByEmail } from '../utils/utils.js';
import JobAddress from './JobAddress.js';

function PostJob() {
    const navigate = useNavigate();
    const [job, setJob] = useState({
        title: '',
        employmentType: '',
        description: '',
        employer: {},
        location: {
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: ''
        },
        postedDate: "",
        closingDate: "",
        remote: false,
        salary: 0,
    });
    const auth = getAuth();
    const user = auth.currentUser;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userObj = await fetchUserByEmail(user.email);

        const finalJob = {
            ...job,
            employer: { id: userObj.id },
            postedDate: new Date().toISOString().slice(0, 19),
            closingDate: new Date(job.closingDate).toISOString().slice(0, 19),
            salary: Number(job.salary),
            location: job.remote ? null : {
                address1: job.location.address1,
                address2: job.location.address2,
                city: job.location.city,
                state: job.location.state,
                zip: job.location.zip
            }
        }

        try {
            const response = await api.post('/jobs', finalJob);
            console.log("Job posted successfully:", response.data);
            navigate("/dashboard", { replace: true });

            setJob({
                title: '',
                employmentType: '',
                description: '',
                employer: {},
                location: {},
                postedDate: "",
                closingDate: "",
                remote: false,
                salary: ""
            });
        } catch (error) {
            console.error("Error posting job:", error);
            console.log("Request body:", error.config.data);
        }
    };

    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center responsive-vh" style={{ overflowY: "auto" }}>
            <CardBody className="d-flex flex-column align-items-center shadow mt-4"
                style={{ padding: "2rem", borderRadius: "12px", height: "auto", width: "100%", maxWidth: "800px", backgroundColor: "#041a31d2", overflow: "visible" }}>

                <div className="position-relative w-100 mb-4">
                    <h2 className="text-light text-center m-0">Post a Job</h2>

                    <span className="text-danger position-absolute end-0 top-50 translate-middle-y fs-6">
                        * = required field
                    </span>
                </div>

                <form className="w-100 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                    <div className="row g-3 w-100">
                        <div className="col-4 mb-3">
                            <label htmlFor="jobTitle" className="form-label text-light">Title</label>
                            <span className="text-danger">*</span>
                            <input type="text" className="form-control" id="jobTitle" required onChange={(e) => setJob((prevJob) => ({ ...prevJob, title: e.target.value }))} />
                        </div>
                        <div className="col-4 mb-3">
                            <label htmlFor="jobType" className="form-label text-light">Job Type</label>
                            <span className="text-danger">*</span>
                            <select className="form-select" id="jobType" required onChange={(e) => setJob((prevJob) => ({ ...prevJob, employmentType: e.target.value }))}>
                                <option value="" disabled selected hidden>Select Job Type</option>
                                <option value="FULL_TIME">Full-time</option>
                                <option value="PART_TIME">Part-time</option>
                                <option value="CONTRACT">Contract</option>
                            </select>
                        </div>
                        <div className="col-4 mb-3">
                            <label htmlFor="jobDescription" className="form-label text-light">Job Description</label>
                            <span className="text-danger">*</span>
                            <textarea className="form-control" id="jobDescription" rows="5" required onChange={(e) => setJob((prevJob) => ({ ...prevJob, description: e.target.value }))}></textarea>
                        </div>
                    </div>

                    <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="remoteToggle" checked={job.remote} onChange={(e) => setJob((prevJob) => ({ ...prevJob, remote: e.target.checked }))} />
                        <label className="form-check-label text-light" htmlFor="remoteToggle">Remote</label>
                    </div>

                    <div style={{ opacity: job.remote ? 0.5 : 1 }}>
                        <JobAddress data={job} setData={setJob} required={!job.remote} disabled={job.remote} />
                    </div>

                    <div className="row g-3 w-100 mt-3">
                        <div className="col-6 mb-3">
                            <label htmlFor="salary" className="form-label text-light">Salary</label>
                            <span className="text-danger">*</span>
                            <input type="number" className="form-control" id="salary" required onChange={(e) => setJob((prevJob) => ({ ...prevJob, salary: e.target.value }))} />
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="closingDate" className="form-label text-light">Closing Date</label>
                            <span className="text-danger">*</span>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="closingDate"
                                required
                                onChange={(e) =>
                                    setJob((prevJob) => ({
                                        ...prevJob,
                                        closingDate: e.target.value
                                    }))
                                }
                            />

                        </div>


                    </div>

                    <button type="submit" className="btn mt-3" style={{ backgroundColor: window.PRIMARY_COLOR, color: 'white' }}>Post Job</button>
                </form>
            </CardBody>
        </div>
    )
}

export default PostJob
