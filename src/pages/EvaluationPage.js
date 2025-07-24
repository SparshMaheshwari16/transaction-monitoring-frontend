import React, { useState } from "react";
import API from "../api";

export default function EvaluationPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    async function runEvaluation() {
        setMessage("");
        setError(false);
        setLoading(true);
        try {
            const requestBody = {
                ruleIds: [],
                transactionIds: [],
                // Add more fields as needed
            };
            // Replace `/evaluate` with your actual evaluation endpoint
            await API.post("/evaluateRule/2.2", requestBody);
            setMessage("✅ Evaluation completed successfully.");
            setError(false);
        } catch (error) {
            setMessage(`❌ Error running evaluation.`);
            setError(true);
            console.error(error?.response?.data || error.message || error);
        }
        setLoading(false);
    }

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "40px auto",
                padding: 20,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: 8,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                textAlign: "center",
                backgroundColor: "#fff",
            }}
        >
            <h2 style={{ marginBottom: 20, color: "#333" }}>Rule Evaluation</h2>
            <button
                onClick={runEvaluation}
                disabled={loading}
                style={{
                    backgroundColor: loading ? "#ccc" : "#007bff",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 16,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background-color 0.3s ease",
                    boxShadow: loading ? "none" : "0 2px 6px rgba(0,123,255,0.4)",
                }}
                onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#0056b3";
                }}
                onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#007bff";
                }}
            >
                {loading ? (
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                        <svg
                            className="spinner"
                            width="20px"
                            height="20px"
                            viewBox="0 0 50 50"
                            style={{ marginRight: 8 }}
                        >
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray="31.4 31.4"
                                transform="rotate(0 25 25)"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 25 25"
                                    to="360 25 25"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </svg>
                        Running evaluation...
                    </span>
                ) : (
                    "Run Evaluation"
                )}
            </button>
            {message && (
                <p
                    style={{
                        marginTop: 20,
                        color: error ? "#d9534f" : "#28a745",
                        fontWeight: "bold",
                        fontSize: 16,
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
