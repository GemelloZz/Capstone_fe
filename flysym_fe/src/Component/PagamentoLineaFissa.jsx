import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";

// Carica Stripe con la tua chiave pubblica
const stripePromise = loadStripe("pk_test_51R6VsJ1RqIaFvc30z7CiKfkhnoLFlYiVZne5EtwD4PSoNQ1sfi5ppS7VKOutzrzpTZCfJDI8sgoWdG1wUprNQMqt000ii1K6Bm");

const CheckoutForm = ({ promozioneDetails, userId, promozioneId, onPaymentSuccess, onPaymentError, plantTree }) => {
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
          amount: (promozioneDetails.prezzo + (plantTree ? 2 : 0)) * 100, // Stripe usa centesimi
          currency: "eur",
          promozioneId,
          userId,
          plantTree: plantTree || false,
        }),
      });

      const { clientSecret } = await response.json();

      // 2. Conferma il pagamento con Stripe
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
        {processing ? "Elaborazione..." : `Paga €${((promozioneDetails?.prezzo || 0) + (plantTree ? 2 : 0)).toFixed(2)}`}
      </Button>
    </Form>
  );
};

const PagamentoPromozioniLineaFissa = () => {
  const navigate = useNavigate();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [userId, setUserId] = useState("");
  const [promozioneId, setPromozioneId] = useState(localStorage.getItem("idPromozioneLineaFissa") || null);
  const [promozioneDetails, setPromozioneDetails] = useState(null);
  const [plantTree, setPlantTree] = useState(false);

  // Recupera l'ID della promozione dal localStorage
  useEffect(() => {
    const id = localStorage.getItem("idPromozioneLineaFissa");
    if (id) {
      setPromozioneId(id);
    }
  }, []);

  // Recupera i dettagli della promozione
  useEffect(() => {
    const fetchPromozioneDetails = async () => {
      if (promozioneId) {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`http://localhost:9090/promozioniLineaFissa/${promozioneId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setPromozioneDetails(data);
        } catch (error) {
          console.error("Errore nel recupero dei dettagli della promozione:", error);
        }
      }
    };

    fetchPromozioneDetails();
  }, [promozioneId]);

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
        // Chiamata per associare la promozione all'utente
        const response = await fetch(`http://localhost:9090/api/auth/user/${userName}/promozioniLineaFissa/${promozioneId}`, {
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
        localStorage.removeItem("idPromozioneLineaFissa");

        // Reindirizza alla pagina di conferma dopo 3 secondi
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
          <h1 className="my-5">Completa questi piccoli passaggi per iniziare a navigare con FlySim</h1>

          <h2 className="mb-3">Promozione Selezionata</h2>
          {promozioneDetails ? (
            <div className="mb-4">
              <p>
                <strong>Nome:</strong> {promozioneDetails.nome}
              </p>
              <p>
                <strong>Descrizione:</strong> {promozioneDetails.descrizione}
              </p>
              <p>
                <strong>Minuti inclusi:</strong> {promozioneDetails.minuti}
              </p>
              <p>
                <strong>GiGa inclusi:</strong> {promozioneDetails.giga} Alla velocità della Gigabit
              </p>
              <p>
                <strong>Prezzo:</strong> €{promozioneDetails.prezzo || "N/D"}
              </p>
            </div>
          ) : (
            <p>Caricamento dettagli promozione...</p>
          )}

          <h2>Dettagli Pagamento Finale</h2>

          <p>
            <strong>Nome utente:</strong> {userId || "Nessun utente loggato"}
          </p>
          <p>
            <strong>Promozione Selezionata:</strong> {promozioneDetails?.nome || "Nessuna promozione selezionata"}
          </p>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label={
                <>
                  <strong>Pianta un albero</strong>
                  <div className="text-muted">
                    FlySim si impegna nella ricostruzione di foreste, partecipa anche tu e un albero avrà il tuo nome , Costa solo 2€{" "}
                  </div>
                </>
              }
              checked={plantTree}
              onChange={(e) => setPlantTree(e.target.checked)}
            />
          </Form.Group>

          {promozioneDetails && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                promozioneDetails={promozioneDetails}
                userId={userId}
                promozioneId={promozioneId}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={setPaymentError}
                plantTree={plantTree}
              />
            </Elements>
          )}

          {paymentSuccess && (
            <Alert variant="success" className="mt-3">
              <h4>Pagamento effettuato con successo!</h4>
              <p>La promozione {promozioneDetails?.nome} è stata associata al tuo account.</p>
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
              Non è possibile annullare il pagamento una volta effettuato. Pagando la promozione inizierà il periodo di uso di 30 giorni , è possibile annullare
              la promozione in qualsiasi momento , ma è comunque utilizzabile per tutto l'arco temporale. Per info e diritti di recesso contattare il numero tel
              : 1122334455
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default PagamentoPromozioniLineaFissa;
