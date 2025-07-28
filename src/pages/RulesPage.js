import React, { useEffect, useState } from "react";
import API from "../api";

// Custom slider switch component
function Switch({ checked, onChange }) {
    return (
        <label className="switch">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider" />
        </label>
    );
}

function SortIcon({ active, direction }) {
    const style = {
        display: "inline-block",
        width: 14,
        height: 14,
        transition: "transform 0.3s ease",
        opacity: active ? 1 : 0.3,
        cursor: "pointer",
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "#1976d2" : "#888"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                ...style,
                transform: direction === "asc" ? "rotate(0deg)" : "rotate(180deg)",
            }}
        >
            {/* Up/down arrows for sort */}
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

export default function RulesPage() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    useEffect(() => {
        API.get("/rules")
            .then((res) => setRules(res.data.data))
            .catch(() => setError("Failed to fetch rules"))
            .finally(() => setLoading(false));
    }, []);

    async function toggleRuleActive(id, current) {
        setRules(rules.map((r) => (r.id === id ? { ...r, is_active: !current } : r)));
        try {
            await API.patch(`/rules/${id}/toggle-active`);
        } catch {
            setError("Toggle failed, reverting");
            setRules(rules.map((r) => (r.id === id ? { ...r, is_active: current } : r)));
        }
    }

    function requestSort(key) {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    }

    function renderSortIcon(column) {
        if (sortConfig.key !== column) {
            return " ↕";
        }
        return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }

    function sortedRules() {
        let sortableRules = [...rules];
        if (sortConfig.key) {
            sortableRules.sort((a, b) => {
                let aVal, bVal;

                if (sortConfig.key === "flag_level") {
                    const order = { High: 3, Medium: 2, Low: 1 };
                    aVal = order[a.flag_level] || 0;
                    bVal = order[b.flag_level] || 0;
                } else if (sortConfig.key === "is_active") {
                    aVal = a.is_active ? 1 : 0;
                    bVal = b.is_active ? 1 : 0;
                }

                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableRules;
    }

    if (loading) {
        return (
            <div style={{ marginTop: 56, textAlign: "center", fontSize: 24 }}>
                ⏳ Loading rules...
            </div>
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
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h2
                style={{
                    color: "#1976d2",
                    marginBottom: 24,
                    letterSpacing: 2,
                    textAlign: "center",
                }}
            >
                Rules Management
            </h2>
            {error && (
                <div
                    style={{
                        color: "#c62828",
                        background: "#ffdada",
                        border: "1px solid #f3a6a6",
                        borderRadius: 6,
                        padding: 12,
                        marginBottom: 20,
                        textAlign: "center",
                        fontWeight: 500,
                    }}
                >
                    {error}
                </div>
            )}
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 16,
                        background: "#fafbfc",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#e1ecf4" }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Description</th>
                            <th
                                style={{ ...thStyle, cursor: "pointer", userSelect: "none", paddingRight: 12 }}
                                onClick={() => requestSort("flag_level")}
                            >
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <span>Flag Level</span>
                                    <SortIcon active={sortConfig.key === "flag_level"} direction={sortConfig.direction} />
                                </div>
                            </th>



                            <th
                                style={{ ...thStyle, cursor: "pointer", userSelect: "none", paddingRight: 12 }}
                                onClick={() => requestSort("is_active")}
                            >
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <span>Active</span>
                                    <SortIcon active={sortConfig.key === "is_active"} direction={sortConfig.direction} />
                                </div>
                            </th>

                            <th style={thStyle}>Toggle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRules().map((rule) => (
                            <tr
                                key={rule.id}
                                style={{ background: rule.is_active ? "#f6fff7" : "#fff" }}
                            >
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
    textAlign: "left",
};

const tdStyle = {
    padding: "10px 8px",
    borderBottom: "1px solid #e0e0e0",
    verticalAlign: "top",
};
