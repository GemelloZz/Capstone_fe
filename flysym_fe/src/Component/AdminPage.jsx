import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card, Form, Alert, Modal, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  // Stato per promozioni mobile
  const [promozioneId, setPromozioneId] = useState("");
  const [newPromozione, setNewPromozione] = useState({
    nome: "",
    descrizione: "",
    minuti: 0,
    giga: 0,
    prezzo: 0.1,
    messaggi: 0,
    promozioniEnum: "ATTIVA",
  });

  // Stato per promozioni linea fissa
  const [promozioneLineaFissaId, setPromozioneLineaFissaId] = useState("");
  const [newPromozioneLineaFissa, setNewPromozioneLineaFissa] = useState({
    nome: "",
    descrizione: "",
    minuti: "0",
    giga: "0",
    prezzo: 0.1,
    promozioniLineaFissaEnum: "ATTIVA",
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmAdd, setShowConfirmAdd] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmAddLineaFissa, setShowConfirmAddLineaFissa] = useState(false);
  const [showConfirmDeleteLineaFissa, setShowConfirmDeleteLineaFissa] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Verifica se l'utente è admin
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const roles = decodedToken.roles;
      setIsAdmin(roles.includes("ROLE_ADMIN"));
    }
    setLoading(false);
  }, []);

  // Aggiungi una nuova promozione mobile
  const addPromozione = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:9090/api/admin/promozioni/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPromozione),
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiungere la promozione");
      }

      setShowConfirmAdd(false);
      setNewPromozione({
        nome: "",
        descrizione: "",
        minuti: 0,
        giga: 0,
        prezzo: 0.1,
        messaggi: 0,
        promozioniEnum: "ATTIVA",
      });

      showAlert("Promozione mobile aggiunta con successo!", "success");
    } catch (error) {
      console.error("Errore nell'aggiungere la promozione:", error);
      showAlert("Errore nell'aggiungere la promozione mobile", "danger");
    }
  };

  // Elimina una promozione mobile
  const deletePromozione = async () => {
    if (!promozioneId) {
      showAlert("Inserisci un ID promozione valido", "warning");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:9090/api/admin/promozioni/delete/${promozioneId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore nell'eliminare la promozione");
      }

      setPromozioneId("");
      setShowConfirmDelete(false);
      showAlert("Promozione mobile eliminata con successo!", "success");
    } catch (error) {
      console.error("Errore nel tentativo di eliminare la promozione:", error);
      showAlert("Errore nell'eliminare la promozione mobile", "danger");
    }
  };

  // Aggiungi una nuova promozione linea fissa
  const addPromozioneLineaFissa = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:9090/api/admin/promozioniLineaFissa/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPromozioneLineaFissa),
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiungere la promozione linea fissa");
      }

      setShowConfirmAddLineaFissa(false);
      setNewPromozioneLineaFissa({
        nome: "",
        descrizione: "",
        minuti: "0",
        giga: "0",
        prezzo: 0.1,
        promozioniLineaFissaEnum: "ATTIVA",
      });

      showAlert("Promozione linea fissa aggiunta con successo!", "success");
    } catch (error) {
      console.error("Errore nell'aggiungere la promozione linea fissa:", error);
      showAlert("Errore nell'aggiungere la promozione linea fissa", "danger");
    }
  };

  // Elimina una promozione linea fissa
  const deletePromozioneLineaFissa = async () => {
    if (!promozioneLineaFissaId) {
      showAlert("Inserisci un ID promozione valido", "warning");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:9090/api/admin/promozioniLineaFissa/delete/${promozioneLineaFissaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore nell'eliminare la promozione linea fissa");
      }

      setPromozioneLineaFissaId("");
      setShowConfirmDeleteLineaFissa(false);
      showAlert("Promozione linea fissa eliminata con successo!", "success");
    } catch (error) {
      console.error("Errore nel tentativo di eliminare la promozione linea fissa:", error);
      showAlert("Errore nell'eliminare la promozione linea fissa", "danger");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPromozione((prevState) => ({
      ...prevState,
      [name]: name === "minuti" || name === "giga" || name === "prezzo" || name === "messaggi" ? parseFloat(value) : value,
    }));
  };

  const handleChangeLineaFissa = (e) => {
    const { name, value } = e.target;
    setNewPromozioneLineaFissa((prevState) => ({
      ...prevState,
      [name]: name === "prezzo" ? parseFloat(value) : value,
    }));
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 5000);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h3>Caricamento...</h3>
      </div>
    );

  return (
    <Container className="py-5">
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {isAdmin ? (
        <>
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Gestione Promozioni</h2>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Aggiungi Promozione Mobile */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h4>Aggiungi Nuova Promozione Mobile</h4>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Promozione</Form.Label>
                      <Form.Control type="text" name="nome" value={newPromozione.nome} onChange={handleChange} placeholder="Nome promozione" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Descrizione</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="descrizione"
                        value={newPromozione.descrizione}
                        onChange={handleChange}
                        placeholder="Descrizione"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Minuti inclusi</Form.Label>
                          <Form.Control type="number" name="minuti" value={newPromozione.minuti} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Giga inclusi</Form.Label>
                          <Form.Control type="number" name="giga" value={newPromozione.giga} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Prezzo (€)</Form.Label>
                          <Form.Control type="number" step="0.01" name="prezzo" value={newPromozione.prezzo} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Messaggi inclusi</Form.Label>
                          <Form.Control type="number" name="messaggi" value={newPromozione.messaggi} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Stato Promozione</Form.Label>
                      <Form.Select name="promozioniEnum" value={newPromozione.promozioniEnum} onChange={handleChange}>
                        <option value="ATTIVA">Attiva</option>
                        <option value="INATTIVA">Inattiva</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="d-grid">
                      <Button variant="primary" onClick={() => setShowConfirmAdd(true)} disabled={!newPromozione.nome || !newPromozione.descrizione}>
                        Crea Promozione
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Elimina Promozione Mobile */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="bg-danger text-white">
                  <h4>Elimina Promozione Mobile</h4>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Promozione da eliminare</Form.Label>
                    <Form.Control
                      type="text"
                      value={promozioneId}
                      onChange={(e) => setPromozioneId(e.target.value)}
                      placeholder="Inserisci l'ID della promozione"
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="danger" onClick={() => setShowConfirmDelete(true)} disabled={!promozioneId}>
                      Elimina Promozione
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Aggiungi Promozione Linea Fissa */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="bg-success text-white">
                  <h4>Aggiungi Nuova Promozione Linea Fissa</h4>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Promozione</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={newPromozioneLineaFissa.nome}
                        onChange={handleChangeLineaFissa}
                        placeholder="Nome promozione"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Descrizione</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="descrizione"
                        value={newPromozioneLineaFissa.descrizione}
                        onChange={handleChangeLineaFissa}
                        placeholder="Descrizione"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Minuti inclusi</Form.Label>
                          <Form.Control
                            type="text"
                            name="minuti"
                            value={newPromozioneLineaFissa.minuti}
                            onChange={handleChangeLineaFissa}
                            placeholder="Es: Illimitati"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Giga inclusi</Form.Label>
                          <Form.Control
                            type="text"
                            name="giga"
                            value={newPromozioneLineaFissa.giga}
                            onChange={handleChangeLineaFissa}
                            placeholder="Es: Illimitati"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Prezzo (€)</Form.Label>
                      <Form.Control type="number" step="0.01" name="prezzo" value={newPromozioneLineaFissa.prezzo} onChange={handleChangeLineaFissa} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Stato Promozione</Form.Label>
                      <Form.Select name="promozioniLineaFissaEnum" value={newPromozioneLineaFissa.promozioniLineaFissaEnum} onChange={handleChangeLineaFissa}>
                        <option value="ATTIVA">Attiva</option>
                        <option value="INATTIVA">Inattiva</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        variant="success"
                        onClick={() => setShowConfirmAddLineaFissa(true)}
                        disabled={!newPromozioneLineaFissa.nome || !newPromozioneLineaFissa.descrizione}
                      >
                        Crea Promozione Linea Fissa
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Elimina Promozione Linea Fissa */}
            <Col md={6}>
              <Card>
                <Card.Header className="bg-warning text-dark">
                  <h4>Elimina Promozione Linea Fissa</h4>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Promozione da eliminare</Form.Label>
                    <Form.Control
                      type="text"
                      value={promozioneLineaFissaId}
                      onChange={(e) => setPromozioneLineaFissaId(e.target.value)}
                      placeholder="Inserisci l'ID della promozione"
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="warning" onClick={() => setShowConfirmDeleteLineaFissa(true)} disabled={!promozioneLineaFissaId}>
                      Elimina Promozione
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Modale Conferma Aggiunta Mobile */}
          <Modal show={showConfirmAdd} onHide={() => setShowConfirmAdd(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Conferma Nuova Promozione Mobile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Nome:</strong> {newPromozione.nome}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Descrizione:</strong> {newPromozione.descrizione}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Minuti:</strong> {newPromozione.minuti}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Giga:</strong> {newPromozione.giga}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Prezzo:</strong> €{newPromozione.prezzo.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Messaggi:</strong> {newPromozione.messaggi}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Stato:</strong> <Badge bg={newPromozione.promozioniEnum === "ATTIVA" ? "success" : "secondary"}>{newPromozione.promozioniEnum}</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmAdd(false)}>
                Annulla
              </Button>
              <Button variant="primary" onClick={addPromozione}>
                Conferma Aggiunta
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modale Conferma Eliminazione Mobile */}
          <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Conferma Eliminazione</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Sei sicuro di voler eliminare la promozione mobile con ID: <strong>{promozioneId}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
                Annulla
              </Button>
              <Button variant="danger" onClick={deletePromozione}>
                Conferma Eliminazione
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modale Conferma Aggiunta Linea Fissa */}
          <Modal show={showConfirmAddLineaFissa} onHide={() => setShowConfirmAddLineaFissa(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Conferma Nuova Promozione Linea Fissa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Nome:</strong> {newPromozioneLineaFissa.nome}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Descrizione:</strong> {newPromozioneLineaFissa.descrizione}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Minuti:</strong> {newPromozioneLineaFissa.minuti}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Giga:</strong> {newPromozioneLineaFissa.giga}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Prezzo:</strong> €{newPromozioneLineaFissa.prezzo.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Stato:</strong>{" "}
                  <Badge bg={newPromozioneLineaFissa.promozioniLineaFissaEnum === "ATTIVA" ? "success" : "secondary"}>
                    {newPromozioneLineaFissa.promozioniLineaFissaEnum}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmAddLineaFissa(false)}>
                Annulla
              </Button>
              <Button variant="success" onClick={addPromozioneLineaFissa}>
                Conferma Aggiunta
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modale Conferma Eliminazione Linea Fissa */}
          <Modal show={showConfirmDeleteLineaFissa} onHide={() => setShowConfirmDeleteLineaFissa(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Conferma Eliminazione</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Sei sicuro di voler eliminare la promozione linea fissa con ID: <strong>{promozioneLineaFissaId}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmDeleteLineaFissa(false)}>
                Annulla
              </Button>
              <Button variant="warning" onClick={deletePromozioneLineaFissa}>
                Conferma Eliminazione
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Card className="text-center">
          <Card.Header className="bg-warning text-dark">
            <h3>Accesso non autorizzato</h3>
          </Card.Header>
          <Card.Body>
            <Card.Title>Solo gli amministratori possono accedere a questa pagina</Card.Title>
            <Button variant="primary" onClick={() => navigate("/")}>
              Torna alla Home
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminPage;
