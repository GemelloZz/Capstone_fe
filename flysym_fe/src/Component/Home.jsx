import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Casa from "../img/Casa.jpg";
import Telefoni from "../img/telefoni.jpg";
import Uomo from "../img/retemobile.jpg";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [index, setIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const navigateTo = (path) => {
    if ("authToken" in localStorage) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  return (
    <>
      <Carousel activeIndex={index} onSelect={handleSelect} className="mt-0">
        <Carousel.Item>
          <img className="d-block w-100" src={Casa} alt="first-slide" style={{ height: "500px", objectFit: "cover" }} />
          <Carousel.Caption>
            <h3 className="text-warning fw-bold" style={{ fontSize: "40px" }}>
              Rete Fissa
            </h3>
            <p className="text-warning fw-bold" style={{ fontSize: "25px" }}>
              Tutta la velocità della fibra, ad un prezzo accessibile a tutti.
            </p>
            <Button variant="warning" disabled={isLoading} onClick={() => navigateTo("/promozioniLineaFissa")}>
              {isLoading ? "IN VIAGGIO…" : "VIENI A SCOPRIRLO"}
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={Uomo} alt="second-slide" style={{ height: "500px", objectFit: "cover" }} className="d-block w-100" />
          <Carousel.Caption>
            <h3 className="text-warning fw-bold" style={{ fontSize: "40px" }}>
              Rete Mobile
            </h3>
            <p className="text-warning fw-bold" style={{ fontSize: "25px" }}>
              Lo sapevi che il nostro servizio 5G è differente? Vieni a scoprirlo.
            </p>
            <Button variant="warning" disabled={isLoading} onClick={() => navigateTo("/promozioni")}>
              {isLoading ? "IN VIAGGIO…" : "VIENI A SCOPRIRLO"}
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={Telefoni} alt="second-slide" style={{ height: "500px", objectFit: "cover" }} className="d-block w-100" />
          <Carousel.Caption>
            <h3 className="text-warning fw-bold" style={{ fontSize: "40px" }}>
              Scegli il telefono che fa per te
            </h3>
            <p className="text-warning fw-bold" style={{ fontSize: "25px" }}>
              IPHONE, SAMSUNG, XIAOMI e molti altri...
            </p>
            <Button variant="warning" disabled={isLoading} onClick={() => navigateTo("/telefoni")}>
              {isLoading ? "IN VIAGGIO…" : "VIENI A SCOPRIRLO"}
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="container-fluid my-5 ms-3 d-flex justify-content-center">
        <div className="row justify-content-center">
          <Card className="me-4 mb-3 shadow-lg" style={{ width: "18rem", height: "15rem", borderColor: "grey" }}>
            <Card.Body className="text-center">
              <Card.Title className="mb-3 fw-bold text-warning">Perchè scegliere FlySim?</Card.Title>
              <Card.Text>
                Perchè siamo la linea fissa e mobile più veloce d'Italia. Con una velocità media di 500 Mbit/s da Fisso e circa 1gbps da Mobile.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="me-4 mb-3 shadow-lg" style={{ width: "18rem", height: "15rem", borderColor: "grey" }}>
            <Card.Body className="text-center">
              <Card.Title className="mb-3 fw-bold text-warning">Assistenza H24</Card.Title>
              <Card.Text>FlySim ha un servizio 24/7 di assistenza. Se hai bisogno di aiuto non esitare a contattarci al numero +39 333 444 555.</Card.Text>
            </Card.Body>
          </Card>
          <Card className="me-4 mb-3 shadow-lg" style={{ width: "18rem", height: "15rem", borderColor: "grey" }}>
            <Card.Body className="text-center">
              <Card.Title className="mb-3 fw-bold text-warning">Prezzi da urlo!!!!</Card.Title>
              <Card.Text>Hai visto le nostre promozioni per il mobile? Beh... io mi farei un giretto.</Card.Text>
            </Card.Body>
          </Card>
          <Card className="me-4 mb-3 shadow-lg" style={{ width: "18rem", height: "15rem", borderColor: "grey" }}>
            <Card.Body className="text-center">
              <Card.Title className="mb-3 fw-bold text-warning">Perchè Siamo dalla parte dell'ambiente</Card.Title>
              <Card.Text>
                Quest'anno FlySim ha piantato circa 100'000 alberi per la conservazione dell'ambiente. Contribuisci anche tu a questo progetto.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomePage;
