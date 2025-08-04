import React, { useState } from "react";

const TRANSACTION_FIELDS = [
    { label: "Age", value: "age", type: "number" },
    { label: "Transaction Amount", value: "trans_amt", type: "number" },
    { label: "Is New Transaction", value: "new_trans", type: "boolean" },
    { label: "Sex", value: "sex", type: "string" },
    { label: "Nationality", value: "nationality", type: "string" },
    { label: "Occupation", value: "occupation", type: "string" },
    { label: "Balance", value: "balance", type: "number" },
    { label: "Origination", value: "origination", type: "string" },
    { label: "Cross Border", value: "cross_border", type: "boolean" },
    { label: "Transaction Time", value: "trans_time", type: "string" },
    { label: "PEP Status", value: "pep_status", type: "boolean" }
];

const SUMMARY_FIELDS = [
    { label: "Sum Amount 15d", value: "sum_trans_amount_15d", type: "number" },
    { label: "Sum Amount 30d", value: "sum_trans_amount_30d", type: "number" },
    { label: "Sum Amount 60d", value: "sum_trans_amount_60d", type: "number" },
    { label: "Sum Amount 90d", value: "sum_trans_amount_90d", type: "number" },
    { label: "Avg Amount 15d", value: "avg_trans_amount_15d", type: "number" },
    { label: "Avg Amount 30d", value: "avg_trans_amount_30d", type: "number" },
    { label: "Avg Amount 60d", value: "avg_trans_amount_60d", type: "number" },
    { label: "Avg Amount 90d", value: "avg_trans_amount_90d", type: "number" },
    { label: "Transaction Count 15d", value: "trans_count_15d", type: "number" },
    { label: "Transaction Count 30d", value: "trans_count_30d", type: "number" },
    { label: "Transaction Count 60d", value: "trans_count_60d", type: "number" },
    { label: "Transaction Count 90d", value: "trans_count_90d", type: "number" },
    { label: "High Value Count 90d", value: "high_value_trans_count_90d", type: "number" },
    { label: "Crypto Ratio 30d", value: "crypto_trans_ratio_30d", type: "number" },
    { label: "Night Ratio 30d", value: "night_trans_ratio_30d", type: "number" },
    { label: "Weekday Ratio", value: "weekday_trans_ratio", type: "number" },
    { label: "Avg Gap Between Trans", value: "avg_gap_between_trans", type: "number" },
    { label: "Days Since Last Trans", value: "days_since_last_trans", type: "number" },
    { label: "Burst Trans Count 24h", value: "burst_trans_count_24h", type: "number" },
    { label: "KYC Age Days", value: "kyc_age_days", type: "number" },
    { label: "Large Trans Change Ratio", value: "large_trans_change_ratio", type: "number" },
    { label: "Geo Diversity Score", value: "geo_diversity_score", type: "number" },
    { label: "Flagged Trans Ratio 30d", value: "flagged_trans_ratio_30d", type: "number" },
    { label: "Trans Below Threshold 7d", value: "trans_below_threshold_7d", type: "number" }
];

const OPERATORS = [
    { label: "=", value: "=" },
    { label: ">=", value: ">=" },
    { label: "<=", value: "<=" },
    { label: ">", value: ">" },
    { label: "<", value: "<" },
    { label: "!=", value: "!=" }
];

function getPrefix(group) {
    return group === "Transaction" ? "t." : "uts.";
}

function getFieldList(group) {
    return group === "Transaction" ? TRANSACTION_FIELDS : SUMMARY_FIELDS;
}

