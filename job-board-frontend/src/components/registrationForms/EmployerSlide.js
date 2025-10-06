import { useRef } from "react";
import { CardBody } from "react-bootstrap";

import "./Slide.css";

function EmployerInfoSlide({ userData, setUserData, swiperInstance }) {
    const formRef = useRef(null);

    const handleNext = () => {
        if (formRef.current?.checkValidity()) {
            swiperInstance.slideNext();
        } else {
            formRef.current.reportValidity();
        }
    };

    const industries = [
        "TECHNOLOGY",
        "FINANCE",
        "HEALTHCARE",
        "EDUCATION",
        "RETAIL",
        "MANUFACTURING",
        "CONSTRUCTION",
        "HOSPITALITY",
        "TRANSPORTATION",
        "ENERGY",
        "TELECOMMUNICATIONS",
        "MEDIA",
        "GOVERNMENT",
        "NON_PROFIT",
        "OTHER"
    ];

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <CardBody
                className="d-flex flex-column align-items-center shadow mt-4"
                style={{
                    padding: "2rem",
                    borderRadius: "12px",
                    height: "80%",
                    width: "100%",
                    maxWidth: "800px",
                    backgroundColor: "#041a31d2",
                    overflow: "visible"
                }}
            >
                <h2 className="mb-4 text-light text-center">Employer Information</h2>

                <form ref={formRef} className="w-100 d-flex flex-column align-items-center" id="employerInfoForm">
                    <div className="row g-3">
                        <div className="col-12 d-flex justify-content-center">
                            <div className="w-100" style={{ maxWidth: "300px" }}>
                                <label htmlFor="industry" className="form-label text-light text-center w-100">Industry</label>
                                <select
                                    className="form-select"
                                    id="industry"
                                    value={userData.industry || ""}
                                    onChange={(e) => {
                                        setUserData(prev => ({ ...prev, industry: e.target.value }));
                                        e.target.setCustomValidity(""); // reset custom message when user selects something
                                    }}
                                    onInvalid={(e) => e.target.setCustomValidity("Please select an industry")} // custom message
                                    required
                                    style={{ zIndex: 1050 }}
                                >
                                    <option value="">Select Industry</option>
                                    {industries.map((ind) => (
                                        <option key={ind} value={ind}>
                                            {ind.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-5 w-100">
                        <button
                            type="button"
                            className="btn prev-button"
                            style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }}
                            onClick={() => swiperInstance.slidePrev()}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="btn prev-button"
                            style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }}
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </form>
            </CardBody>
        </div>
    );
}

export default EmployerInfoSlide;
