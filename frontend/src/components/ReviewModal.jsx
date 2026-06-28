import { useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

const ReviewModal = ({ order, onClose, onSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async () => {
        if (rating === 0) { toast.error("Please select a rating"); return; }
        setSubmitting(true);
        try {
            await API.post("/reviews", {
                orderId: order._id || order.id,
                rating,
                comment,
            });
            toast.success("Review submitted!");
            onSubmitted?.();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(5,17,37,0.55)", zIndex: 4000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }} onClick={onClose}>
            <div style={{
                background: "#fff", borderRadius: "1rem", padding: "2rem", maxWidth: 440, width: "100%",
                fontFamily: "'Manrope', sans-serif", position: "relative",
            }} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "1.2rem" }}>✕</button>

                <p style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.2em", color: "#9ca3af", margin: "0 0 0.5rem" }}>RATE YOUR EXPERIENCE</p>
                <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", color: "#051125", margin: "0 0 0.25rem" }}>
                    {order.garmentType}
                </h3>
                <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: "0 0 1.5rem" }}>
                    by {order.tailorId?.name || "Your tailor"}
                </p>

                {/* Stars */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", justifyContent: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: "2rem", lineHeight: 1, padding: "0.25rem",
                                color: star <= (hover || rating) ? "#e9c176" : "#e5e7eb",
                                transition: "color 0.15s, transform 0.15s",
                                transform: star === (hover || rating) ? "scale(1.2)" : "scale(1)",
                            }}
                        >★</button>
                    ))}
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", marginBottom: "0.5rem" }}>
                        COMMENT (OPTIONAL)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="How was the quality, punctuality and craftsmanship?"
                        rows={3}
                        style={{
                            width: "100%", border: "1px solid rgba(5,17,37,0.1)", borderRadius: "0.5rem",
                            padding: "0.75rem", fontFamily: "inherit", fontSize: "0.82rem",
                            outline: "none", resize: "vertical", boxSizing: "border-box",
                            background: "#fcf9f3", color: "#051125",
                        }}
                    />
                </div>

                <button
                    onClick={submit}
                    disabled={submitting || rating === 0}
                    style={{
                        width: "100%", background: "#051125", color: "#fff", border: "none",
                        padding: "0.9rem", borderRadius: "0.5rem", fontSize: "0.65rem", fontWeight: 800,
                        letterSpacing: "0.1em", cursor: rating === 0 ? "not-allowed" : "pointer",
                        opacity: (submitting || rating === 0) ? 0.6 : 1, fontFamily: "inherit",
                    }}
                >
                    {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
