import React, { useEffect, useState } from "react";
import API from "../api";

// Custom slider switch component
function Switch({ checked, onChange }) {
    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <span className="slider" />
        </label>
    );
}


export default function RulesPage() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        API.get("/rules")
            .then(res => setRules(res.data.data))
            .catch(() => setError("Failed to fetch rules"))
            .finally(() => setLoading(false));
    }, []);

    async function toggleRuleActive(id, current) {
        setRules(rules.map(r => r.id === id ? { ...r, is_active: !current } : r));
        try {
            await API.patch(`/rules/${id}/toggle-active`);
        } catch {
            setError("Toggle failed, reverting");
            setRules(rules.map(r => r.id === id ? { ...r, is_active: current } : r));
        }
    }

    if (loading) {
        return (
            <div style={{ marginTop: 56, textAlign: "center", fontSize: 24 }}>⏳ Loading rules...</div>
        );
    }

    return (
        <div
            style={{
                maxWidth: 900,
                margin: "40px auto",
                background: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,.07)",
                borderRadius: "18px",
                padding: 32,
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
            }}
        >
            <h2 style={{ color: "#1976d2", marginBottom: 24, letterSpacing: 2, textAlign: "center" }}>
                Rules Management
            </h2>
            {error && (
                <div style={{
                    color: "#c62828",
                    background: "#ffdada",
                    border: "1px solid #f3a6a6",
                    borderRadius: 6,
                    padding: 12,
                    marginBottom: 20,
                    textAlign: "center",
                    fontWeight: 500,
                }}>
                    {error}
                </div>
            )}
            <div style={{ overflowX: "auto" }}>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 16,
                    background: "#fafbfc"
                }}>
                    <thead>
                        <tr style={{ background: "#e1ecf4" }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Description</th>
                            <th style={thStyle}>Flag Level</th>
                            <th style={thStyle}>Active</th>
                            <th style={thStyle}>Toggle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map(rule => (
                            <tr key={rule.id} style={{ background: rule.is_active ? "#f6fff7" : "#fff" }}>
                                <td style={tdStyle}>{rule.name}</td>
                                <td style={tdStyle}>{rule.description}</td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            padding: "4px 14px",
                                            borderRadius: 18,
                                            background:
                                                rule.flag_level === "High"
                                                    ? "#ffebee"
                                                    : rule.flag_level === "Medium"
                                                        ? "#fffde7"
                                                        : "#e3f2fd",
                                            color:
                                                rule.flag_level === "High"
                                                    ? "#c62828"
                                                    : rule.flag_level === "Medium"
                                                        ? "#b26a00"
                                                        : "#1976d2",
                                            fontWeight: "bold",
                                            fontSize: 13,
                                        }}
                                    >
                                        {rule.flag_level}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            background: rule.is_active ? "#e8f5e9" : "#eeeeee",
                                            color: rule.is_active ? "#388e3c" : "#888",
                                            padding: "4px 16px",
                                            borderRadius: "14px",
                                            fontWeight: 600,
                                            minWidth: 56,
                                        }}
                                    >
                                        {rule.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <Switch
                                        checked={rule.is_active}
                                        onChange={() => toggleRuleActive(rule.id, rule.is_active)}
                                    />

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
    padding: "12px 10px",
    borderBottom: "2px solid #b3c9dd",
    color: "#274472",
    fontWeight: 600,
    background: "#e6f0ff",
    textAlign: "left"
};

const tdStyle = {
    padding: "10px 8px",
    borderBottom: "1px solid #e0e0e0",
    verticalAlign: "top"
};
