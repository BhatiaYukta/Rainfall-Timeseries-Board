import React from "react";
import {Nav, Container} from "react-bootstrap"
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <span className="text-muted">© 2024 GeoRainfall Explorer</span>
        <Nav className="footer-links">
          <Nav.Link href="#privacy-policy" className="footer-item">
            Privacy Policy
          </Nav.Link>
          <Nav.Link href="#terms-of-service" className="footer-item">
            Terms of Service
          </Nav.Link>
          <Nav.Link href="#contact-us" className="footer-item">
            Contact Us
          </Nav.Link>
        </Nav>
      </Container>
    </footer>
  );
};

export default Footer;
