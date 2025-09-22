import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { app } from "../auth/firebase.js";
import { getAuth } from "firebase/auth";

function AppNavbar() {
  return (
    <Navbar sticky="top" style={{backgroundColor: "#041a31b0"}} className="navbar-dark" expand="lg">
      <Container>
        <Navbar.Brand href="/" style={{ color: "white" }}>
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
            <Nav.Link href="/" style={{ color: "white" }}>Home</Nav.Link>
            <Nav.Link href="/jobs" style={{ color: "white" }}>Jobs</Nav.Link>
            <Nav.Link href="/about" style={{ color: "white" }}>About</Nav.Link>
            {
              getAuth().currentUser
              &&
              <Button className="mt-2 ms-0 ms-md-3 d-flex align-items-center justify-content-center" style={{ maxWidth: "200px", width: "100%", maxHeight: "30px", height: "100%", backgroundColor: window.COMPLEMENTARY_COLOR, color: window.PRIMARY_COLOR }}
                onClick={() => {
                  const auth = getAuth(app);
                  auth.signOut().then(() =>
                    window.location.reload()
                  ).catch((error) =>
                    console.error("Error signing out:", error));
                }}>
                Sign Out
              </Button>
            }
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
