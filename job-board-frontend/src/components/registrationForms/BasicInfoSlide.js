import { useRef } from "react";
import { CardBody } from "react-bootstrap";

import "./Slide.css"

function BasicInfoSlide({ userData, setUserData, swiperInstance }) {
    const formRef = useRef(null);

    const handleNext = () => {
        if (formRef.current?.checkValidity()) {
            swiperInstance.slideNext();
        } else {
            formRef.current.reportValidity();
        }
    };

    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center responsive-vh" style={{ overflowY: "auto" }}>
            <CardBody
                className="d-flex flex-column align-items-center shadow mt-4"
                style={{ padding: "2rem", borderRadius: "12px", height: "auto", width: "100%", maxWidth: "800px", backgroundColor: "#041a31d2", overflow: "visible" }}
            >
                <h2 className="mb-4 text-light text-center">Basic Information</h2>

                <form ref={formRef} className="w-100 d-flex flex-column align-items-center" id="basicInfoForm">
                    <div className="row g-3">
                        <div className="col-12 d-flex justify-content-center">
                            <div className="col-12 col-md-6 d-flex flex-column align-items-center">
                                <label htmlFor="profileImage" className="form-label text-light text-center">Profile Image</label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setUserData(prev => ({ ...prev, profileImageUrl: URL.createObjectURL(file) }));
                                        }
                                    }}
                                />

                                {userData.profileImageUrl && (
                                    <img
                                        src={userData.profileImageUrl}
                                        alt="Profile Preview"
                                        className="mt-4"
                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: "2px solid #fff" }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="name" className="form-label text-light">{userData.role === "JOBSEEKER" ? "Full Name" : "Company Name"}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={userData.name}
                                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="phone" className="form-label text-light">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                value={userData.phone}
                                onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                                required
                                pattern="^\d{10}$"
                                title="Please enter a valid 10-digit phone number (numbers only)"
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="description" className="form-label text-light">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                value={userData.description || ""}
                                onChange={(e) => setUserData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                required={userData.role === "EMPLOYER"}
                            />
                        </div>


                        <div className="col-12">
                            <label htmlFor="address1" className="form-label text-light">Address Line 1</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address1"
                                value={userData.address1}
                                onChange={(e) => setUserData((prev) => ({ ...prev, address1: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="address2" className="form-label text-light">Address Line 2</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address2"
                                value={userData.address2}
                                onChange={(e) => setUserData((prev) => ({ ...prev, address2: e.target.value }))}
                            />
                        </div>

                        <div className="col-12 col-md-4">
                            <label htmlFor="city" className="form-label text-light">City</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                value={userData.city}
                                onChange={(e) => setUserData((prev) => ({ ...prev, city: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="col-12 col-md-4">
                            <label htmlFor="state" className="form-label text-light">State</label>
                            <select
                                className="form-select"
                                id="state"
                                value={userData.state}
                                onChange={(e) => {
                                    setUserData(prev => ({ ...prev, state: e.target.value }));
                                    e.target.setCustomValidity(""); // reset custom message when user selects something
                                }}
                                onInvalid={(e) => e.target.setCustomValidity("Please select a state.")} // custom message
                                required
                                style={{ zIndex: 1050 }}
                            >
                                <option value="">Select State</option>
                                {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-4">
                            <label htmlFor="zip" className="form-label text-light">Zip Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="zip"
                                value={userData.zip}
                                onChange={(e) => setUserData((prev) => ({ ...prev, zip: e.target.value }))}
                                required
                                pattern="\d{5}(-\d{4})?"
                                title="Please enter a valid zip code (e.g., 12345 or 12345-6789)"
                            />
                        </div>
                    </div>


                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-5 w-100">
                        <button type="button" className="btn prev-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }} onClick={() => swiperInstance.slidePrev()}>Back</button>
                        <button type="button" className="btn prev-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }} onClick={handleNext}>Next</button>
                    </div>
                </form>
            </CardBody>
        </div>
    )
}

export default BasicInfoSlide;
