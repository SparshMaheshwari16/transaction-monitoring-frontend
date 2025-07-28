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
        <div style={styles.container}>
            <h2 style={styles.heading}>Rule Evaluation</h2>

            <button
                onClick={runEvaluation}
                disabled={loading}
                style={{
                    ...styles.button,
                    backgroundColor: loading ? "#6c757d" : "#007bff",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 4px 10px rgba(0,123,255,0.45)",
                }}
                onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#0056b3";
                }}
                onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#007bff";
                }}
            >
                {loading ? (
                    <span style={styles.loadingContent}>
                        <svg
                            className="spinner"
                            width="20px"
                            height="20px"
                            viewBox="0 0 50 50"
                            style={{ marginRight: 10 }}
                            aria-label="loading spinner"
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
                        ...styles.message,
                        color: error ? "#d9534f" : "#28a745",
                        backgroundColor: error ? "#f8d7da" : "#d4edda",
                        borderColor: error ? "#f5c2c7" : "#c3e6cb",
                    }}
                    role="alert"
                >
                    {message}
                </p>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 440,
        margin: "60px auto",
        padding: 30,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow:
            "0 8px 16px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.08)",
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        textAlign: "center",
    },
    heading: {
        marginBottom: 28,
        color: "#2c3e50",
        fontWeight: "600",
        fontSize: "1.9rem",
        letterSpacing: "0.07em",
    },
    button: {
        border: "none",
        borderRadius: 6,
        color: "#fff",
        fontSize: 17,
        padding: "14px 36px",
        fontWeight: "600",
        userSelect: "none",
        transition: "background-color 0.25s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContent: {
        display: "inline-flex",
        alignItems: "center",
    },
    message: {
        marginTop: 32,
        fontWeight: 600,
        padding: "14px 20px",
        borderRadius: 6,
        border: "1.8px solid",
        userSelect: "none",
        fontSize: 16,
    },
};
