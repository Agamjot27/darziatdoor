import { useState } from "react";
import { createPortal } from "react-dom";
import API from "../api/api";
import toast from "react-hot-toast";

const label = {
    display: "block",
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "#9ca3af",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
};
const inputBase = {
    width: "100%",
    border: "none",
    borderBottom: "1px solid rgba(18,22,19,0.18)",
    background: "transparent",
    padding: "0.55rem 0",
    fontSize: "0.95rem",
    outline: "none",
    color: "#121613",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
};

/* ── Step bar ── */
const STEPS = ["Details", "Card", "Confirm"];
const StepBar = ({ step }) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
        {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i <= step ? "#2bee4b" : "rgba(18,22,19,0.08)",
                    color: i <= step ? "#121613" : "#9ca3af",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 800,
                    flexShrink: 0,
                    transition: "background 0.3s",
                }}>{i < step ? "✓" : i + 1}</div>
                <span style={{
                    marginLeft: "0.4rem",
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em",
                    color: i === step ? "#121613" : "#9ca3af",
                    textTransform: "uppercase", whiteSpace: "nowrap",
                }}>{s}</span>
                {i < STEPS.length - 1 && (
                    <div style={{
                        flex: 1, height: 1, margin: "0 0.75rem",
                        background: i < step ? "#2bee4b" : "rgba(18,22,19,0.1)",
                        transition: "background 0.3s",
                    }} />
                )}
            </div>
        ))}
    </div>
);

