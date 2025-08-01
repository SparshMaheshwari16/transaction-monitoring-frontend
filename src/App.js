import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import RulesPage from "./pages/RulesPage";
import TransactionsPage from "./pages/TransactionsPage";
import EvaluationPage from "./pages/EvaluationPage";
import ResultsPage from "./pages/ResultsPage";
import UserTransactionsPage from "./pages/UserTransactionsPage";

const linkBaseStyle = {
  padding: "10px 22px",
  margin: "0 4px",
  borderRadius: 8,
  color: "#374151",
  fontWeight: 500,
  textDecoration: "none",
  transition: "background 0.18s, color 0.18s",
  background: "none",
  position: "relative",
};

const navStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 12,
  alignItems: "center",
  background: "linear-gradient(90deg,#e0e7ff,#fff 80%)",
  padding: "14px 0",
  boxShadow: "0 2px 12px -8px #6787bb44",
  borderRadius: 18,
  margin: "18px auto 32px auto",
  maxWidth: 900,
};

const activeStyle = {
  background: "#2563eb33",
  color: "#2563eb",
  fontWeight: "bold",
  textDecoration: "none",
  boxShadow: "0 2px 8px -6px #2563eb50",
};

function App() {
  return (
    <BrowserRouter>

      {/* Logo at the top */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <img
          src="/logo.png" // place your logo image in the public folder
          alt="Logo"
          style={{ height: 80, width: "auto" }}
        />
      </div>


      <nav style={navStyle}>
        <NavLink
          to="/rules"
          style={({ isActive }) =>
            isActive ? { ...linkBaseStyle, ...activeStyle } : linkBaseStyle
          }
        >
          Rules Management
        </NavLink>
        <NavLink
          to="/transactions"
          style={({ isActive }) =>
            isActive ? { ...linkBaseStyle, ...activeStyle } : linkBaseStyle
          }
        >
          Transactions
        </NavLink>
        <NavLink
          to="/evaluate"
          style={({ isActive }) =>
            isActive ? { ...linkBaseStyle, ...activeStyle } : linkBaseStyle
          }
        >
          Evaluation
        </NavLink>
        <NavLink
          to="/results"
          style={({ isActive }) =>
            isActive ? { ...linkBaseStyle, ...activeStyle } : linkBaseStyle
          }
        >
          Results
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<RulesPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/evaluate" element={<EvaluationPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/user-transactions/:userId" element={<UserTransactionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
