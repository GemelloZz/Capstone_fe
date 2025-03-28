import React, { useEffect, useState } from "react";
import { ListGroup, Button, Container, Row, Col, ProgressBar, Card, Badge, Alert, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profilo = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telefono: "",
    telefonoLineaFissa: "",
    indirizzo: "",
    cap: "",
    avatar: null,
    città: "",
    promozioni: [],
    telefoni: [],
    promozioniLineaFissa: [],
  });

  const [loading, setLoading] = useState({
    mobile: false,
    fissa: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [promozioneToDelete, setPromozioneToDelete] = useState({
    id: null,
    type: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token non trovato");
        return;
      }

      const username = getUserNameFromToken(token);

      try {
        const response = await fetch(`http://localhost:9090/api/auth/user/${username}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          telefono: data.telefono,
          telefonoLineaFissa: data.telefonoLineaFissa,
          indirizzo: data.indirizzo,
          cap: data.cap,
          avatar: data.avatar,
          città: data.città,
          promozioni: data.promozioni || [],
          telefoni: data.telefoni || [],
          promozioniLineaFissa: data.promozioniLineaFissa || [],
        });
      } catch (error) {
        console.error("Errore nel recupero dei dati utente", error);
      }
    };

    fetchUserData();
  }, []);

  const getUserNameFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.sub;
    } catch (error) {
      console.error("Errore nel decoding del token", error);
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const confirmDelete = (id, type) => {
    setPromozioneToDelete({ id, type });
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    setShowConfirmModal(false);
    const { id, type } = promozioneToDelete;
    const token = localStorage.getItem("authToken");
    const username = getUserNameFromToken(token);

    setLoading((prev) => ({ ...prev, [type]: true }));
    setError(null);
    setSuccess(null);

    try {
      const endpoint =
        type === "mobile"
          ? `http://localhost:9090/api/auth/user/${username}/promozioni/${id}`
          : `http://localhost:9090/api/auth/user/${username}/promozioniLineaFissa/${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      if (type === "mobile") {
        setUser((prev) => ({
          ...prev,
          promozioni: prev.promozioni.filter((p) => p.id !== id),
        }));
      } else {
        setUser((prev) => ({
          ...prev,
          promozioniLineaFissa: prev.promozioniLineaFissa.filter((p) => p.id !== id),
        }));
      }

      setSuccess(`Promozione ${type === "mobile" ? "mobile" : "linea fissa"} rimossa con successo!`);
    } catch (error) {
      console.error("Errore nella rimozione:", error);
      setError(`Errore durante la rimozione della promozione ${type === "mobile" ? "mobile" : "linea fissa"}`);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };

  return (
    <>
      <Container className="mt-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Row>
          <h1 className="text-center my-5 fw-bolder">Benvenuto, {user.firstName}</h1>
          <Col xs={12} md={6}>
            <ListGroup>
              <ListGroup.Item className="w-50">
                <strong>Nome: </strong> {user.firstName}
              </ListGroup.Item>
              <ListGroup.Item className="w-50">
                <strong>Cognome: </strong> {user.lastName}
              </ListGroup.Item>
              <ListGroup.Item className="w-50">
                <strong>Email: </strong> {user.email}
              </ListGroup.Item>
              <ListGroup.Item className="w-50">
                <strong>Telefono: </strong> {user.telefono}
              </ListGroup.Item>
              <ListGroup.Item className="w-50">
                <strong>Telefono Linea Fissa: </strong> {user.telefonoLineaFissa}
              </ListGroup.Item>
              <ListGroup.Item className="w-50">
                <strong>Indirizzo: </strong> {user.indirizzo}, <strong>CAP: </strong> {user.cap}, <strong>Città: </strong> {user.città}
              </ListGroup.Item>
            </ListGroup>

            <div className="">
              <h3 className="my-3">Telefoni Acquistati Con noi:</h3>
              {user.telefoni.length > 0 ? (
                <Row>
                  {user.telefoni.map((telefono, index) => (
                    <Col key={index} xs={12} md={6} className="mb-3">
                      <Card>
                        {telefono.imgUrl && <Card.Img variant="top" src={telefono.imgUrl} alt={`${telefono.marca} ${telefono.modello}`} />}
                        <Card.Body>
                          <Card.Title>
                            {telefono.marca} {telefono.modello}
                          </Card.Title>
                          <Card.Text>
                            <strong>Memoria:</strong> {telefono.memoria}GB
                            <br />
                            <strong>Numero Seriale:</strong> {telefono.numeroSeriale}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-center text-muted">Nessun telefono associato</p>
              )}
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="mb-4">
              <h3 className="mb-3">Le tue promozioni per il mobile</h3>
              {user.promozioni.length > 0 ? (
                user.promozioni.map((promozione, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between align-items-center">
                        {promozione.nome}
                        <div>
                          <Badge bg={promozione.promozioniEnum === "ATTIVA" ? "success" : "secondary"}>{promozione.promozioniEnum}</Badge>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => confirmDelete(promozione.id, "mobile")}
                            disabled={loading.mobile}
                          >
                            {loading.mobile ? <Spinner as="span" size="sm" animation="border" role="status" /> : "Rimuovi"}
                          </Button>
                        </div>
                      </Card.Title>
                      <Card.Text>{promozione.descrizione}</Card.Text>
                      <div className="mb-2">
                        <strong>Minuti: </strong>
                        <ProgressBar striped variant="success" now={promozione.minuti} label={`${promozione.minuti}`} />
                      </div>
                      <div className="mb-2">
                        <strong>Messaggi: </strong>
                        <ProgressBar striped variant="info" now={promozione.messaggi} label={`${promozione.messaggi}`} />
                      </div>
                      <div className="mb-2">
                        <strong>Giga: </strong>
                        <ProgressBar striped variant="warning" now={promozione.giga} label={`${promozione.giga}`} />
                      </div>
                      <p className="fw-bold">Prezzo: €{promozione.prezzo} al Mese</p>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="danger my-5 mx-5">
                  <Alert.Heading className="text-center fw-bold">ATTENZIONE</Alert.Heading>
                  <p className="text-center">Nessuna promozione per la linea mobile, visita la HomePage e scegli la promozione perfetta per TE</p>
                </Alert>
              )}
            </div>

            <div>
              <h3 className="my-5">Le tue promozioni per la linea fissa</h3>
              {user.promozioniLineaFissa.length > 0 ? (
                user.promozioniLineaFissa.map((promozione, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between align-items-center">
                        {promozione.nome}
                        <div>
                          <Badge bg={promozione.promozioniLineaFissaEnum === "ATTIVA" ? "success" : "secondary"}>{promozione.promozioniLineaFissaEnum}</Badge>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => confirmDelete(promozione.id, "fissa")}
                            disabled={loading.fissa}
                          >
                            {loading.fissa ? <Spinner as="span" size="sm" animation="border" role="status" /> : "Rimuovi"}
                          </Button>
                        </div>
                      </Card.Title>
                      <Card.Text>{promozione.descrizione}</Card.Text>
                      <p>
                        <strong>Minuti:</strong> {promozione.minuti}
                      </p>
                      <p>
                        <strong>Giga:</strong> {promozione.giga}
                      </p>
                      <p className="fw-bold">Prezzo: €{promozione.prezzo} al Mese</p>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="danger my-4 mx-5">
                  <Alert.Heading className="text-center fw-bold">ATTENZIONE</Alert.Heading>
                  <p className="text-center">Nessuna promozione per la linea fissa disponibile , visita la HomePage e scegli la promozione perfetta per TE</p>
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modale di conferma */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma rimozione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler rimuovere questa promozione ,rimuovendo la promozione al si potrà usare per altre 4 settimane{" "}
          {promozioneToDelete.type === "mobile" ? "mobile" : "linea fissa"}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Conferma Rimozione
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="text-center">
        <Col>
          <Button variant="danger" className="my-5" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Profilo;
