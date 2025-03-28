import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

// Carica Stripe con la tua chiave pubblica
const stripePromise = loadStripe("pk_test_51R6VsJ1RqIaFvc30z7CiKfkhnoLFlYiVZne5EtwD4PSoNQ1sfi5ppS7VKOutzrzpTZCfJDI8sgoWdG1wUprNQMqt000ii1K6Bm");

const CheckoutForm = ({ promotionDetails, userId, promotionId, onPaymentSuccess, onPaymentError, plantTree }) => {
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
          amount: Math.round((promotionDetails.prezzo + (plantTree ? 2 : 0)) * 100),
          currency: "eur",
          promotionId,
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
        {processing ? "Elaborazione..." : `Paga €${((promotionDetails?.prezzo || 0) + (plantTree ? 2 : 0)).toFixed(2)}`}
      </Button>
    </Form>
  );
};

const Pagamento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [userId, setUserId] = useState("");
  const [promotionId, setPromotionId] = useState(location.state?.idPromozione || localStorage.getItem("idPromozione") || null);
  const [promotionDetails, setPromotionDetails] = useState(null);
  const [plantTree, setPlantTree] = useState(false);

  // Recupera i dettagli della promozione
  useEffect(() => {
    const fetchPromotionDetails = async () => {
      if (promotionId) {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`http://localhost:9090/promozioni/${promotionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setPromotionDetails(data);
        } catch (error) {
          console.error("Errore nel recupero dei dettagli della promozione:", error);
        }
      }
    };

    fetchPromotionDetails();
  }, [promotionId]);

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
        const response = await fetch(`http://localhost:9090/api/auth/user/${userName}/promozioni/${promotionId}`, {
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
          throw new Error("Errore nell'associazione della promozione");
        }

        setPaymentSuccess(true);
        localStorage.removeItem("idPromozione");

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
          <h1 className="my-5">Completa l'acquisto della tua promozione</h1>

          <h2 className="mb-3">Dettagli Promozione</h2>
          {promotionDetails ? (
            <div className="mb-4">
              <p>
                <strong>Nome:</strong> {promotionDetails.nome}
              </p>
              <p>
                <strong>Descrizione:</strong> {promotionDetails.descrizione}
              </p>
              <p>
                <strong>Minuti inclusi:</strong> {promotionDetails.minuti}
              </p>
              <p>
                <strong>Giga inclusi:</strong> {promotionDetails.giga}
              </p>
              <p>
                <strong>Prezzo:</strong> €{promotionDetails.prezzo || "N/D"}
              </p>
            </div>
          ) : (
            <p>Caricamento dettagli promozione...</p>
          )}

          <h2>Dettagli Pagamento</h2>
          <p>
            <strong>Nome utente:</strong> {userId || "Nessun utente loggato"}
          </p>
          <p>
            <strong>Promozione selezionata:</strong> {promotionDetails?.nome || "Nessuna promozione selezionata"}
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

          {promotionDetails && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                promotionDetails={promotionDetails}
                userId={userId}
                promotionId={promotionId}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={setPaymentError}
                plantTree={plantTree}
              />
            </Elements>
          )}

          {paymentSuccess && (
            <Alert variant="success" className="mt-3">
              <h4>Pagamento effettuato con successo!</h4>
              <p>La promozione {promotionDetails?.nome} è stata associata al tuo account.</p>
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
              Non è possibile annullare il pagamento una volta effettuato. Per info e diritti di recesso contattare il numero tel: 1122334455
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Pagamento;
