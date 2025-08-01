import React from "react";

export default function SearchInput({ value, onChange, onClear }) {
    return (
        <div style={{ marginBottom: 18, textAlign: "right" }}>
            <div
                style={{
                    position: "relative",
                    display: "inline-block",
                    minWidth: 280,
                    maxWidth: 400,
                }}
            >
                <input
                    type="search"
                    value={value}
                    onChange={onChange}
                    placeholder="Search username..."
                    style={{
                        width: "100%",
                        borderRadius: 12,
                        padding: "10px 44px 10px 40px", // padding-right for icons, padding-left for search icon
                        border: "1.5px solid #b0bec5",
                        fontSize: 16,
                        outline: "none",
                        boxShadow: "0 2px 7px -6px #b0bec5",
                        transition: "border-color 0.28s ease, box-shadow 0.28s ease",
                        userSelect: "text",
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "#1976d2";
                        e.target.style.boxShadow = "0 0 8px #1976d2aa";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "#b0bec5";
                        e.target.style.boxShadow = "0 2px 7px -6px #b0bec5";
                    }}
                    aria-label="Search by username"
                    spellCheck="false"
                />

                {/* Search icon on the left */}
                <svg
                    style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 20,
                        height: 20,
                        fill: "none",
                        stroke: "#78909c",
                        strokeWidth: 2,
                        pointerEvents: "none",
                        userSelect: "none",
                    }}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                {/* Clear (X) button on the right, shows only if input has value */}
                {value && (
                    <button
                        onClick={() => onClear && onClear()}
                        aria-label="Clear search"
                        type="button"
                        style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 20,
                            height: 20,
                            color: "#78909c",
                            fontSize: 18,
                            userSelect: "none",
                            transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1976d2")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#78909c")}
                    >
                        {/* × */}
                    </button>
                )}
            </div>
        </div>
    );
}
