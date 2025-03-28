import { useState } from "react";
import { FloatingLabel, Form, Alert, Button } from "react-bootstrap";

const Registrati = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [telefonoLineaFissa, setTelefonoLineaFissa] = useState("");
  const [cap, setCap] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [citta, setCitta] = useState("");

  const validatePassword = (password) => {
    // Almeno 8 caratteri e almeno un numero
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Controllo se tutti i campi sono compilati
    if (!username || !password || !firstName || !lastName || !email || !telefonoLineaFissa || !cap || !telefono || !indirizzo || !citta) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }

    // Validazione password
    if (!validatePassword(password)) {
      setError("La password deve essere lunga almeno 8 caratteri e contenere almeno un numero.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:9090/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          username,
          telefonoLineaFissa,
          cap,
          telefono,
          indirizzo,
          citta,
          roles: ["ROLE_USER"],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrazione non riuscita");
      }

      console.log("Registrazione avvenuta con successo", data);
      setSuccess("Registrazione completata con successo!");

      // Reset dei campi
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setUsername("");
      setTelefonoLineaFissa("");
      setCap("");
      setTelefono("");
      setIndirizzo("");
      setCitta("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center vh-100 mt-5">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center fs-1 fw-bold mb-4">Registrati a FlySim</h2>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-3">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="firstName" label="Nome" className="mb-3">
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="lastName" label="Cognome" className="mb-3">
            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="email" label="Email" className="mb-3">
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="username" label="Username" className="mb-3">
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="password" label="Password" className="mb-3">
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              isInvalid={password.length > 0 && !validatePassword(password)}
            />
            <Form.Text className="text-muted">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-exclamation-triangle-fill text-danger mx-2 my-2"
                viewBox="0 0 16 16"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
              La password deve contenere almeno 8 caratteri e un numero
            </Form.Text>
            {password.length > 0 && !validatePassword(password) && (
              <Form.Control.Feedback type="invalid">La password non soddisfa i requisiti</Form.Control.Feedback>
            )}
          </FloatingLabel>

          <FloatingLabel controlId="telefonoLineaFissa" label="Telefono Linea Fissa" className="mb-3">
            <Form.Control type="text" value={telefonoLineaFissa} onChange={(e) => setTelefonoLineaFissa(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="telefono" label="Telefono Mobile" className="mb-3">
            <Form.Control type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="indirizzo" label="Indirizzo" className="mb-3">
            <Form.Control type="text" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="citta" label="Città" className="mb-3">
            <Form.Control type="text" value={citta} onChange={(e) => setCitta(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="cap" label="CAP" className="mb-3">
            <Form.Control type="text" value={cap} onChange={(e) => setCap(e.target.value)} required />
          </FloatingLabel>

          <Button variant="warning" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
            {loading ? "Registrazione in corso..." : "Registrati"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Registrati;
