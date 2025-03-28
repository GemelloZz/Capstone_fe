import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const DoveSiamo = () => {
  // Dati dello store
  const storeInfo = {
    nome: "FlySim Store",
    indirizzo: "Via del Corso, 123 - 00186 Roma",
    orari: "Lun-Ven: 9:00-19:00 | Sab: 10:00-18:00",
    telefono: "+39 06 1234567",
    email: "info@flysimstore.com",
    fondazione: "15 Marzo 2020",
    proprietario: "Gabriele Lucarelli",
    descrizione: "Il nostro store è nato dalla passione per le connessioni veloci e l'innovazione tecnologica.",
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Dove Siamo</h1>

      <Row className="mb-5">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-primary">{storeInfo.nome}</Card.Title>
              <Card.Text>
                <strong>Indirizzo:</strong> {storeInfo.indirizzo}
                <br />
                <strong>Orari:</strong> {storeInfo.orari}
                <br />
                <strong>Telefono:</strong> {storeInfo.telefono}
                <br />
                <strong>Email:</strong> {storeInfo.email}
              </Card.Text>
              <hr />
              <Card.Text>
                <strong>Fondato il:</strong> {storeInfo.fondazione}
                <br />
                <strong>Proprietario:</strong> {storeInfo.proprietario}
              </Card.Text>
              <Card.Text className="mt-3">
                {storeInfo.descrizione}
                <br />
                <br />
                Abbiamo creato questo spazio per offrire connessioni alla massima velocità possibile, perché crediamo che nel mondo digitale di oggi, ogni
                secondo conti.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          {/* Mappa statica con immagine e marker posizionato con CSS */}
          <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=41.9028,12.4964&zoom=15&size=800x400&maptype=roadmap"
              alt="Mappa FlySim Store"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "32px",
                height: "32px",
                background: "red",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            ></div>
          </div>

          <small className="text-muted mt-2 d-block text-center">La nostra sede centrale a Roma</small>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h2 className="text-center mb-3">La nostra filosofia</h2>
          <p className="text-center lead">
            "Velocità non è solo una caratteristica tecnica, è un'esperienza utente. Gabriele Lucarelli ha fondato FlySim con l'idea che nessuno dovrebbe
            aspettare più del necessario quando naviga online."
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default DoveSiamo;
