import React, { useEffect, useState, useRef } from "react";
import API from "../api";

// Custom slider switch
function Switch({ checked, onChange }) {
    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                onClick={e => e.stopPropagation()}
            />
            <span className="slider" />
        </label>
    );
}

// Sort icon for sortable headers
function SortIcon({ active, direction }) {
    const style = {
        display: "inline-block",
        width: 14,
        height: 14,
        transition: "transform 0.3s ease",
        opacity: active ? 1 : 0.3,
        cursor: "pointer",
        marginLeft: 2,
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
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

// Animated details row
function AnimatedDetails({ show, children }) {
    const ref = useRef();
    const [maxHeight, setMaxHeight] = useState("0px");
    useEffect(() => {
        if (show && ref.current) {
            setMaxHeight(ref.current.scrollHeight + "px");
        } else {
            setMaxHeight("0px");
        }
    }, [show]);
    return (
        <tr>
            <td colSpan={6} style={{ background: "#e6f1fc", padding: 0, border: 0 }}>
                <div
                    ref={ref}
                    style={{
                        maxHeight,
                        overflow: "hidden",
                        transition: "max-height 0.56s cubic-bezier(.52,1.7,.59,.99), opacity 0.38s",
                        opacity: show ? 1 : 0,
                        padding: show ? "18px 28px" : "0 28px",
                        borderBottom: "1px solid #b3c9dd",
                    }}
                >
                    {children}
                </div>
            </td>
        </tr>
    );
}

// Chevron icon: rotates for open/closed
function Chevron({ open }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.22s",
                borderRadius: "50%",
                background: open ? "#e1ecf4" : "none",
                cursor: "pointer",
                marginLeft: 10,
                width: 28,
                height: 28,
                boxShadow: open ? "0 2px 6px -3px #6ba2ed44" : "none"
            }}
            aria-label={open ? "Collapse" : "Expand"}
            tabIndex={0} // For keyboard accessibility
        >
            <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                style={{
                    display: "block",
                    transition: "transform 0.36s cubic-bezier(.49,1.6,.52,.97), fill 0.25s",
                    transform: open ? "rotate(90deg)" : "rotate(0deg)",
                    fill: open ? "#2563eb" : "#b0b2b8",
                    filter: open ? "drop-shadow(0 2px 6px #90caf9cc)" : "none"
                }}
            >
                <polygon
                    points="7.5,6 16.5,12 7.5,18"
                    style={{
                        transition: "fill 0.3s",
                    }}
                />
            </svg>
        </span>
    );
}


export default function RulesPage() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [selectedRuleId, setSelectedRuleId] = useState(null);

    useEffect(() => {
        API.get("/rules")
            .then(res => setRules(res.data.data))
            .catch(() => setError("Failed to fetch rules"))
            .finally(() => setLoading(false));
    }, []);

    async function toggleRuleActive(id, current) {
        setRules(rules.map(r => (r.id === id ? { ...r, is_active: !current } : r)));
        try {
            await API.patch(`/rules/${id}/toggle-active`);
        } catch {
            setError("Toggle failed, reverting");
            setRules(rules.map(r => (r.id === id ? { ...r, is_active: current } : r)));
        }
    }

    function requestSort(key) {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
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
                            <th style={thStyle}></th>
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
                            <th style={thStyle}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRules().map((rule) => (
                            <React.Fragment key={rule.id}>
                                <tr
                                    style={{
                                        background: rule.is_active ? "#f6fff7" : "#fff",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setSelectedRuleId(selectedRuleId === rule.id ? null : rule.id)}
                                >
                                    <td style={{ ...tdStyle, textAlign: "center", width: 35 }}>
                                        <Chevron open={selectedRuleId === rule.id} />
                                    </td>
                                    <td style={tdStyle}>{rule.name}</td>
                                    <td style={tdStyle}>{rule.description}</td>
                                    <td style={tdStyle}>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 14px",
                                                borderRadius: 18,
                                                background: rule.flag_level === "High"
                                                    ? "#ffebee"
                                                    : rule.flag_level === "Medium"
                                                        ? "#fffde7"
                                                        : "#e3f2fd",
                                                color: rule.flag_level === "High"
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
                                            onChange={e => {
                                                toggleRuleActive(rule.id, rule.is_active);
                                                e.stopPropagation();
                                            }}
                                        />
                                    </td>
                                </tr>
                                <AnimatedDetails show={selectedRuleId === rule.id}>
                                    <div style={{ fontSize: 15.5 }}>
                                        <div><b>Condition:</b> <code>{rule.condition}</code></div>
                                        <div style={{ marginTop: 6 }}><b>Risk Increment:</b> {rule.risk_increment}</div>
                                        <div style={{ marginTop: 6 }}><b>Created At:</b> {new Date(rule.created_at).toLocaleString()}</div>
                                        <div style={{ marginTop: 6 }}><b>Updated At:</b> {new Date(rule.updated_at).toLocaleString()}</div>
                                    </div>
                                </AnimatedDetails>
                            </React.Fragment>
                        ))}
                        {!sortedRules().length && (
                            <tr>
                                <td colSpan={6} style={{ ...tdStyle, textAlign: "center" }}>
                                    No rules found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// STYLES
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
