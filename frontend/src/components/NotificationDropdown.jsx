import { useEffect, useRef, useState } from "react";

const NotificationDropdown = ({ notifications, onClear, onClose }) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    return (
        <div ref={ref} style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320,
            background: "#fff", borderRadius: "0.75rem", boxShadow: "0 12px 40px rgba(5,17,37,0.15)",
            border: "1px solid rgba(5,17,37,0.07)", zIndex: 3000,
            fontFamily: "'Manrope', sans-serif", overflow: "hidden",
        }}>
            <div style={{ padding: "0.85rem 1.1rem", borderBottom: "1px solid rgba(5,17,37,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.15em", color: "#051125" }}>NOTIFICATIONS</span>
                {notifications.length > 0 && (
                    <button onClick={onClear} style={{ background: "none", border: "none", fontSize: "0.6rem", color: "#9ca3af", cursor: "pointer", fontWeight: 700, letterSpacing: "0.06em" }}>
                        CLEAR ALL
                    </button>
                )}
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af", fontSize: "0.8rem", fontStyle: "italic" }}>
                        All caught up ✓
                    </div>
                ) : notifications.map((n) => (
                    <div key={n.id} style={{
                        padding: "0.9rem 1.1rem", borderBottom: "1px solid rgba(5,17,37,0.04)",
                        display: "flex", gap: "0.75rem", alignItems: "flex-start",
                        background: n.read ? "#fff" : "#f0fdf4",
                    }}>
                        <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{n.icon}</span>
                        <div>
                            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#051125", margin: "0 0 0.2rem" }}>{n.title}</p>
                            <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                            <p style={{ fontSize: "0.55rem", color: "#9ca3af", margin: "0.25rem 0 0" }}>{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationDropdown;
