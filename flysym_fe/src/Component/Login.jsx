import { useState, useEffect } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Funzione per inviare la richiesta di login e ottenere il token
  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://localhost:9090/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenziali errate");
      }

      const data = await response.json();
      return data.token; // Assumendo che la risposta contenga il token come 'token'
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const AuthHandler = (token) => {
    localStorage.setItem("authToken", token);
  };

  const handleregister = () => {
    navigate("/registrati");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = await loginUser(username, password);
      console.log("Token ricevuto:", token);

      if (token) {
        AuthHandler(token);
        navigate("/");
      }
    } catch (err) {
      console.error("Errore durante il login:", err);
      setError("Credenziali errate. Riprova.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center vh-100 mt-5">
      <div>
        <h2 className="text-center fs-1 fw-bold">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <FloatingLabel className="mb-3" controlId="floatingUsername" label="Username">
            <Form.Control
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Inserisci il tuo username"
              required
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la tua password"
              required
            />
          </FloatingLabel>
          <button type="submit" className="btn btn-warning w-100">
            Accedi
          </button>
          <p className="mt-3">Non sei un nostro utente ? registrati e passa a FlySim</p>
          <button type="button" className="btn btn-warning w-100" onClick={handleregister}>
            Registrati
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
