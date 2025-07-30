import React, { useEffect, useState } from "react";
import API from "../api";

export default function ResultsPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchResults();
        // eslint-disable-next-line
    }, []);

    async function fetchResults() {
        setError("");
        setLoading(true);
        try {
            const res = await API.get("/evaluateRule/result");
            setResults(res.data.data || []);
        } catch (err) {
            setError("Failed to fetch results.");
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div style={{ marginTop: 56, textAlign: "center", fontSize: 22 }}>
                ⏳ Loading results...
            </div>
        );
    }

    if (error) {
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
    }

    if (results.length === 0) {
        return (
            <div style={{ marginTop: 56, textAlign: "center", fontSize: 20 }}>
                <b>No evaluation results found.</b>
            </div>
        );
    }

    // Helper to get the badge style for each flag value
    function flagBadgeStyle(flag) {
        if (flag === "High") {
            return {
                color: "#c62828",
                background: "#ffebee",
            };
        } else if (flag === "Medium") {
            return {
                color: "#b26a00",
                background: "#fff8e1",
            };
        } else {
            // Low
            return {
                color: "#118c26",
                background: "#e8f5e9",
            };
        }
    }

    return (
        <div
            style={{
                maxWidth: 600,
                margin: "40px auto",
                background: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                borderRadius: "18px",
                padding: "32px 18px",
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
            }}
        >
            <h2
                style={{
                    color: "#1976d2",
                    marginBottom: 28,
                    letterSpacing: 1,
                    textAlign: "center"
                }}
            >
                Evaluation Results
            </h2>
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 15.5,
                        background: "#fafbfc"
                    }}
                >
                    <thead>
                        <tr style={{ background: "#e1ecf4" }}>
                            <th style={thStyle}>Username</th>
                            <th style={thStyle}>Flag</th>
                            <th style={thStyle}>Transaction Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, idx) => (
                            <tr key={idx} style={{ background: "#fff" }}>
                                <td style={tdStyle}>{result.username}</td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            padding: "4px 18px",
                                            borderRadius: 16,
                                            fontWeight: "bold",
                                            fontSize: 14,
                                            letterSpacing: 1,
                                            ...flagBadgeStyle(result.flag)
                                        }}
                                    >
                                        {result.flag}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            background: "#e3edfd",
                                            borderRadius: 10,
                                            padding: "3px 11px",
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: "#1976d2",
                                        }}
                                    >
                                        {result.transaction_count}
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
    padding: "12px 14px",
    borderBottom: "2px solid #b3c9dd",
    color: "#274472",
    fontWeight: 600,
    background: "#e6f0ff",
    textAlign: "left"
};

const tdStyle = {
    padding: "10px 11px",
    borderBottom: "1px solid #e0e0e0",
    verticalAlign: "top"
};
