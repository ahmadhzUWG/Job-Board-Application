import React from "react";
import { CardBody, Button } from "react-bootstrap";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import api from '../../api/axiosConfig.js';

import "./Slide.css";

function ReviewSlide({ userData, swiperInstance }) {

    const createUser = async (userData, role) => {
        try {
            console.log("userData:", userData);

            if (role === "EMPLOYER") {
                const response = await api.post('/employers', userData);
                console.log(response.data);
                return;
            } else if (role === "JOBSEEKER") {
                const response = await api.post('/job-seekers', userData);
                console.log(response.data);
                return;
            }
        } catch (error) {
            console.error("Error posting user:", error);
        }
    }

    const handleEdit = (slideIndex) => {
        swiperInstance.slideTo(slideIndex);
    };

    const handleSubmit = async () => {
        const createdUserData = {
            name: userData.name,
            address: {
                address1: userData.address1,
                address2: userData.address2,
                city: userData.city,
                state: userData.state,
                zip: userData.zip
            },
            phoneNumber: userData.phone,
            role: userData.role,
            email: userData.email,
            password: userData.password,
            profileImageUrl: userData.profileImageUrl,
        }
        if (userData.role === "JOBSEEKER") {
            createdUserData.age = Number(userData.age);
            createdUserData.gender = userData.gender;
            createdUserData.resumeUrl = userData.resumeUrl;
        } else if (userData.role === "EMPLOYER") {
            createdUserData.industry = userData.industry;
            createdUserData.description = userData.description;
        }

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, userData.email, userData.password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("User created in Firebase:", user);

                await createUser(createdUserData, userData.role);
                window.location.replace("/dashboard");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error creating user in Firebase:", errorCode, errorMessage);
            });
    }

    const sectionStyle = {
        backgroundColor: window.PRIMARY_COLOR,
        borderRadius: "12px",
        padding: "1rem 1.5rem",
        marginBottom: "1.5rem",
        width: "100%",
        color: "#fff",
        border: "1px solid #ccc"
    };

    return (
        <div className="w-100 d-flex flex-column justify-content-start align-items-center responsive-vh" style={{ padding: "1rem", overflowY: "auto" }}>
            <CardBody
                className="d-flex flex-column align-items-center shadow mt-4"
                style={{
                    padding: "2rem",
                    borderRadius: "12px",
                    height: "auto",
                    width: "100%",
                    maxWidth: "800px",
                    backgroundColor: "#041a31d2",
                }}
            >
                <h2 className="mb-4 text-light text-center">Review Your Information</h2>

                {/* Role Section */}
                <div style={sectionStyle}>
                    <h5 className="section-header">
                        Role
                        <Button variant="outline-light" size="sm" onClick={() => handleEdit(0)}>Edit</Button>
                    </h5>
                    <p > {{
                        JOBSEEKER: "Job Seeker",
                        EMPLOYER: "Employer"
                    }[userData.role]}</p>
                </div>

                {/* Basic Info Section */}
                <div style={sectionStyle}>
                    <h5 className="section-header">
                        Basic Information
                        <Button variant="outline-light" size="sm" onClick={() => handleEdit(1)}>Edit</Button>
                    </h5>
                    <p><strong>{userData.role === "JOBSEEKER" ? "Full Name" : "Company Name"}:</strong> {userData.name}</p>
                    <p><strong>Phone:</strong> {userData.phone}</p>
                    <p><strong>Address:</strong> {userData.address1} {userData.address2}, {userData.city}, {userData.state} {userData.zip}</p>
                    {userData.description && (
                        <p><strong>Description:</strong> {userData.description}</p>
                    )}
                    {userData.profileImageUrl && (
                        <img
                            src={userData.profileImageUrl}
                            alt="Profile"
                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }}
                        />
                    )}
                </div>


                {/* Jobseeker or Employer Section */}
                <div style={sectionStyle}>
                    <h5 className="section-header">
                        {userData.role === "JOBSEEKER" ? "Jobseeker Information" : "Employer Information"}
                        <Button variant="outline-light" size="sm" onClick={() => handleEdit(2)}>Edit</Button>
                    </h5>
                    {userData.role === "JOBSEEKER" ? (
                        <>
                            <p><strong>Age:</strong> {userData.age}</p>
                            <p><strong>Gender:</strong> {userData.gender}</p>
                            <p><strong>Resume URL:</strong> {userData.resumeUrl}</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Industry:</strong> {userData.industry}</p>
                        </>
                    )}
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-3 w-100">
                    <button type="button" className="btn prev-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }} onClick={() => swiperInstance.slidePrev()}>Back</button>
                    <button type="button" className="btn prev-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }} onClick={handleSubmit}>Finish</button>
                </div>
            </CardBody>
        </div>
    );
}

export default ReviewSlide;
