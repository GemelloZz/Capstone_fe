import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

// Carica Stripe con la tua chiave pubblica
const stripePromise = loadStripe("pk_test_51R6VsJ1RqIaFvc30z7CiKfkhnoLFlYiVZne5EtwD4PSoNQ1sfi5ppS7VKOutzrzpTZCfJDI8sgoWdG1wUprNQMqt000ii1K6Bm");

const CheckoutFormTelefoni = ({ telefonoDetails, userId, telefonoId, onPaymentSuccess, onPaymentError, plantTree }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    onPaymentError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:9090/api/payments/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Math.round((telefonoDetails.prezzo + (plantTree ? 2 : 0)) * 100),
          currency: "eur",
          telefonoId,
          userId,
          plantTree: plantTree || false,
        }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        onPaymentError(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        onPaymentSuccess();
        setProcessing(false);
      }
    } catch (error) {
      onPaymentError(error.message);
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formCard" className="mb-3">
        <Form.Label>Dettagli Carta di Credito</Form.Label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!stripe || processing}>
        {processing ? "Elaborazione..." : `Paga €${((telefonoDetails?.prezzo || 0) + (plantTree ? 2 : 0)).toFixed(2)}`}
      </Button>
    </Form>
  );
};

const PagamentoTelefoni = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [userId, setUserId] = useState("");
  const [telefonoId, setTelefonoId] = useState(localStorage.getItem("idTelefono") || null);
  const [telefonoDetails, setTelefonoDetails] = useState(null);
  const [plantTree, setPlantTree] = useState(false);

  // Recupera l'ID del telefono dal localStorage
  useEffect(() => {
    const id = localStorage.getItem("idTelefono");
    if (id) {
      setTelefonoId(id);
    }
  }, []);

  // Recupera i dettagli del telefono
  useEffect(() => {
    const fetchTelefonoDetails = async () => {
      if (telefonoId) {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`http://localhost:9090/telefoni/${telefonoId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setTelefonoDetails(data);
        } catch (error) {
          console.error("Errore nel recupero dei dettagli del telefono:", error);
        }
      }
    };

    fetchTelefonoDetails();
  }, [telefonoId]);

  // Funzione per estrarre l'ID utente dal token JWT
  const getUserNameFromToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || null;
    } catch (error) {
      console.error("Errore nella decodifica del token:", error);
      return null;
    }
  };

  useEffect(() => {
    const userIdFromToken = getUserNameFromToken();
    if (userIdFromToken) {
      setUserId(userIdFromToken);
    }
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      const userName = getUserNameFromToken();
      const token = localStorage.getItem("authToken");

      if (token) {
        const response = await fetch(`http://localhost:9090/api/auth/user/${userName}/telefoni/${telefonoId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plantTree: plantTree,
          }),
        });

        if (!response.ok) {
          throw new Error("Errore nell'associazione del telefono");
        }

        setPaymentSuccess(true);
        localStorage.removeItem("idTelefono");

        setTimeout(() => navigate("/Profilo"), 3000);
      }
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="my-5">Completa l'acquisto del tuo nuovo telefono</h1>

          <h2 className="mb-3">Dettagli Prodotto</h2>
          {telefonoDetails ? (
            <div className="mb-4">
              <p>
                <strong>Modello:</strong> {telefonoDetails.marca} {telefonoDetails.modello}
              </p>
              <p>
                <strong>Memoria:</strong> {telefonoDetails.memoria}GB
              </p>
              <p>
                <strong>Prezzo:</strong> €{telefonoDetails.prezzo || "N/D"}
              </p>
            </div>
          ) : (
            <p>Caricamento dettagli telefono...</p>
          )}

          <h2>Dettagli Pagamento</h2>
          <p>
            <strong>Nome utente:</strong> {userId || "Nessun utente loggato"}
          </p>
          <p>
            <strong>Telefono selezionato:</strong> {telefonoDetails?.modello || "Nessun telefono selezionato"}
          </p>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label={
                <>
                  <strong>Pianta un albero (+€2)</strong>
                  <div className="text-muted">FlySim si impegna nella ricostruzione di foreste, partecipa anche tu e un albero avrà il tuo nome</div>
                </>
              }
              checked={plantTree}
              onChange={(e) => setPlantTree(e.target.checked)}
            />
          </Form.Group>

          {telefonoDetails && (
            <Elements stripe={stripePromise}>
              <CheckoutFormTelefoni
                telefonoDetails={telefonoDetails}
                userId={userId}
                telefonoId={telefonoId}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={setPaymentError}
                plantTree={plantTree}
              />
            </Elements>
          )}

          {paymentSuccess && (
            <Alert variant="success" className="mt-3">
              <h4>Pagamento effettuato con successo!</h4>
              <p>Il telefono {telefonoDetails?.modello} è stato associato al tuo account.</p>
              {plantTree && <p>Grazie per aver contribuito a piantare un albero!</p>}
            </Alert>
          )}

          {paymentError && (
            <Alert variant="danger" className="mt-3">
              <h4>Errore nel pagamento</h4>
              <p>{paymentError}</p>
            </Alert>
          )}

          <Alert variant="danger my-4 mx-5">
            <Alert.Heading className="text-center fw-bold">ATTENZIONE</Alert.Heading>
            <p className="text-center">
              Ogni telefono acquistato ha un diritto di reso di 30 giorni , ed una garanzia di 2 anni. Per info e diritti di recesso contattare il numero tel:
              1122334455
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default PagamentoTelefoni;
