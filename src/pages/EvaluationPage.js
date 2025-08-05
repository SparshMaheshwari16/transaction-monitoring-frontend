import React, { useState } from "react";
import API from "../api";

export default function EvaluationPage() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const nameLower = selectedFile.name.toLowerCase();
            if (
                !nameLower.endsWith(".csv") ||
                (selectedFile.type && selectedFile.type !== "text/csv" && selectedFile.type !== "application/vnd.ms-excel" && selectedFile.type !== "")
            ) {
                setFile(null);
                setError(true);
                setMessage("❌ Only CSV files are allowed.");
                return;
            }
            setFile(selectedFile);
            setError(false);
            setMessage("");
        }
    }

    async function handleFileUpload(e) {
        e.preventDefault();
        if (!file) {
            setMessage("❌ Please select a CSV file to upload.");
            setError(true);
            return;
        }
        setUploading(true);
        setError(false);
        setMessage("");
        try {
            const formData = new FormData();
            formData.append("csvFile", file);
            await API.post("/upload/transaction", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage("✅ File uploaded successfully.");
            setError(false);
            setFile(null);
            e.target.reset && e.target.reset();
        } catch (error) {
            setMessage("❌ Error uploading file.");
            setError(true);
            console.log(`here`);
            console.error(error?.response?.data || error.message || error);
        }
        setUploading(false);
    }

    async function runEvaluation() {
        setMessage("");
        setError(false);
        setLoading(true);
        try {
            const requestBody = {
                ruleIds: [],
                transactionIds: [],
            };
            await API.post("/evaluateRule/2.2", requestBody);
            setMessage("✅ Evaluation completed successfully.");
            setError(false);
        } catch (error) {
            setMessage("❌ Error running evaluation.");
            setError(true);
            console.error(error?.response?.data || error.message || error);
        }
        setLoading(false);
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Rule Evaluation</h2>

            {/* Upload CSV Box */}
            <div style={styles.card}>
                <form onSubmit={handleFileUpload} style={styles.uploadForm}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={styles.fileInput}
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        style={{
                            ...styles.button,
                            backgroundColor: uploading ? "#6c757d" : "#007bff",
                            cursor: uploading ? "not-allowed" : "pointer",
                            boxShadow: uploading ? "none" : "0 4px 10px rgba(0,123,255,0.45)",
                        }}
                    >
                        {uploading ? "Uploading..." : "Upload transactions CSV"}
                    </button>
                </form>
            </div>

            {/* Run Evaluation Box */}
            <div style={styles.card}>
                <button
                    onClick={runEvaluation}
                    disabled={loading}
                    style={{
                        ...styles.button,
                        backgroundColor: loading ? "#6c757d" : "#007bff",
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: loading ? "none" : "0 4px 10px rgba(0,123,255,0.45)",
                    }}
                    onMouseOver={e => {
                        if (!loading) e.currentTarget.style.backgroundColor = "#0056b3";
                    }}
                    onMouseOut={e => {
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
            </div>

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
        maxWidth: 420,
        margin: "60px auto",
        padding: 0,
        backgroundColor: "#fff",
        borderRadius: 12,
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
    card: {
        backgroundColor: "#f8f9fb",
        borderRadius: 10,
        padding: "28px 24px",
        boxShadow: "0 2px 12px rgba(80,140,255,0.04)",
        marginBottom: 24,
        border: "1px solid #e0e5ee"
    },
    uploadForm: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
    },
    fileInput: {
        padding: "9px 0px",
        fontSize: 15,
        borderRadius: 6,
        border: "1px solid #ccd6e4",
        width: "100%",
        maxWidth: 210,
        background: "#fff",
    },
    button: {
        border: "none",
        borderRadius: 6,
        color: "#fff",
        fontSize: 17,
        padding: "13px 34px",
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
        margin: "24px auto 0 auto",
        fontWeight: 600,
        padding: "14px 20px",
        borderRadius: 6,
        border: "1.8px solid",
        userSelect: "none",
        fontSize: 16,
        maxWidth: 400,
        textAlign: "center"
    },
};
