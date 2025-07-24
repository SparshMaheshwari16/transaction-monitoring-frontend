import React, { useEffect, useState } from "react";
import API from "../api";

export default function RulesPage() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/rules")
            .then(res => setRules(res.data.data))
            .catch(() => alert("Failed to fetch rules"))
            .finally(() => setLoading(false));
    }, []);

    async function toggleRuleActive(id, current) {
        setRules(rules.map(r => r.id === id ? { ...r, is_active: !current } : r));
        try {
            await API.patch(`/rules/${id}/toggle-active`);
        } catch {
            alert("Toggle failed, reverting");
            setRules(rules.map(r => r.id === id ? { ...r, is_active: current } : r));
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Rules Management</h2>
            <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr><th>Name</th><th>Description</th><th>Flag Level</th><th>Active</th><th>Toggle</th></tr>
                </thead>
                <tbody>
                    {rules.map(rule => (
                        <tr key={rule.id}>
                            <td>{rule.name}</td>
                            <td>{rule.description}</td>
                            <td>{rule.flag_level}</td>
                            <td style={{ textAlign: "center" }}>{rule.is_active ? "Yes" : "No"}</td>
                            <td style={{ textAlign: "center" }}>
                                <input type="checkbox" checked={rule.is_active} onChange={() => toggleRuleActive(rule.id, rule.is_active)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
