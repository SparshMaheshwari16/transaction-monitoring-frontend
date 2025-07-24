import React, { useEffect, useState } from "react";
import API from "../api";

export default function ResultsPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    async function fetchResults() {
        setLoading(true);
        try {
            // Replace `/results` with your actual results endpoint
            const res = await API.get("/results");
            setResults(res.data.data || []);
        } catch (error) {
            alert("Failed to fetch results");
            console.error(error);
        }
        setLoading(false);
    }

    if (loading) return <p>Loading evaluation results...</p>;
    if (results.length === 0) return <p>No results found.</p>;

    return (
        <div>
            <h2>Evaluation Results</h2>
            <table
                border={1}
                cellPadding={5}
                cellSpacing={0}
                style={{ width: "100%", borderCollapse: "collapse" }}
            >
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Date & Time</th>
                        <th>Failed Rules</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <tr key={result.transaction_id}>
                            <td>{result.transaction_id}</td>
                            <td>{new Date(result.trans_time).toLocaleString()}</td>
                            <td>
                                {result.failed_rules && result.failed_rules.length > 0
                                    ? result.failed_rules.map((rule) => rule.name).join(", ")
                                    : "None"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
