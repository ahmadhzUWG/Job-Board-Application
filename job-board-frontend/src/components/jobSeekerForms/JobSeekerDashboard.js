import React from 'react'
import { CardBody } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function JobSeekerDashboard() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
          <div className="container">

            <div className="row mb-4">
              <h2 className="text-center mt-4 text-white">Analytics</h2>
              <div className="d-flex justify-content-center align-items-center w-100">
                <CardBody
                  className="shadow"
                  style={{ padding: "2rem", borderRadius: "12px", maxWidth: "800px", width: "90%", backgroundColor: "#041a31ff", }}
                >
                  <h3 className="text-center text-white">Coming Soon!</h3>

                </CardBody>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 my-2">
                <Link to="/jobs">
                  <button className="btn dashboard-button w-100">Browse Jobs</button>
                </Link>
              </div>
              <div className="col-md-6 my-2">
                <Link to="/my-applications">
                  <button className="btn dashboard-button w-100">My Applications</button>
                </Link>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6 my-2">
                <Link to="/settings">
                  <button className="btn dashboard-button w-100 ">Settings</button>
                </Link>
              </div>
            </div>

          </div>
        </div>
  )
}

export default JobSeekerDashboard
