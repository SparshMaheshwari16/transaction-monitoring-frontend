import React, { useState } from "react";
import API from "../api";

export default function CreateRulePage() {
    const [form, setForm] = useState({
        name: "Sample rule name",
        condition: "Sample rule condition",
        flag_level: "Low",
        risk_increment: "5",
        description: "Sample rule description"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Handle input changes
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Basic form validation
    function validate() {
        if (!form.name.trim()) return "Name is required";
        if (!form.condition.trim()) return "Condition is required";
        if (!form.flag_level.trim()) return "Flag level is required";
        if (!form.risk_increment.trim()) return "Risk increment is required";
        if (isNaN(Number(form.risk_increment)) || Number(form.risk_increment) <= 0) return "Risk increment must be a positive number";
        return "";
    }

    // Submit handler
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: form.name.trim(),
                condition: form.condition.trim(),
                flag_level: form.flag_level,
                risk_increment: form.risk_increment.trim(),
                description: form.description.trim(),
            };
            await API.post("/rules", payload);
            setSuccessMsg("Rule created successfully!");
            setForm({
                name: "",
                condition: "",
                flag_level: "Low",
                risk_increment: "",
                description: ""
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create rule");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Create New Rule</h2>

            {error && <div style={styles.error}>{error}</div>}
            {successMsg && <div style={styles.success}>{successMsg}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Name <span style={{ color: "red" }}>*</span>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loading}
                        placeholder="Enter rule name"
                        required
                    />
                </label>

                <label style={styles.label}>
                    Name <span style={{ color: "red" }}>*</span>
                    <input
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loading}
                        placeholder="Enter rule description"
                        required
                    />
                </label>

                <label style={styles.label}>
                    Condition <span style={{ color: "red" }}>*</span>
                    <textarea
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        style={{ ...styles.input, height: 80, fontFamily: 'monospace' }}
                        disabled={loading}
                        placeholder="Enter condition (e.g. t.amount &gt; 10000)"
                        required
                    />
                </label>

                <label style={styles.label}>
                    Flag Level <span style={{ color: "red" }}>*</span>
                    <select
                        name="flag_level"
                        value={form.flag_level}
                        onChange={handleChange}
                        style={styles.select}
                        disabled={loading}
                        required
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>

                <label style={styles.label}>
                    Risk Increment <span style={{ color: "red" }}>*</span>
                    <input
                        name="risk_increment"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.risk_increment}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loading}
                        placeholder="E.g. 0.30"
                        required
                    />
                </label>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Creating..." : "Create Rule"}
                </button>
            </form>
        </div>
    );
}

// Inline styles for simplicity
const styles = {
    container: {
        maxWidth: 600,
        margin: "40px auto",
        background: "#fff",
        padding: 32,
        borderRadius: 16,
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
        marginBottom: 28,
        color: "#1976d2",
        textAlign: "center",
        letterSpacing: 2,
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: 20,
        fontWeight: 600,
        color: "#274472",
        display: "flex",
        flexDirection: "column",
        fontSize: 15,
    },
    input: {
        marginTop: 8,
        padding: "10px 14px",
        fontSize: 15,
        borderRadius: 6,
        border: "1.8px solid #b0bec5",
        outline: "none",
        transition: "border-color 0.3s ease",
        fontFamily: "inherit",
    },
    select: {
        marginTop: 8,
        padding: "10px 14px",
        fontSize: 15,
        borderRadius: 6,
        border: "1.8px solid #b0bec5",
        outline: "none",
        transition: "border-color 0.3s ease",
        fontFamily: "inherit",
    },
    button: {
        marginTop: 10,
        padding: "14px 20px",
        borderRadius: 8,
        border: "none",
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    error: {
        marginBottom: 16,
        color: "#d32f2f",
        fontWeight: "600",
        textAlign: "center",
    },
    success: {
        marginBottom: 16,
        color: "#388e3c",
        fontWeight: "600",
        textAlign: "center",
    },
};
