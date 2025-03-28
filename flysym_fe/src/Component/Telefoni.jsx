import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function Telefoni() {
  const [telefoni, setTelefoni] = useState([]); // Cambiato da oggetto a array

  const handleBuy = (id) => {
    localStorage.setItem("idTelefono", id);
    window.location.href = "/PagamentoTelefoni";
  };
  // Esegui la fetch al montaggio del componente
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token non trovato");
        return;
      }

      try {
        const response = await fetch("http://localhost:9090/telefoni", {
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
        setTelefoni(data); // Qui settiamo l'array di telefoni
      } catch (error) {
        console.error("Errore nella fetch dei dati:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {telefoni.map((telefono) => (
        <Card key={telefono.id} style={{ width: "18rem", margin: "10px" }}>
          {telefono.imgUrl ? (
            <Card.Img variant="top" src={telefono.imgUrl} alt={`Immagine di ${telefono.modello}`} />
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "180px", backgroundColor: "#f0f0f0" }}>
              <span>Immagine non disponibile</span>
            </div>
          )}
          <Card.Body>
            <Card.Title>
              {telefono.marca} : {telefono.modello}
            </Card.Title>
            <Card.Text>
              <strong>Memoria:</strong> {telefono.memoria} GB
            </Card.Text>
            <Card.Text>
              <strong>Numero di Serie:</strong> {telefono.numeroSeriale}
            </Card.Text>
            <Button variant="primary" onClick={() => handleBuy(telefono.id)}>
              Acquista
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default Telefoni;
