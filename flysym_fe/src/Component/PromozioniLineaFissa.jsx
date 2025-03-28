import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

const PromozioniLineaFissa = () => {
  const [promozioni, setPromozioni] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBuy = (id) => {
    localStorage.setItem("idPromozioneLineaFissa", id);
    window.location.href = "/PagamentoLineaFissa";
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Nessun token trovato");
      setLoading(false);
      return;
    }

    fetch("http://localhost:9090/promozioniLineaFissa", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPromozioni(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dati:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="mx-5">
        {loading ? (
          <p className="text-center">Caricamento...</p>
        ) : promozioni.length > 0 ? (
          <div className="row justify-content-center">
            {promozioni.map((promozione, index) => (
              <Card key={index} className="text-center my-5 mx-5 shadow-lg p-0">
                <Card.Header className="fw-bold fs-3">{promozione.nome}</Card.Header>
                <Card.Body>
                  <Card.Text>{promozione.descrizione}</Card.Text>
                  <p>
                    <strong>Giga:</strong> {promozione.giga} | <strong>Minuti:</strong> {promozione.minuti}
                  </p>
                  <p>
                    <strong>Prezzo:</strong> €{promozione.prezzo}
                  </p>
                  <Button variant="primary" onClick={() => handleBuy(promozione.id)}>
                    Acquista
                  </Button>
                </Card.Body>
                <Card.Footer className="text-muted bg-warning">Disponibile ora</Card.Footer>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center">Nessuna promozione disponibile.</p>
        )}
      </div>
    </>
  );
};

export default PromozioniLineaFissa;
