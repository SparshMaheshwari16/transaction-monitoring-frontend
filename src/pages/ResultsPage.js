import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import SearchInput from "../components/SearchInput";

function SortArrow({ active, direction }) {
    return (
        <span
            style={{
                marginLeft: 4,
                opacity: active ? 1 : 0.4,
                display: "inline-block",
                transition: "transform 0.2s",
                transform: direction === "desc" ? "rotate(180deg)" : "none",
                color: active ? "#1976d2" : "#999",
                fontSize: 16,
            }}
        >
            ▲
        </span>
    );
}

export default function ResultsPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const navigate = useNavigate();

    // Navigate to user's transaction details page
    function handleUserClick(userId) {
        navigate(`/user-transactions/${userId}`);
    }

    useEffect(() => {
        fetchResults();
        // eslint-disable-next-line
    }, []);

    async function fetchResults() {
        setError("");
        setLoading(true);
        try {
            const res = await API.get("/evaluateRule/result");
            // Make sure each item has an 'id' or 'user_id'; adjust below accordingly
            // Example: we add id = user_id if exists, else fallback false
            const dataWithId = (res.data?.data || []).map(item => ({
                id: item.user_id ?? item.id ?? null,
                username: item.username ?? "Unknown",
                flag: item.flag ?? "Unknown",
                transaction_count: Number(item.transaction_count) || 0,
            })).filter(item => item.id !== null); // Filter out entries without id
            setResults(dataWithId);
        } catch (err) {
            setError("Failed to fetch results.");
        }
        setLoading(false);
    }

    // Aggregate data by user id and username
    function summarizeResults(data) {
        const userMap = {};
        data.forEach(({ id, username, flag, transaction_count }) => {
            if (!userMap[id]) {
                userMap[id] = {
                    id,
                    username,
                    total: 0,
                    Low: 0,
                    Medium: 0,
                    High: 0,
                };
            }
            userMap[id].total += transaction_count;
            if (flag in userMap[id]) {
                userMap[id][flag] += transaction_count;
            }
        });
        return Object.values(userMap);
    }

    const userSummaries = summarizeResults(results).filter(user =>
        user.username.toLowerCase().includes(filter.trim().toLowerCase())
    );

    const flagOrder = ["Low", "Medium", "High"];

    function requestSort(key) {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    }

    function sortedRows(rows) {
        if (!sortConfig.key) return rows;
        return [...rows].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];
            if (typeof aVal === "string") {
                return sortConfig.direction === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            aVal = aVal || 0;
            bVal = bVal || 0;
            return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        });
    }

    function flagBadge(level, count) {
        const base = {
            display: "inline-block",
            minWidth: 34,
            borderRadius: 13,
            padding: "4px 13px",
            fontWeight: "bold",
            fontSize: 14,
            marginLeft: 7,
            letterSpacing: 1,
        };
        const palette = {
            Low: { color: "#118c26", background: "#e8f5e9" },
            Medium: { color: "#b26a00", background: "#fff8e1" },
            High: { color: "#c62828", background: "#ffebee" },
        };
        return (
            <span style={{ ...base, ...palette[level] }}>
                {level}({count})
            </span>
        );
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
                    border: "1px solid #f3a6a",
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

    return (
        <div
            style={{
                maxWidth: 800,
                margin: "40px auto",
                background: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                borderRadius: 18,
                padding: "32px 18px",
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h2
                style={{
                    color: "#1976d2",
                    marginBottom: 28,
                    letterSpacing: 1,
                    textAlign: "center",
                }}
            >
                Evaluation Results
            </h2>

            <SearchInput
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                onClear={() => setFilter("")}
            />

            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 15.5,
                        background: "#fafcfc",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#e1ecf4" }}>
                            <th
                                style={thStyle}
                                onClick={() => requestSort("username")}
                                className="sortable"
                            >
                                <span style={{ cursor: "pointer" }}>
                                    Username
                                    <SortArrow
                                        active={sortConfig.key === "username"}
                                        direction={sortConfig.direction}
                                    />
                                </span>
                            </th>
                            <th
                                style={thStyle}
                                onClick={() => requestSort("total")}
                                className="sortable"
                            >
                                <span style={{ cursor: "pointer" }}>
                                    Total Transactions
                                    <SortArrow
                                        active={sortConfig.key === "total"}
                                        direction={sortConfig.direction}
                                    />
                                </span>
                            </th>
                            {flagOrder.map((flag) => (
                                <th
                                    key={flag}
                                    style={thStyle}
                                    onClick={() => requestSort(flag)}
                                    className="sortable"
                                >
                                    <span style={{ cursor: "pointer" }}>
                                        {flag}
                                        <SortArrow
                                            active={sortConfig.key === flag}
                                            direction={sortConfig.direction}
                                        />
                                    </span>
                                </th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRows(userSummaries).length === 0 && (
                            <tr>
                                <td
                                    colSpan={2 + flagOrder.length}
                                    style={{ ...tdStyle, textAlign: "center" }}
                                >
                                    No results found.
                                </td>
                            </tr>
                        )}
                        {sortedRows(userSummaries).map((user) => (
                            <tr
                                key={user.id ?? user.username}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleUserClick(user.id)}
                            >
                                <td style={tdStyle}>{user.username}</td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            background: "#e3edfd",
                                            borderRadius: 10,
                                            padding: "3px 14px",
                                            fontSize: 15,
                                            fontWeight: 500,
                                            color: "#1976d2",
                                        }}
                                    >
                                        {user.total}
                                    </span>
                                </td>
                                {flagOrder.map((flag) => (
                                    <td key={flag} style={tdStyle}>
                                        {flagBadge(flag, user[flag] ?? 0)}
                                    </td>
                                ))}
                                <td style={tdStyle} />
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
    borderBottom: "2px solid #b6cbd9",
    color: "#274472",
    fontWeight: 600,
    background: "#e1ebf8",
    textAlign: "left",
};

const tdStyle = {
    padding: "10px 11px",
    borderBottom: "1px solid #dce1eb",
    verticalAlign: "top",
};
