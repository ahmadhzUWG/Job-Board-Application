import { useState } from "react";
import { CardBody } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./Slide.css"


function RoleSlide({ setUserData, swiperInstance }) {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("JOBSEEKER");

    const handleSelect = (role) => {
        setSelectedRole(role);
        setUserData((prev) => ({ ...prev, role }));
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <CardBody
                className="d-flex flex-column align-items-center shadow"
                style={{ padding: "2rem", borderRadius: "12px", maxWidth: "800px", width: "90%", backgroundColor: "#041a31d2", }}
            >
                <h2 className="mb-4 text-light">Select Your Role</h2>
                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 ">
                    <button className="btn shadow role-btn"
                        style={{
                            backgroundColor: selectedRole === "JOBSEEKER" ? window.PRIMARY_COLOR : "#f3f3f3ff",
                            border: selectedRole === "JOBSEEKER" ? "4px solid white" : "1px solid transparent",
                        }}
                        onClick={() => handleSelect("JOBSEEKER")}>
                        <img src="/assets/job-seeker-icon.png" alt="Job Seeker" 
                            className="mb-2 img-fluid"
                            style={{ maxHeight: "300px" }} />
                        <h3 style={{ color: selectedRole === "JOBSEEKER" ? "#fff" : window.PRIMARY_COLOR, fontWeight: "bold", fontSize: "24px", }}>Job Seeker</h3>
                    </button>

                    <button className="btn shadow role-btn"
                        style={{
                            backgroundColor: selectedRole === "EMPLOYER" ? window.PRIMARY_COLOR : "#f3f3f3ff",
                            border: selectedRole === "EMPLOYER" ? "4px solid white" : "1px solid transparent",
                        }}
                        onClick={() => handleSelect("EMPLOYER")}>
                        <img src="/assets/company-icon.png" alt="Job Seeker" 
                            className="mb-2 img-fluid"
                            style={{ maxHeight: "300px" }} />
                        <h3 style={{ color: selectedRole === "EMPLOYER" ? "#fff" : window.PRIMARY_COLOR, fontWeight: "bold", fontSize: "24px", }}>Employer</h3>
                    </button>
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-5 w-100">
                    <button type="button" className="btn prev-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px"}} onClick={() => navigate('/', {replace: true})}>Back</button>
                    <button type="button" className="btn next-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }} onClick={() => swiperInstance.slideNext()}>Next</button>
                </div>

            </CardBody>
        </div>

    )
}

export default RoleSlide
