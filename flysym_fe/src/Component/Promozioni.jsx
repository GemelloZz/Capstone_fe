import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

const Promozioni = () => {
  const [promozioni, setPromozioni] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleAcquista = (id) => {
    navigate("/Pagamento", { state: { idPromozione: id } });
  };
  useEffect(() => {
    // Recupera il token dal localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Nessun token trovato");
      return;
    }

    fetch("http://localhost:9090/promozioni", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPromozioni(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dati:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Alert variant="danger my-4 mx-5">
        <Alert.Heading className="text-center fw-bold">ATTENZIONE</Alert.Heading>
        <p className="text-center">
          Passando a FlySim da qualsiasi altro operatore puoi benificiare di un 10 % di sconto , e nessun Costo di attivazazione per una nuova scheda eSim
        </p>
      </Alert>
      <div>
        {loading ? (
          <p>Caricamento...</p>
        ) : promozioni.length > 0 ? (
          promozioni.map((promozione, index) => (
            <Card key={index} className="text-center my-5 mx-5 shadow-lg">
              <Card.Header className="fw-bold fs-3">{promozione.nome}</Card.Header>
              <Card.Body>
                <Card.Text>{promozione.descrizione}</Card.Text>
                <p>
                  <strong>Giga:</strong> {promozione.giga} | <strong>Minuti:</strong> {promozione.minuti} | <strong>Messaggi:</strong> {promozione.messaggi}
                </p>
                <p>
                  <strong>Prezzo:</strong> €{promozione.prezzo}
                </p>
                <Button variant="primary" onClick={() => handleAcquista(promozione.id)}>
                  Acquista
                </Button>
              </Card.Body>
              <Card.Footer className="text-muted bg-warning">Disponibile ora</Card.Footer>
            </Card>
          ))
        ) : (
          <p>Errore nel caricamento dei dati.</p>
        )}
      </div>
    </>
  );
};

export default Promozioni;
