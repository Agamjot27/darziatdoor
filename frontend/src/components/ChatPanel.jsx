import { useEffect, useRef, useState } from "react";
import API from "../api/api";
import { socket } from "../utils/socket";
import toast from "react-hot-toast";

const ChatPanel = ({ orderId, currentUserId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!orderId) return;
        const fetch = async () => {
            try {
                const res = await API.get(`/messages/${orderId}`);
                setMessages(res.data.messages || []);
            } catch {
                toast.error("Could not load messages");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [orderId]);

    useEffect(() => {
        const onMsg = (msg) => {
            if (String(msg.orderId) === String(orderId)) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            }
        };
        socket.on("new_message", onMsg);
        return () => socket.off("new_message", onMsg);
    }, [orderId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = async () => {
        if (!text.trim()) return;
        setSending(true);
        try {
            const res = await API.post(`/messages/${orderId}`, { text });
            setMessages((prev) => {
                if (prev.some((m) => m.id === res.data.message.id)) return prev;
                return [...prev, res.data.message];
            });
            setText("");
        } catch {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    return (
        <div style={{
            position: "fixed", bottom: 24, right: 24, width: 360, height: 480,
            background: "#fff", borderRadius: "1rem", boxShadow: "0 20px 60px rgba(5,17,37,0.18)",
            border: "1px solid rgba(5,17,37,0.08)", display: "flex", flexDirection: "column",
            zIndex: 2000, fontFamily: "'Manrope', sans-serif",
        }}>
            {/* Header */}
            <div style={{
                padding: "1rem 1.25rem", borderBottom: "1px solid rgba(5,17,37,0.06)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#051125", borderRadius: "1rem 1rem 0 0",
            }}>
                <div>
                    <p style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", margin: 0 }}>ORDER CHAT</p>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", margin: 0 }}>#{String(orderId).slice(-6).toUpperCase()}</p>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}>✕</button>
                )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {loading ? (
                    <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.8rem", marginTop: "2rem" }}>Loading…</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.8rem", marginTop: "2rem", fontStyle: "italic" }}>
                        No messages yet. Start the conversation.
                    </div>
                ) : messages.map((msg) => {
                    const isMe = msg.sender?.id === currentUserId || msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                            <div style={{
                                maxWidth: "78%", padding: "0.6rem 0.9rem",
                                background: isMe ? "#051125" : "#f6f3ed",
                                color: isMe ? "#fff" : "#374151",
                                borderRadius: isMe ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                            }}>
                                {!isMe && (
                                    <p style={{ fontSize: "0.55rem", fontWeight: 700, color: "#2b6954", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        {msg.sender?.name || "Tailor"}
                                    </p>
                                )}
                                <p style={{ fontSize: "0.82rem", margin: 0, lineHeight: 1.4 }}>{msg.text}</p>
                                <p style={{ fontSize: "0.5rem", opacity: 0.5, margin: "0.25rem 0 0", textAlign: isMe ? "right" : "left" }}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(5,17,37,0.06)", display: "flex", gap: "0.5rem" }}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message…"
                    style={{
                        flex: 1, border: "1px solid rgba(5,17,37,0.1)", borderRadius: "2rem",
                        padding: "0.55rem 1rem", fontSize: "0.82rem", fontFamily: "inherit",
                        outline: "none", background: "#f9f7f2",
                    }}
                />
                <button
                    onClick={send}
                    disabled={sending || !text.trim()}
                    style={{
                        background: "#051125", color: "#fff", border: "none", borderRadius: "50%",
                        width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0, opacity: (!text.trim() || sending) ? 0.5 : 1,
                        transition: "opacity 0.2s",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;
