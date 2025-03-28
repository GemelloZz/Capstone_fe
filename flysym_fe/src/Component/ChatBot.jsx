import React, { useState, useEffect, useRef } from "react";
import { Button, ListGroup, Form, InputGroup, Overlay, Popover } from "react-bootstrap";
import { FaComment, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChatPopup = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentOptions, setCurrentOptions] = useState([]);
  const target = useRef(null);
  const messagesEndRef = useRef(null);

  // Database delle risposte con navigazione
  const chatResponses = {
    initial: {
      text: "Ciao! Sono il tuo assistente virtuale. Seleziona un'opzione e verrai reindirizzato alla pagina richiesta:",
      options: ["1. Promozioni", "2. Promozioni Linea Fissa", "3. Telefoni"],
    },
    1: {
      text: "Ti sto reindirizzando alle Promozioni...",
      action: () => navigate("/promozioni"),
      options: [],
    },
    2: {
      text: "Ti sto reindirizzando alle Promozioni Linea Fissa...",
      action: () => navigate("/promozioniLineaFissa"),
      options: [],
    },
    3: {
      text: "Ti sto reindirizzando alla sezione Telefoni...",
      action: () => navigate("/telefoni"),
      options: [],
    },
    default: {
      text: "Non ho capito la tua richiesta. Seleziona un'opzione:",
      options: ["1. Promozioni", "2. Promozioni Linea Fissa", "3. Telefoni"],
    },
  };

  useEffect(() => {
    // Messaggio iniziale
    setMessages([chatResponses.initial]);
    setCurrentOptions(chatResponses.initial.options);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Aggiungi messaggio utente
    const userMessage = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simula ritardo risposta bot
    setTimeout(() => {
      let response = chatResponses[inputValue] || chatResponses.default;

      setMessages((prev) => [
        ...prev,
        {
          text: response.text,
          isUser: false,
          options: response.options,
        },
      ]);
      setCurrentOptions(response.options || []);

      // Esegui l'azione di navigazione se presente
      if (response.action) {
        setTimeout(() => {
          response.action();
          setShowChat(false); // Chiudi la chat dopo la navigazione
        }, 1500);
      }
    }, 500);
  };

  const handleOptionSelect = (option) => {
    const number = option.split(".")[0].trim();
    setInputValue(number);
    handleSend();
  };

  return (
    <>
      {/* Pulsante chat fisso */}
      <Button
        ref={target}
        variant="warning
        "
        onClick={() => setShowChat(!showChat)}
        style={{
          position: "fixed",
          bottom: "300px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        {showChat ? <FaTimes size={20} /> : <FaComment size={20} />}
      </Button>

      {/* Popup della chat */}
      <Overlay show={showChat} target={target.current} placement="top-end" container={document.body} rootClose onHide={() => setShowChat(false)}>
        <Popover
          id="chat-popover"
          style={{
            width: "350px",
            maxWidth: "350px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Popover.Header as="h3" className="d-flex justify-content-between align-items-center">
            Assistenza Clienti
            <Button variant="link" onClick={() => setShowChat(false)} style={{ padding: 0 }}>
              <FaTimes />
            </Button>
          </Popover.Header>
          <Popover.Body style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.isUser ? "text-end" : "text-start"}`}>
                  <div className={`d-inline-block p-2 rounded ${msg.isUser ? "bg-primary text-white" : "bg-light"}`} style={{ maxWidth: "80%" }}>
                    {msg.text}
                  </div>

                  {msg.options && !msg.isUser && (
                    <ListGroup className="mt-2">
                      {msg.options.map((opt, i) => (
                        <ListGroup.Item key={i} action onClick={() => handleOptionSelect(opt)} className="option-item">
                          {opt}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </Popover.Body>
          <div className="p-2 border-top">
            <InputGroup>
              <Form.Control
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Scrivi il numero dell'opzione..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button variant="primary" onClick={handleSend}>
                <FaPaperPlane />
              </Button>
            </InputGroup>
          </div>
        </Popover>
      </Overlay>
    </>
  );
};

export default ChatPopup;
