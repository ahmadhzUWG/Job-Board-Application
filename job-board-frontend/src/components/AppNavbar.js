import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { app } from "../auth/firebase.js";
import { getAuth } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

import "./registrationForms/Slide.css"

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const onRegistrationPage = location.pathname === "/registration";

  const handleHomeClick = (e) => {
    e.preventDefault();

    if (onRegistrationPage) {
      navigate("/", { replace: true }); 
      console.log("Navigating to home from registration page");
    } else {
      navigate("/"); 
    }
  };

  return (
    <Navbar sticky="top" style={{ backgroundColor: "#041a31b0" }} className="navbar-dark" expand="lg">
      <Container>
        <Navbar.Brand onClick={handleHomeClick} style={{ color: "white", cursor: "pointer" }}>
          <img
            src="/assets/job-board-logo.png"
            alt="Job Board"
            height="40"
            className="d-inline-block align-top me-2"
          />
          Job Board
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav " />

        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="ms-auto align-items-center">
            <Nav.Link as="span" onClick={handleHomeClick} style={{ color: "white", cursor: "pointer" }}>Home</Nav.Link>
            <Nav.Link href="/jobs" style={{ color: "white" }}>Jobs</Nav.Link>
            <Nav.Link href="/about" style={{ color: "white" }}>About</Nav.Link>
            {
              getAuth().currentUser
              &&
              <button type="button" className="btn mt-2 ms-0 ms-md-3 d-flex align-items-center justify-content-center sign-out-button" style={{ maxWidth: "200px", width: "100%", maxHeight: "30px", height: "100%", backgroundColor: window.COMPLEMENTARY_COLOR, color: window.PRIMARY_COLOR }}
                onClick={() => {
                  const auth = getAuth(app);
                  auth.signOut().then(() =>
                    window.location.reload()
                  ).catch((error) =>
                    console.error("Error signing out:", error));
                }}>
                Sign Out
              </button>
            }

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
