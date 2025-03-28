import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("authToken");

  let isAdmin = false;
  if (isAuthenticated) {
    const decodedToken = JSON.parse(atob(localStorage.getItem("authToken").split(".")[1])); // Decodifica il token
    const roles = decodedToken.roles; // Recupera il ruolo dal token
    isAdmin = roles.includes("ROLE_ADMIN"); // Verifica se l'utente ha il ruolo di admin
  }

  return (
    <>
      <Navbar expand="lg" bg="warning">
        <Navbar.Brand href="#home" className=""></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar">
          <Nav className="me-auto text-center">
            <Nav.Link as={Link} to={"/"} className="text-white fw-bold fs-1">
              FlySim
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/DoveSiamo")} className="text-white fw-bold fs-4 mt-3">
              Dove siamo ?
            </Nav.Link>

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Nav.Link onClick={() => navigate("/AdminPage")} className="text-danger fw-bold fs-4 mt-3">
                    Admin Page
                  </Nav.Link>
                ) : (
                  <Nav.Link onClick={() => navigate("/Profilo")} className="text-danger fw-bold fs-4 mt-3">
                    Profilo
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate("/login")} className="text-white fw-bold fs-4 mt-3">
                  Login
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/Registrati")} className="text-white fw-bold fs-4 mt-3">
                  Registrati
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ms-auto text-center"></Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
