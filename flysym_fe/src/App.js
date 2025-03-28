import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Component/Home";
import Navbar from "./Component/Mynavbar";
import MyFooter from "./Component/Myfooter";
import Login from "./Component/Login";
import Registrati from "./Component/Registrati";
import Promozioni from "./Component/Promozioni";
import PromozioniLineaFissa from "./Component/PromozioniLineaFissa";
import Profilo from "./Component/DatiUtenti";
import Pagamento from "./Component/Pagamento";
import Telefoni from "./Component/Telefoni";
import PagamentoTelefoni from "./Component/PagamentoTelefoni";
import PagamentoLineaFissa from "./Component/PagamentoLineaFissa";
import ChatPopup from "./Component/ChatBot";
import AdminPage from "./Component/AdminPage";
import DoveSiamo from "./Component/DoveSiamo";
import Page404 from "./Component/Page404";

function App() {
  return (
    <Router>
      <>
        <header>
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrati" element={<Registrati />} />
            <Route path="/Promozioni" element={<Promozioni />} />
            <Route path="/promozioniLineaFissa" element={<PromozioniLineaFissa />} />
            <Route path="/Profilo" element={<Profilo />} />
            <Route path="/pagamento" element={<Pagamento />} />
            <Route path="/telefoni" element={<Telefoni />} />
            <Route path="/PagamentoTelefoni" element={<PagamentoTelefoni />} />
            <Route path="/PagamentoLineaFissa" element={<PagamentoLineaFissa />} />
            <Route path="/AdminPage" element={<AdminPage />} />
            <Route path="/DoveSiamo" element={<DoveSiamo />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
        <footer>
          <MyFooter />
        </footer>
        <ChatPopup />
      </>
    </Router>
  );
}

export default App;