export default function ConditionBuilder({ onConditionChange }) {
    const [conditions, setConditions] = useState([
        { group: "Transaction", field: "age", op: "=", value: "" }
    ]);

    // Update a condition
    function update(index, key, val) {
        const newConditions = conditions.map((c, i) =>
            i === index ? { ...c, [key]: val } : c
        );
        setConditions(newConditions);
        propagate(newConditions);
    }

    // Add a new condition
    function addCondition() {
        setConditions([
            ...conditions,
            { group: "Transaction", field: "age", op: "=", value: "" }
        ]);
    }

    // Remove a condition
    function removeCondition(index) {
        const newConditions = conditions.filter((_, i) => i !== index);
        setConditions(newConditions.length ? newConditions : [
            { group: "Transaction", field: "age", op: "=", value: "" }
        ]);
        propagate(newConditions.length ? newConditions : [
            { group: "Transaction", field: "age", op: "=", value: "" }
        ]);
    }

    // Compose the SQL WHERE-like string
    function toQuery(cond) {
        const prefix = getPrefix(cond.group);
        const fields = getFieldList(cond.group);
        const fieldMeta = fields.find((f) => f.value === cond.field);
        let val = cond.value;

        // For booleans convert value to TRUE/FALSE
        if (fieldMeta?.type === "boolean") {
            if (val === true || val === "true" || val === "True" || val === 1 || val === "1") val = "TRUE";
            else if (val === false || val === "false" || val === "False" || val === 0 || val === "0") val = "FALSE";
        } else if (fieldMeta?.type === "string") {
            val = `'${val}'`;
        }

        return `${prefix}${cond.field} ${cond.op} ${val}`;
    }

    // Inform parent whenever SQL string changes
    function propagate(conditionsToUse = conditions) {
        const sql = conditionsToUse.map(c => toQuery(c)).join(" AND ");
        if (onConditionChange) onConditionChange(sql);
    }

    // Build out the form
    return (
        <div style={{ margin: "18px 0 36px 0", background: "#f5faff", borderRadius: 8, padding: "18px 12px" }}>
            <b>Rule Condition Builder</b>
            <br />
            <br />
            {conditions.map((cond, idx) => {
                const fields = getFieldList(cond.group);
                const selectedField = fields.find((f) => f.value === cond.field) || fields[0];
                return (
                    <div key={idx} style={{ marginBottom: 16, display: "flex", gap: 9, alignItems: "center" }}>
                        <select
                            value={cond.group}
                            onChange={e => update(idx, "group", e.target.value)}
                            style={cbSelectStyle}
                        >
                            <option>Transaction</option>
                            <option>User Summary</option>
                        </select>
                        <select
                            value={cond.field}
                            onChange={e => update(idx, "field", e.target.value)}
                            style={cbSelectStyle}
                        >
                            {fields.map(f => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                        <select
                            value={cond.op}
                            onChange={e => update(idx, "op", e.target.value)}
                            style={cbSelectStyle}
                        >
                            {OPERATORS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        {/* Input type dynamic */}
                        {selectedField.type === "boolean" ? (
                            <select
                                value={cond.value}
                                onChange={e => update(idx, "value", e.target.value)}
                                style={cbSelectStyle}
                            >
                                <option value="TRUE">TRUE</option>
                                <option value="FALSE">FALSE</option>
                            </select>
                        ) : (
                            <input
                                value={cond.value}
                                onChange={e => update(idx, "value", e.target.value)}
                                style={cbInputStyle}
                                type={selectedField.type === "number" ? "number" : "text"}
                                placeholder={selectedField.type === "number" ? "Value" : "Text"}
                            />
                        )}

                        {conditions.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeCondition(idx)}
                                style={{
                                    background: "#ffeced",
                                    border: "none",
                                    borderRadius: "50%",
                                    color: "#c62828",
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    width: 32,
                                    height: 32,
                                    cursor: "pointer"
                                }}
                                title="Remove condition"
                            >×</button>
                        )}
                    </div>
                );
            })}
            <button
                type="button"
                style={cbAddBtnStyle}
                onClick={addCondition}
            >+ Add Condition</button>

            {/* Preview the generated SQL */}
            <div style={{ marginTop: 18, padding: "13px 19px", background: "#f7f9fc", borderRadius: 8, fontFamily: "monospace", fontSize: 15, color: "#1565c0" }}>
                <b>SQL Preview:</b><br />
                {conditions.map(toQuery).join(" AND ")}
            </div>
        </div>
    );
}


const cbSelectStyle = {
    borderRadius: 5,
    padding: "6px 7px",
    fontSize: 15,
};
const cbInputStyle = {
    borderRadius: 5,
    padding: "6px 10px",
    fontSize: 15,
    width: 110,
};
const cbAddBtnStyle = {
    borderRadius: 7,
    padding: "7px 16px",
    backgroundColor: "#e7f4fa",
    color: "#1976d2",
    border: "none",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer"
};

