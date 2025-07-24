// src/pages/TransactionsPage.js
import React, { useEffect, useState } from "react";
import API from "../api";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    async function fetchTransactions() {
        setLoading(true);
        try {
            const response = await API.get("/transactions");
            // Assuming API returns a `data` array under response.data.data
            const txns = response.data.data || [];
            // Sort transactions by transaction time descending
            txns.sort((a, b) => new Date(b.trans_time) - new Date(a.trans_time));
            setTransactions(txns);
        } catch (error) {
            alert("Failed to fetch transactions");
            console.error(error);
        }
        setLoading(false);
    }

    if (loading) return <p>Loading transactions...</p>;
    if (transactions.length === 0) return <p>No transactions found.</p>;

    return (
        <div>
            <h2>Transactions</h2>
            <table
                border={1}
                cellPadding={5}
                cellSpacing={0}
                style={{ width: "100%", borderCollapse: "collapse" }}
            >
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Amount</th>
                        <th>Origination</th>
                        <th>Nationality</th>
                        <th>Occupation</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn) => (
                        <tr key={txn.id}>
                            <td>{new Date(txn.trans_time).toLocaleString()}</td>
                            <td>{txn.trans_amt}</td>
                            <td>{txn.origination}</td>
                            <td>{txn.nationality}</td>
                            <td>{txn.occupation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
