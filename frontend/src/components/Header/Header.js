import React from "react"
import {Navbar, Nav, Container} from "react-bootstrap"
import { NavLink } from "react-router-dom"
import './Header.css'

const Header=()=>{
    return(
        <Navbar bg="light" expand="lg">
        <Container className="d-flex justify-content-start align-items-center">
          <Navbar.Brand className="brand-name">GeoRainfall Explorer</Navbar.Brand>
          <Nav className="ml-2">
            <Nav.Link as={NavLink} to="/dashboard" className="nav-item" activeClassName="active">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/help" className="nav-item" activeClassName="active">
              Help
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
}

export default Header;