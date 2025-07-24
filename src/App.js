import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import RulesPage from "./pages/RulesPage";
import TransactionsPage from "./pages/TransactionsPage";
import EvaluationPage from "./pages/EvaluationPage";
import ResultsPage from "./pages/ResultsPage";

const activeStyle = {
  fontWeight: "bold",
  textDecoration: "underline",
  color: "blue",
};

function App() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: 20 }}>
        <NavLink to="/rules" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Rules Management</NavLink>{" | "}
        <NavLink to="/transactions" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Transactions</NavLink>{" | "}
        <NavLink to="/evaluate" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Evaluation</NavLink>{" | "}
        <NavLink to="/results" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Results</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<RulesPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/evaluate" element={<EvaluationPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
