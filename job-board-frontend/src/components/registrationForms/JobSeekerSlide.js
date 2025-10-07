import { useRef } from "react";
import { CardBody } from "react-bootstrap";

function JobSeekerSlide({ userData, setUserData, swiperInstance }) {
    const formRef = useRef(null);

    const handleNext = () => {
        if (formRef.current?.checkValidity()) {
            swiperInstance.slideNext();
        } else {
            formRef.current.reportValidity();
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <CardBody
                className="d-flex flex-column align-items-center shadow mt-4"
                style={{ padding: "2rem", borderRadius: "12px", height: "80%", width: "100%", maxWidth: "700px", backgroundColor: "#041a31d2", overflow: "visible" }}
            >
                <h2 className="mb-4 text-light text-center">Job Seeker Information</h2>

                <form ref={formRef} className="w-100 d-flex flex-column align-items-center">
                    <div className="row g-3">

                        <div className="col-12 col-md-6">
                            <label htmlFor="age" className="form-label text-light">Age</label>
                            <input
                                type="number"
                                className="form-control"
                                id="age"
                                value={userData.age || ""}
                                onChange={(e) => setUserData(prev => ({ ...prev, age: e.target.value }))}
                                required
                                min="16"
                                max="100"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="gender" className="form-label text-light">Gender</label>
                            <select
                                className="form-select"
                                id="gender"
                                value={userData.gender || ""}
                                onChange={(e) => {
                                    setUserData(prev => ({ ...prev, gender: e.target.value }));
                                    e.target.setCustomValidity("");
                                }}
                                onInvalid={(e) => e.target.setCustomValidity("Please select a gender.")} // custom message
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="col-12 d-flex justify-content-center">
                            <div className="col-12 col-md-6 d-flex flex-column align-items-center">
                                <label htmlFor="resume" className="form-label text-light">Resume (PDF / Word)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="resume"
                                    accept=".pdf,.doc,.docx"  // allows pdf and word files
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setUserData(prev => ({ ...prev, resumeFile: file }));
                                        }
                                    }}
                                />
                            </div>
                        </div>


                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-5 w-100">
                        <button type="button" className="btn prev-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }} onClick={() => swiperInstance.slidePrev()}>Back</button>
                        <button type="button" className="btn prev-button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold", fontSize: "20px", color: window.PRIMARY_COLOR, width: "100px" }} onClick={handleNext}>Next</button>
                    </div>

                </form>
            </CardBody>
        </div>
    );
}

export default JobSeekerSlide;