/* ── Input with focus ring ── */
const FocusInput = ({ ...props }) => {
    const [focused, setFocused] = useState(false);
    return (
        <input
            {...props}
            style={{ ...inputBase, ...(focused ? { borderBottomColor: "#2bee4b" } : {}) }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
};

/* ══════════════════════════════════════════════
   PaymentButton
══════════════════════════════════════════════ */
const PaymentButton = ({ order, onPaid }) => {
    const [open, setOpen]           = useState(false);
    const [step, setStep]           = useState(0);
    const [processing, setProcessing] = useState(false);

    const [name, setName]           = useState(localStorage.getItem("name") || "");
    const [email, setEmail]         = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry]       = useState("");
    const [cvv, setCvv]             = useState("");

    const formatCard = (v) =>
        v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

    const formatExpiry = (v) => {
        const d = v.replace(/\D/g, "").slice(0, 4);
        return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
    };

    const canStep0 = name.trim().length > 1 && email.includes("@");
    const canStep1 =
        cardNumber.replace(/\s/g, "").length === 16 &&
        expiry.length === 5 && cvv.length >= 3;

    const handleNext = () => {
        if (step === 0 && !canStep0) { toast.error("Please fill in your name and email"); return; }
        if (step === 1 && !canStep1) { toast.error("Please enter valid card details"); return; }
        setStep((s) => s + 1);
    };

    const handlePay = async () => {
        setProcessing(true);
        try {
            await new Promise((r) => setTimeout(r, 1400));
            await API.post("/payments/confirm", { orderId: order._id || order.id });
            setStep(3);
            toast.success("Payment successful! ✓");
            onPaid?.();
        } catch (err) {
            toast.error(err.response?.data?.message || "Payment failed. Try again.");
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        if (processing) return;
        setOpen(false);
        setStep(0);
    };

    /* ── Paid badge ── */
    if (order.paymentStatus === "paid") {
        return (
            <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: "#f0fdf4", color: "#166534",
                padding: "0.4rem 0.85rem", borderRadius: "2rem",
                fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em",
                border: "1px solid #bbf7d0",
            }}>✓ PAID</span>
        );
    }

    if (!order.price) return null;

    /* ── Portal content ── */
    const portal = open ? createPortal(
        <div style={{
            /* true full-screen, nothing can clip this */
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100vw", height: "100vh",
            background: "#fafffa",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            color: "#121613",
            overflowY: "auto",
        }}>
            {/* Left decorative strip */}
            <div style={{
                position: "fixed", top: 0, left: 0, bottom: 0,
                width: "6px", background: "#2bee4b",
            }} />

            {/* Card */}
            <div style={{
                width: "100%",
                maxWidth: "480px",
                padding: "2.5rem",
                position: "relative",
            }}>
                {/* Brand + close row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.2em", color: "#9ca3af" }}>
                        DARZI<span style={{ color: "#2bee4b" }}>ATDOOR</span>
                    </span>
                    <button onClick={handleClose} style={{
                        background: "rgba(18,22,19,0.06)", border: "none",
                        borderRadius: "50%", width: 32, height: 32,
                        cursor: "pointer", fontSize: "0.9rem", color: "#516254",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
                </div>

                {/* Heading */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, margin: "0 0 0.3rem" }}>
                        {step < 3 ? "Complete Payment" : "Payment Confirmed"}
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>
                        {step < 3
                            ? `${order.garmentType} · ₹${order.price?.toLocaleString("en-IN")}`
                            : "Your order is now confirmed."}
                    </p>
                </div>

                {/* ── Success ── */}
                {step === 3 ? (
                    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: "50%",
                            background: "#f0fdf4", border: "2px solid #bbf7d0",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "2rem", margin: "0 auto 1.5rem",
                        }}>✓</div>
                        <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: "italic", color: "#516254", marginBottom: "2rem" }}>
                            ₹{order.price?.toLocaleString("en-IN")} received. Your tailor has been notified.
                        </p>
                        <button onClick={handleClose} style={{
                            background: "#2bee4b", color: "#121613",
                            border: "none", padding: "0.85rem 2.5rem",
                            borderRadius: "10px", fontSize: "0.7rem",
                            fontWeight: 800, letterSpacing: "0.1em",
                            cursor: "pointer", textTransform: "uppercase",
                        }}>Done</button>
                    </div>
                ) : (
                    <>
                        <StepBar step={step} />

                        {/* Step 0 – Billing */}
                        {step === 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div>
                                    <label style={label}>Full Name</label>
                                    <FocusInput type="text" placeholder="e.g. Arjun Mehta"
                                        value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label style={label}>Email Address</label>
                                    <FocusInput type="email" placeholder="you@email.com"
                                        value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* Step 1 – Card */}
                        {step === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div>
                                    <label style={label}>Card Number</label>
                                    <FocusInput type="text" placeholder="1234 5678 9012 3456"
                                        value={cardNumber} inputMode="numeric"
                                        onChange={(e) => setCardNumber(formatCard(e.target.value))} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                    <div>
                                        <label style={label}>Expiry</label>
                                        <FocusInput type="text" placeholder="MM/YY"
                                            value={expiry} inputMode="numeric"
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))} />
                                    </div>
                                    <div>
                                        <label style={label}>CVV</label>
                                        <FocusInput type="password" placeholder="•••"
                                            value={cvv} inputMode="numeric"
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.65rem", color: "#9ca3af", margin: 0 }}>
                                    🔒 Demo only — no real card data is stored or transmitted.
                                </p>
                            </div>
                        )}

                        {/* Step 2 – Confirm */}
                        {step === 2 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                {[
                                    ["Garment",  order.garmentType],
                                    ["Service",  order.serviceType],
                                    ["Name",     name],
                                    ["Email",    email],
                                    ["Card",     `•••• •••• •••• ${cardNumber.replace(/\s/g, "").slice(-4)}`],
                                ].map(([k, v]) => (
                                    <div key={k} style={{
                                        display: "flex", justifyContent: "space-between",
                                        borderBottom: "1px solid rgba(18,22,19,0.06)",
                                        paddingBottom: "0.7rem",
                                    }}>
                                        <span style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600 }}>{k}</span>
                                        <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem" }}>
                                    <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Total</span>
                                    <span style={{ fontSize: "1rem", fontWeight: 800 }}>
                                        ₹{order.price?.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
                            {step > 0 && (
                                <button onClick={() => setStep((s) => s - 1)} disabled={processing}
                                    style={{
                                        flex: 1, background: "transparent",
                                        border: "1px solid rgba(18,22,19,0.15)",
                                        padding: "0.85rem", borderRadius: "10px",
                                        fontSize: "0.7rem", fontWeight: 700,
                                        letterSpacing: "0.06em", cursor: "pointer",
                                        textTransform: "uppercase", color: "#121613",
                                    }}>Back</button>
                            )}
                            <button
                                onClick={step === 2 ? handlePay : handleNext}
                                disabled={processing}
                                style={{
                                    flex: 2,
                                    background: processing ? "#9ca3af" : "#2bee4b",
                                    color: "#121613", border: "none",
                                    padding: "0.85rem", borderRadius: "10px",
                                    fontSize: "0.7rem", fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    cursor: processing ? "not-allowed" : "pointer",
                                    textTransform: "uppercase",
                                    transition: "background 0.2s",
                                }}
                            >
                                {processing ? "PROCESSING…"
                                    : step === 2 ? `PAY ₹${order.price?.toLocaleString("en-IN")}`
                                    : "CONTINUE"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body   // ← teleports outside all parent stacking contexts
    ) : null;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                style={{
                    background: "#e9c176", color: "#051125",
                    border: "none", padding: "0.5rem 1.1rem",
                    borderRadius: "0.35rem", fontSize: "0.6rem",
                    fontWeight: 800, letterSpacing: "0.08em",
                    cursor: "pointer", fontFamily: "'Manrope', sans-serif",
                    transition: "opacity 0.2s",
                }}
            >
                PAY ₹{order.price?.toLocaleString("en-IN")}
            </button>
            {portal}
        </>
    );
};

export default PaymentButton;
