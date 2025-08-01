import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

export default function UserTransactionsPage() {
    const { userId } = useParams();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tracks which transaction row is expanded
    const [expandedTxnId, setExpandedTxnId] = useState(null);

    // Cache rule details by rule ID to avoid repeated requests
    const [ruleDetailsCache, setRuleDetailsCache] = useState({});

    useEffect(() => {
        async function fetchUserTransactions() {
            setLoading(true);
            setError("");
            try {
                // Fetch flagged transactions for user
                const res = await API.get(`/users/flagged/${userId}`);
                setTransactions(res.data.data || []);
            } catch (err) {
                setError("Failed to fetch user transactions.");
            }
            setLoading(false);
        }
        fetchUserTransactions();
    }, [userId]);

    // Fetch and cache rule details by rule ID
    async function fetchRuleDetails(ruleId) {
        if (!ruleId || ruleDetailsCache[ruleId]) return; // Already cached or no ruleId
        try {
            const res = await API.get(`/rules/${ruleId}`);
            setRuleDetailsCache(prev => ({
                ...prev,
                [ruleId]: res.data.data || null,
            }));
        } catch {
            setRuleDetailsCache(prev => ({
                ...prev,
                [ruleId]: null,
            }));
        }
    }

    // Toggle transaction details expansion and fetch rule details on demand
    async function handleRowClick(txn) {
        if (expandedTxnId === txn.id) {
            setExpandedTxnId(null); // Collapse if same clicked again
            return;
        }
        setExpandedTxnId(txn.id);
        if (txn.flagged_by_rule) {
            await fetchRuleDetails(txn.flagged_by_rule);
        }
    }

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: 40 }}>⏳ Loading transactions...</div>;
    }

    if (error) {
        return <div style={{ color: "red", marginTop: 40, textAlign: "center" }}>{error}</div>;
    }

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <h2 style={{ color: "#1976d2", marginBottom: 24, textAlign: "center" }}>
                Flagged Transactions for User
            </h2>
            <Link to="/results" style={{ color: "#1976d2", textDecoration: "none", marginBottom: 20, display: "inline-block" }}>
                ← Back to Results
            </Link>

            {transactions.length === 0 ? (
                <p>No flagged transactions found for this user.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ background: "#e1ecf4" }}>
                            <tr>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Flag</th>
                                <th style={thStyle}>Origination</th>
                                <th style={thStyle}>Date & Time</th>
                                {/* <th style={thStyle}>Nationality</th> */}
                                {/* <th style={thStyle}>Occupation</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(txn => (
                                <React.Fragment key={txn.id}>
                                    <tr
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: expandedTxnId === txn.id ? "#f0f6ff" : "#fff",
                                            transition: "background-color 0.3s",
                                        }}
                                        onClick={() => handleRowClick(txn)}
                                        title="Click to see rule details"
                                    >
                                        <td style={tdStyle}>₹ {txn.trans_amt?.toLocaleString()}</td>
                                        <td style={tdStyle}>{txn.flag}</td>
                                        <td style={tdStyle}>{txn.origination}</td>
                                        <td style={tdStyle}>{txn.trans_time ? new Date(txn.trans_time).toLocaleString() : "-"}</td>
                                        {/* <td style={tdStyle}>{txn.nationality}</td> */}
                                        {/* <td style={tdStyle}>{txn.occupation}</td> */}
                                    </tr>

                                    {/* Expanded Rule Details Row */}
                                    {expandedTxnId === txn.id && (
                                        <tr>
                                            <td colSpan={6} style={{ backgroundColor: "#eef6ff", padding: 20, borderTop: "1px solid #aaa", fontSize: 14 }}>
                                                {ruleDetailsCache[txn.flagged_by_rule] === undefined && <em>Loading rule details...</em>}
                                                {ruleDetailsCache[txn.flagged_by_rule] === null && <span style={{ color: "red" }}>Failed to load rule details.</span>}
                                                {ruleDetailsCache[txn.flagged_by_rule] && (
                                                    <div>
                                                        <h4 style={{ marginTop: 0, marginBottom: 8, color: "#1976d2" }}>
                                                            {ruleDetailsCache[txn.flagged_by_rule].name || "Rule Details"}
                                                        </h4>
                                                        <p><b>Description:</b> {ruleDetailsCache[txn.flagged_by_rule].description || "N/A"}</p>
                                                        <p><b>Condition:</b> <code>{ruleDetailsCache[txn.flagged_by_rule].condition || "N/A"}</code></p>
                                                        <p><b>Flag Level:</b> {ruleDetailsCache[txn.flagged_by_rule].flag_level || "N/A"}</p>
                                                        <p><b>Risk Increment:</b> {ruleDetailsCache[txn.flagged_by_rule].risk_increment || "N/A"}</p>
                                                        <p><b>Active:</b> {ruleDetailsCache[txn.flagged_by_rule].is_active ? "Yes" : "No"}</p>
                                                        <p><b>Created At:</b> {ruleDetailsCache[txn.flagged_by_rule].created_at ? new Date(ruleDetailsCache[txn.flagged_by_rule].created_at).toLocaleString() : "N/A"}</p>
                                                        <p><b>Updated At:</b> {ruleDetailsCache[txn.flagged_by_rule].updated_at ? new Date(ruleDetailsCache[txn.flagged_by_rule].updated_at).toLocaleString() : "N/A"}</p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
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
    borderBottom: "2px solid #aaa",
    textAlign: "left",
    backgroundColor: "#dce6fa",
    color: "#1f487e",
};

const tdStyle = {
    padding: "10px 8px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "top",
};
