import React from 'react'

export default function JobAddress({ data, setData, required = true, disabled = false }) {
    return (
        <div className="row g-3 w-100">
            <div className="col-4">
                <label htmlFor="address1" className="form-label text-light">Address Line 1</label>
                <span className="text-danger">*</span>
                <input
                    type="text"
                    className="form-control"
                    id="address1"
                    value={required ? data.location.address1 : ''}
                    onChange={(e) => setData((prev) => ({ ...prev, location: { ...prev.location, address1: e.target.value } }))}
                    required={required}
                    disabled={disabled}
                />
            </div>

            <div className="col-4">
                <label htmlFor="address2" className="form-label text-light">Address Line 2</label>
                <input
                    type="text"
                    className="form-control"
                    id="address2"
                    value={required ? data.location.address2 : ''}
                    onChange={(e) => setData((prev) => ({ ...prev, location: { ...prev.location, address2: e.target.value } }))}
                />
            </div>

            <div className="col-4">
                <label htmlFor="city" className="form-label text-light">City</label>
                <span className="text-danger">*</span>
                <input
                    type="text"
                    className="form-control"
                    id="city"
                    value={required ? data.location.city : ''}
                    onChange={(e) => setData((prev) => ({ ...prev, location: { ...prev.location, city: e.target.value } }))}
                    required={required}
                    disabled={disabled}
                />
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3">
                <div style={{ minWidth: 120, maxWidth: 140 }}>
                    <label htmlFor="state" className="form-label text-light">State</label>
                    <span className="text-danger">*</span>
                    <select
                        className="form-select"
                        id="state"
                        value={required ? data.location.state : ''}
                        onChange={(e) => {
                            setData(prev => ({ ...prev, location: { ...prev.location, state: e.target.value } }));
                            e.target.setCustomValidity(""); // reset custom message when user selects something
                        }}
                        onInvalid={(e) => {
                            if (required) {
                                e.target.setCustomValidity("Please select a state.");
                            }
                        }}
                        required={required}
                        disabled={disabled}
                        style={{ zIndex: 1050}}
                    >
                        <option value="" hidden disabled>Select State</option>
                        {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
                <div style={{ minWidth: 120, maxWidth: 140 }}>
                    <label htmlFor="zip" className="form-label text-light">Zip Code</label>
                    <span className="text-danger">*</span>
                    <input
                        type="text"
                        className="form-control"
                        id="zip"
                        value={required ? data.location.zip : ''}
                        onChange={(e) => setData((prev) => ({ ...prev, location: { ...prev.location, zip: e.target.value } }))}
                        required={required}
                        disabled={disabled}
                        pattern="\d{5}(-\d{4})?"
                        title="Please enter a valid zip code (e.g., 12345 or 12345-6789)"
                    />
                </div>
            </div>

        </div>


    )
}
