// src/pages/UserTransactionsPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

export default function UserTransactionsPage() {
    const { userId } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUserTransactions() {
            setLoading(true);
            setError("");
            try {
                const res = await API.get(`/users/flagged/${userId}`);
                setTransactions(res.data.data || []);
            } catch (err) {
                setError("Failed to fetch user transactions.");
            }
            setLoading(false);
        }
        fetchUserTransactions();
    }, [userId]);

    if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>⏳ Loading transactions...</div>;

    if (error) return <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>{error}</div>;

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
            <h2 style={{ color: "#1976d2", marginBottom: 24 }}>
                Flagged Transactions for User
            </h2>
            <Link to="/results" style={{ marginBottom: 20, display: "inline-block", color: "#1976d2", textDecoration: "none" }}>
                ← Back to Results
            </Link>

            {transactions.length === 0 ? (
                <p>No flagged transactions found for this user.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ background: "#e1ecf4" }}>
                            <tr>
                                {/* <th style={thStyle}>Transaction ID</th> */}
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Flag</th>
                                <th style={thStyle}>Origination</th>
                                <th style={thStyle}>Date & Time</th>
                                <th style={thStyle}>Nationality</th>
                                <th style={thStyle}>Occupation</th>
                                {/* Add other fields as you like */}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(txn => (
                                <tr key={txn.id} style={{ background: "#fff" }}>
                                    {/* <td style={tdStyle}>{txn.id}</td> */}
                                    <td style={tdStyle}>₹ {txn.trans_amt.toLocaleString()}</td>
                                    <td style={tdStyle}>{txn.flag}</td>
                                    <td style={tdStyle}>{txn.origination}</td>
                                    <td style={tdStyle}>{new Date(txn.trans_time).toLocaleString()}</td>
                                    <td style={tdStyle}>{txn.nationality}</td>
                                    <td style={tdStyle}>{txn.occupation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const thStyle = {
    padding: "12px 10px",
    fontWeight: "600",
    borderBottom: "2px solid #b3c9dd",
    textAlign: "left",
    color: "#274472",
};

const tdStyle = {
    padding: "10px 8px",
    borderBottom: "1px solid #e0e0e0",
};
