import React, { useEffect, useState } from "react";
import API from "../api";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchTransactions() {
        setLoading(true);
        setError("");
        try {
            const response = await API.get("/transactions");
            const txns = response.data.data || [];
            txns.sort((a, b) => new Date(b.trans_time) - new Date(a.trans_time));
            setTransactions(txns);
        } catch (error) {
            setError("Failed to fetch transactions.");
            console.error(error);
        }
        setLoading(false);
    }

    if (loading)
        return (
            <div style={{ marginTop: 48, textAlign: "center", fontSize: 24 }}>
                ⏳ Loading transactions...
            </div>
        );

    if (error)
        return (
            <div
                style={{
                    margin: "38px auto",
                    maxWidth: 500,
                    color: "#c62828",
                    background: "#ffdada",
                    border: "1px solid #f3a6a6",
                    borderRadius: 6,
                    padding: 18,
                    fontWeight: 500,
                    textAlign: "center",
                }}
            >
                {error}
            </div>
        );

    if (transactions.length === 0)
        return (
            <div style={{ marginTop: 56, textAlign: "center", fontSize: 20 }}>
                <b>No transactions found.</b>
            </div>
        );

    return (
        <div
            style={{
                maxWidth: 950,
                margin: "38px auto",
                background: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.07)",
                borderRadius: "18px",
                padding: "32px 18px",
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h2
                style={{
                    color: "#1976d2",
                    marginBottom: 28,
                    letterSpacing: 1,
                    textAlign: "center",
                }}
            >
                Transactions
            </h2>
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 15.5,
                        background: "#fafbfc",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#e1ecf4" }}>
                            <th style={thStyle}>Date & Time</th>
                            <th style={thStyle}>Amount</th>
                            <th style={thStyle}>Origination</th>
                            <th style={thStyle}>Nationality</th>
                            <th style={thStyle}>Occupation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.id} style={{ background: "#fff" }}>
                                <td style={tdStyle}>
                                    {new Date(txn.trans_time).toLocaleString()}
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 500, color: "#00897b" }}>
                                    ₹ {Number(txn.trans_amt).toLocaleString()}
                                </td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            borderRadius: 12,
                                            padding: "3px 15px",
                                            background: "#e3edfd",
                                            color: "#2962ff",
                                            fontWeight: 500,
                                            fontSize: 13,
                                        }}
                                    >
                                        {txn.origination}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            borderRadius: 12,
                                            padding: "3px 18px",
                                            background: "#ffe3e3",
                                            color: "#b71c1c",
                                            fontWeight: 500,
                                            fontSize: 13,
                                        }}
                                    >
                                        {txn.nationality}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            borderRadius: 12,
                                            padding: "3px 16px",
                                            background: "#fff9e3",
                                            color: "#b26a00",
                                            fontWeight: 500,
                                            fontSize: 13,
                                        }}
                                    >
                                        {txn.occupation}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    padding: "12px 7px",
    borderBottom: "2px solid #b3c9dd",
    color: "#274472",
    fontWeight: 600,
    background: "#e6f0ff",
    textAlign: "left",
};

const tdStyle = {
    padding: "10px 8px",
    borderBottom: "1px solid #e0e0e0",
    verticalAlign: "top",
};
