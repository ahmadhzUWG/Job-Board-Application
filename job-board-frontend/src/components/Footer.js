import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap';

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#031629ff", marginTop: "20px" }}>
        <Navbar>
          <Container>
            <Nav className="w-100 border-bottom justify-content-center pb-2">
              <Nav.Link href="/" style={{ color: "white" }}>Home</Nav.Link>
              <Nav.Link href="/jobs" style={{ color: "white" }}>Jobs</Nav.Link>
              <Nav.Link href="/about" style={{ color: "white" }}>About</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <div className="text-center pb-4 text-light" >
          © 2024 Job Board. All rights reserved.
        </div>
      </footer>
  )
}

export default Footer;
