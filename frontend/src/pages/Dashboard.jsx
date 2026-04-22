import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";
import TailorDashboard from "./TailorDashboard";

/* ─────────── Inline CSS & Custom Animations ─────────── */
const InjectClientCSS = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        
        .cd-root { min-height: 100vh; background: #fcf9f3; font-family: 'Manrope', sans-serif; color: #051125; padding-bottom: 4rem; }
        .cd-btn-primary { background: #051125; color: #fff; border: none; padding: 0.65rem 1.2rem; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
        .cd-btn-primary:hover { background: #1b263b; }
        .cd-btn-outline { background: transparent; color: #051125; border: 1px solid rgba(5,17,37,0.2); padding: 0.65rem 1.2rem; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .cd-btn-outline:hover { background: rgba(5,17,37,0.03); border-color: rgba(5,17,37,0.4); }
        .cd-card { background: #fff; border-radius: 0.5rem; border: 1px solid rgba(5,17,37,0.06); padding: 1.5rem; box-shadow: 0 4px 12px rgba(5,17,37,0.02); }
        .cd-input { width: 100%; border: none; border-bottom: 1px solid rgba(5,17,37,0.1); background: transparent; padding: 0.5rem 0; font-family: 'Manrope', sans-serif; font-size: 0.85rem; outline: none; transition: border-color 0.2s; color: #051125; }
        .cd-input:focus { border-bottom-color: #051125; }
        .cd-select { width: 100%; border: none; border-bottom: 1px solid rgba(5,17,37,0.1); background: transparent; padding: 0.5rem 0; font-family: 'Manrope', sans-serif; font-size: 0.85rem; outline: none; transition: border-color 0.2s; color: #051125; appearance: none; }
        .cd-select:focus { border-bottom-color: #051125; }
        
        .cd-swatch { overflow: hidden; border-radius: 0.4rem; position: relative; border: 1px solid rgba(5,17,37,0.06); transition: transform 0.2s; cursor: pointer; }
        .cd-swatch:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(5,17,37,0.05); }
        
        @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    `}</style>
);

// --- SVG Icons ---
const Icons = {
    ShoppingBag: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
    User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    Scissors: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>,
    Measure: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    Shirt: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg>,
    Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
};

const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    // Render fully separate tailor dashboard
    if (role === "tailor") return <TailorDashboard />;

    const [orders, setOrders] = useState([]);
    const [serviceType, setServiceType] = useState("");
    const [garmentType, setGarmentType] = useState("");
    const [date, setDate] = useState("");
    const [measurements, setMeasurements] = useState({ chest: "", waist: "", inseam: "", shoulders: "" });
    const [fabricProfile, setFabricProfile] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await API.get("/orders");
            setOrders(response.data.orders || response.data);
        } catch (error) {
            console.error("Fetch orders error:", error);
        }
    };

    const userName = localStorage.getItem("name") || "Guest";

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleLogout = async () => {
        try { await API.post("/auth/logout"); } catch (error) { console.log(error); }
        localStorage.removeItem("role");
        navigate("/login");
    };

    const handleCreateOrder = async () => {
        if (!serviceType || !garmentType || !date) {
            toast.error("Please specify service, garment, and date.");
            return;
        }
        setIsBooking(true);
        try {
            const sanitizedMeasurements = {};
            Object.keys(measurements).forEach(key => {
                const val = measurements[key];
                if (val !== "" && val !== null && val !== undefined) {
                    sanitizedMeasurements[key] = Number(val);
                }
            });

            await API.post("/orders", {
                serviceType, garmentType, date,
                measurements: (serviceType === "stitching" || serviceType === "bespoke") ? sanitizedMeasurements : undefined,
                fabricProfile: (serviceType === "stitching" || serviceType === "bespoke") ? fabricProfile : undefined
            });
            setShowBookingModal(false);
            setServiceType(""); setGarmentType(""); setDate(""); setFabricProfile("");
            setMeasurements({ chest: "", waist: "", inseam: "", shoulders: "" });
            toast.success("Atelier booking confirmed!");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book tailor");
        } finally {
            setIsBooking(false);
        }
    };

    const activeOrders = orders.filter(o => o.status !== "completed" && o.status !== "rejected");
    const upcomingVisits = orders.filter(o => o.status === "pending" || o.status === "accepted");
    const pastOrders = orders.filter(o => o.status === "completed").slice(0, 3);
    const mostRecentOrder = orders.find(o => o.measurements && Object.keys(o.measurements).length > 0);

    return (
        <>
            <InjectClientCSS />
            <div className="cd-root">
                {/* ── HEADER ── */}
                <header style={{ padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(5,17,37,0.05)" }}>
                    <div style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.4rem", fontWeight: 700, color: "#051125", letterSpacing: "-0.02em" }}>
                        DarziAtDoor
                    </div>

                    <nav style={{ display: "flex", gap: "2.5rem" }}>
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>Services</a>
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>Tailors</a>
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>Pricing</a>
                    </nav>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#051125" }}><Icons.ShoppingBag /></button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#051125" }} onClick={handleLogout} title="Logout"><Icons.User /></button>
                        <button className="cd-btn-primary" onClick={() => setShowBookingModal(true)}>BOOK A TAILOR</button>
                    </div>
                </header>

                <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>

                    {/* ── GREETING ── */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
                        <div className="animate-fade-up">
                            <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.2em", color: "#9ca3af", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                                THE PERSONAL ATELIER
                            </p>
                            <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 400, color: "#051125", fontStyle: "italic", letterSpacing: "-0.02em", margin: 0 }}>
                                Good Morning, {userName.split(' ')[0]}.
                            </h1>
                        </div>
                        <div className="animate-fade-up" style={{ animationDelay: "0.1s", display: "flex", alignItems: "center", gap: "1rem", background: "#f0fdf4", padding: "0.75rem 1.25rem", borderRadius: "3rem", border: "1px solid #bbf7d0" }}>
                            <div>
                                <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: "italic", color: "#2b6954", margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>Sartorial Circle: Member</p>
                            </div>
                            <div style={{ width: 36, height: 36, background: "#fff", border: "1px solid #bbf7d0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2b6954" }}>
                                <Icons.Measure />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem" }}>

                        {/* ── LEFT COLUMN ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

                            {/* Row 1: Active Commission & Home Visit */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                                {/* Active Commission */}
                                <div className="cd-card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                        <div>
                                            <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.3rem", fontWeight: 400, color: "#051125", marginBottom: "0.25rem" }}>Active Commissions</h3>
                                            <p style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase" }}>
                                                {activeOrders.length > 0 ? `${activeOrders.length} Ongoing` : 'No active projects'}
                                            </p>
                                        </div>
                                    </div>

                                    {activeOrders.length > 0 ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                            {activeOrders.map(order => {
                                                const isPending = order.status === 'pending';
                                                const progressWidth = isPending ? "25%" : "65%";
                                                const progressLabel = isPending ? "AWAITING TAILOR" : "FABRIC SOURCED";
                                                const tagBg = isPending ? "#fef3c7" : "#dcfce7";
                                                const tagColor = isPending ? "#b45309" : "#166534";
                                                const tagText = isPending ? "PENDING" : "STITCHING";
                                                return (
                                                    <div key={order._id} style={{ borderBottom: "1px solid rgba(5,17,37,0.05)", paddingBottom: "1rem" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#051125" }}>{order.garmentType || 'Classic Garment'}</span>
                                                            <span style={{ background: tagBg, color: tagColor, padding: "0.2rem 0.6rem", borderRadius: "2rem", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.1em" }}>{tagText}</span>
                                                        </div>
                                                        <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, marginBottom: "0.75rem", overflow: "hidden" }}>
                                                            <div style={{ height: "100%", width: progressWidth, background: "#2b6954", borderRadius: 2 }}></div>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                                                            <span>{progressLabel}</span>
                                                            <span>EXPECTED {new Date(order.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <button style={{ background: "none", border: "none", color: "#051125", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", borderBottom: "1px solid #051125", paddingBottom: 2, cursor: "pointer" }} onClick={() => navigate(`/track/${order._id}`)}>TRACK PROGRESS</button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ paddingTop: "1rem" }}>
                                            <p style={{ fontSize: "0.8rem", color: "#6b7280", fontStyle: "italic", fontFamily: "'Noto Serif', serif" }}>Your tailoring queue is currently empty.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Home Visit */}
                                <div className="cd-card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                        <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.3rem", fontWeight: 400, color: "#051125" }}>Home Visits</h3>
                                        <span style={{ color: "#9ca3af" }}><Icons.Calendar /></span>
                                    </div>

                                    {upcomingVisits.length > 0 ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                            {upcomingVisits.map(visit => (
                                                <div key={visit._id} style={{ borderBottom: "1px solid rgba(5,17,37,0.05)", paddingBottom: "1rem" }}>
                                                    <div style={{ background: "#f6f3ed", padding: "1rem", borderRadius: "0.4rem", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                                                        <div style={{ background: "#051125", color: "#fff", width: 44, height: 44, borderRadius: "0.4rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                            <span style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.1em" }}>{new Date(visit.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
                                                            <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{new Date(visit.date).getDate()}</span>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#051125", marginBottom: 2 }}>{visit.status === 'pending' ? 'Fitting Consultation' : 'Tailor Visit'}</p>
                                                            <p style={{ fontSize: "0.7rem", color: "#6b7280" }}>{new Date(visit.date).toLocaleDateString()} • {visit.status === 'pending' ? 'Pending' : 'Accepted'}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <button className="cd-btn-outline" style={{ flex: 1, padding: "0.5rem", fontSize: "0.55rem" }}>RESCHEDULE</button>
                                                        <button className="cd-btn-outline" style={{ flex: 1, padding: "0.5rem", fontSize: "0.55rem" }}>DETAILS</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ fontSize: "0.8rem", color: "#6b7280", fontStyle: "italic", fontFamily: "'Noto Serif', serif" }}>No upcoming fitting visits scheduled.</p>
                                    )}
                                </div>
                            </div>

                            {/* Fabric Swatch Library */}
                            <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
                                    <div>
                                        <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.4rem", fontWeight: 400, color: "#051125" }}>Fabric Swatch Library</h3>
                                        <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Request physical samples for your next masterpiece</p>
                                    </div>
                                    <button style={{ background: "none", border: "none", color: "#051125", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", borderBottom: "1px solid #051125", paddingBottom: 2, cursor: "pointer" }}>BROWSE COLLECTION</button>
                                </div>

                                <div style={{ display: "flex", gap: "1.5rem" }}>
                                    <div style={{ width: 140 }}>
                                        <div className="cd-swatch" style={{ height: 160, background: "#e0e7ff", marginBottom: "0.75rem", display: "flex", position: "relative" }}>
                                            <div style={{ width: "40%", background: "#fff", height: "100%" }}></div>
                                            <div style={{ position: "absolute", top: 10, right: 10, color: "#dc2626", fontWeight: 700 }}>1</div>
                                        </div>
                                        <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.05em", color: "#051125", marginBottom: 2 }}>NAVY HERRINGBONE</p>
                                        <p style={{ fontSize: "0.55rem", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>WOOL-SILK BLEND</p>
                                    </div>
                                    <div style={{ width: 140 }}>
                                        <div className="cd-swatch" style={{ height: 160, background: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff" }}>
                                                <span style={{ fontSize: "0.5rem", fontWeight: 800, color: "#0f172a", textAlign: "center", lineHeight: 1.1 }}>Vitale<br />Barberis</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.05em", color: "#051125", marginBottom: 2 }}>CHARCOAL FLANNEL</p>
                                        <p style={{ fontSize: "0.55rem", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>VITALE BARBERIS</p>
                                    </div>
                                    <div style={{ width: 140 }}>
                                        <div className="cd-swatch" style={{ height: 160, background: "#f9fafb", border: "1px dashed rgba(5,17,37,0.15)", marginBottom: "0.75rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="8" cy="10" r="1.5" /><circle cx="12" cy="7" r="1.5" /><circle cx="16" cy="10" r="1.5" /><circle cx="12" cy="15" r="3" fill="#9ca3af" /></svg>
                                            <span style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.05em", color: "#6b7280", textAlign: "center" }}>REQUEST MORE<br />SAMPLES</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* The Fit Evolution */}
                            <div className="cd-card animate-fade-up" style={{ animationDelay: "0.4s", background: "#f6f3ed", border: "none" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                                    <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.3rem", fontWeight: 400, fontStyle: "italic", color: "#051125" }}>The Fit Evolution</h3>
                                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase" }}>
                                        <span style={{ color: "#2b6954" }}>• CHEST</span>
                                        <span>• WAIST</span>
                                    </div>
                                </div>

                                <div style={{ height: 80, display: "flex", alignItems: "flex-end", justifyContent: "space-around", borderBottom: "1px solid rgba(5,17,37,0.05)", paddingBottom: "1rem", position: "relative" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#051125" }}>41.0"</span>
                                        <p style={{ fontSize: "0.5rem", color: "#9ca3af", marginTop: "0.5rem" }}>2022</p>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#051125" }}>42.2"</span>
                                        <p style={{ fontSize: "0.5rem", color: "#9ca3af", marginTop: "0.5rem" }}>2023</p>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#051125", background: "#fff", padding: "0.2rem 0.6rem", borderRadius: "2rem", border: "1px solid #051125", display: "inline-block", marginBottom: "0.5rem" }}>42.5"</span>
                                        <div style={{ width: 60, height: 2, background: "#051125", margin: "0 auto" }}></div>
                                        <p style={{ fontSize: "0.5rem", color: "#051125", marginTop: "0.5rem", fontWeight: 700 }}>CURRENT</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.65rem", color: "#6b7280", fontStyle: "italic", textAlign: "center", marginTop: "1rem" }}>
                                    Measurements have settled into a consistent 'Athletic V-Taper' profile. No significant adjustments recommended for your next order.
                                </p>
                            </div>

                            {/* Style Preferences */}
                            <div className="animate-fade-up" style={{ animationDelay: "0.5s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                    <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.4rem", fontWeight: 400, color: "#051125" }}>Style Preferences</h3>
                                    <button className="cd-btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.55rem" }}>UPDATE PROFILE</button>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                                    <div className="cd-card" style={{ padding: "1.25rem" }}>
                                        <span style={{ color: "#2b6954", marginBottom: "0.75rem", display: "block" }}><Icons.Shirt /></span>
                                        <h4 style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#051125", marginBottom: "0.5rem" }}>LAPEL PREFERENCE</h4>
                                        <p style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.5 }}>Wide Peak Lapels (4") - Always preferred for presence.</p>
                                    </div>
                                    <div className="cd-card" style={{ padding: "1.25rem" }}>
                                        <span style={{ color: "#2b6954", marginBottom: "0.75rem", display: "block" }}><Icons.Layers /></span>
                                        <h4 style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#051125", marginBottom: "0.5rem" }}>INTERNAL CANVAS</h4>
                                        <p style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.5 }}>Full Floating Canvas - No fused materials.</p>
                                    </div>
                                    <div className="cd-card" style={{ padding: "1.25rem" }}>
                                        <span style={{ color: "#2b6954", marginBottom: "0.75rem", display: "block" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 6 6 .5-4.5 4 1.5 6-6-3.5-6 3.5 1.5-6-4.5-4 6-.5L12 2z" /></svg></span>
                                        <h4 style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#051125", marginBottom: "0.5rem" }}>SHOULDER EXPRESSION</h4>
                                        <p style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.5 }}>Spalla Camicia - Neapolitan soft shoulder.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

                            {/* Digital Silhouette */}
                            <div className="cd-card animate-fade-up" style={{ animationDelay: "0.3s", background: "#0f172a", color: "#fff", border: "none" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.2em", color: "#94a3b8", marginBottom: "0.5rem" }}>FIT PROFILE</p>
                                        <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.4rem", fontStyle: "italic", color: "#fff" }}>{userName}</h3>
                                    </div>
                                    <span style={{ color: "#10b981" }}><Icons.Measure /></span>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                                        <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>Shoulder Pitch</span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Soft Neapolitan</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                                        <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>Chest (Circ.)</span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{mostRecentOrder?.measurements?.chest || '104.5'} cm</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                                        <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>Waist Drop</span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{mostRecentOrder?.measurements?.waist || '82.0'} cm</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>Last Scanned</span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Aug 12, 2024</span>
                                    </div>
                                </div>
                                <button style={{ width: "100%", background: "#fcd34d", color: "#0f172a", border: "none", padding: "0.85rem", borderRadius: "0.25rem", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", cursor: "pointer" }}>REQUEST RE-SCAN</button>
                            </div>

                            {/* Recent Legacy */}
                            <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
                                <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.2rem", fontStyle: "italic", color: "#051125", marginBottom: "1rem" }}>Recent Legacy</h3>
                                <div className="cd-card" style={{ padding: "1rem", background: "#fcf9f3", border: "1px solid rgba(5,17,37,0.04)" }}>
                                    {pastOrders.length > 0 ? pastOrders.map((order, idx) => (
                                        <div key={order._id} style={{ display: "flex", gap: "1rem", alignItems: "center", paddingBottom: idx !== pastOrders.length - 1 ? "1rem" : 0, marginBottom: idx !== pastOrders.length - 1 ? "1rem" : 0, borderBottom: idx !== pastOrders.length - 1 ? "1px solid rgba(5,17,37,0.05)" : "none" }}>
                                            <div style={{ width: 44, height: 56, background: "#e2e8f0", borderRadius: "0.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icons.Shirt />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: "0.5rem", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>{new Date(order.date).toLocaleDateString()}</p>
                                                <p style={{ fontSize: "0.85rem", color: "#051125", fontWeight: 600, marginBottom: "0.25rem" }}>{order.garmentType || 'Custom Garment'}</p>
                                                <p style={{ fontSize: "0.55rem", color: "#2b6954", fontWeight: 800, letterSpacing: "0.05em", cursor: "pointer" }}>REORDER DESIGN</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p style={{ fontSize: "0.75rem", color: "#6b7280", fontStyle: "italic" }}>No completed orders yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Private Concierge */}
                            <div className="cd-card animate-fade-up" style={{ animationDelay: "0.5s", border: "1px dashed rgba(5,17,37,0.15)", textAlign: "center", padding: "2.5rem 1.5rem" }}>
                                <div style={{ color: "#2b6954", display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                                    <Icons.Scissors />
                                </div>
                                <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.2rem", fontStyle: "italic", color: "#051125", marginBottom: "0.25rem" }}>Private Concierge</h3>
                                <p style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.15em", color: "#9ca3af", textTransform: "uppercase", marginBottom: "1.5rem" }}>MASTER TAILOR • ANTONIO V.</p>
                                <button className="cd-btn-primary" style={{ width: "100%" }} onClick={() => setShowBookingModal(true)}>START CONSULTATION</button>
                            </div>
                        </div>

                    </div>
                </main>

                {/* ── FOOTER ── */}
                <footer style={{ maxWidth: 1200, margin: "4rem auto 0", padding: "3rem 2rem 1rem", borderTop: "1px solid rgba(5,17,37,0.05)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
                        <div>
                            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#051125", marginBottom: "1rem" }}>DarziAtDoor</h4>
                            <p style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.6 }}>Redefining the modern wardrobe with artisanal precision and heritage craftsmanship, delivered to your doorstep.</p>
                        </div>
                        <div>
                            <h4 style={{ fontFamily: "'Noto Serif', serif", fontStyle: "italic", fontSize: "1rem", color: "#051125", marginBottom: "1rem" }}>The Studio</h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <li><a href="#" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>THE CRAFT</a></li>
                                <li><a href="#" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>OUR HERITAGE</a></li>
                                <li><a href="#" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>SUSTAINABILITY</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ fontFamily: "'Noto Serif', serif", fontStyle: "italic", fontSize: "1rem", color: "#051125", marginBottom: "1rem" }}>Support</h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <li><a href="#" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>MEASUREMENT GUIDE</a></li>
                                <li><a href="#" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>PRIVACY POLICY</a></li>
                                <li><a href="#" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", textDecoration: "none" }}>CONTACT</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ fontFamily: "'Noto Serif', serif", fontStyle: "italic", fontSize: "1rem", color: "#051125", marginBottom: "1rem" }}>Stay Informed</h4>
                            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "1rem" }}>Curated sartorial updates and seasonal collection previews.</p>
                            <div style={{ display: "flex", borderBottom: "1px solid rgba(5,17,37,0.2)", paddingBottom: "0.5rem" }}>
                                <input type="email" placeholder="Your email" style={{ border: "none", background: "transparent", flex: 1, fontSize: "0.75rem", outline: "none", color: "#051125" }} />
                                <button style={{ background: "none", border: "none", color: "#2b6954", cursor: "pointer" }}>→</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(5,17,37,0.05)" }}>
                        <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase" }}>© 2024 DARZIATDOOR. THE ART OF BESPOKE TAILORING.</p>
                        <div style={{ display: "flex", gap: "1rem", color: "#9ca3af" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        </div>
                    </div>
                </footer>

                {/* ── BOOKING MODAL ── */}
                {showBookingModal && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(5,17,37,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div className="cd-card animate-fade-up" style={{ width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", position: "relative", padding: "2.5rem" }}>
                            <button
                                onClick={() => setShowBookingModal(false)}
                                style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>

                            <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.8rem", color: "#051125", marginBottom: "0.5rem" }}>Reserve Atelier Visit</h3>
                            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "2rem" }}>Schedule a personal consultation or tailoring service.</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#9ca3af", marginBottom: "0.5rem" }}>SERVICE TYPE</label>
                                    <select className="cd-select" value={serviceType} onChange={(e) => { setServiceType(e.target.value); setGarmentType(""); }}>
                                        <option value="">Choose Service</option>
                                        <option value="bespoke">Bespoke (From Scratch)</option>
                                        <option value="stitching">Custom Stitching</option>
                                        <option value="alteration">Precision Alteration</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#9ca3af", marginBottom: "0.5rem" }}>GARMENT CATEGORY</label>
                                    <select className="cd-select" value={garmentType} onChange={(e) => setGarmentType(e.target.value)}>
                                        <option value="">Select Garment</option>
                                        {serviceType === "bespoke" && (
                                            <>
                                                <option value="Bespoke Suit">Bespoke Suit</option>
                                                <option value="Custom Shirt">Custom Shirt</option>
                                                <option value="Traditional Wear (Sherwani/Bandhgala)">Traditional Wear</option>
                                            </>
                                        )}
                                        {(serviceType === "stitching" || serviceType === "alteration") && (
                                            <>
                                                <option value="Shirt">Shirt</option>
                                                <option value="Trousers">Trousers</option>
                                                <option value="Jacket / Blazer">Jacket / Blazer</option>
                                                <option value="Kurta / Sherwani">Kurta / Sherwani</option>
                                                <option value="Dress / Gown">Dress / Gown</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#9ca3af", marginBottom: "0.5rem" }}>APPOINTMENT DATE</label>
                                    <input type="date" className="cd-input" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>

                                {(serviceType === "stitching" || serviceType === "bespoke") && (
                                    <div style={{ background: "#fcf9f3", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid rgba(5,17,37,0.06)", marginTop: "0.5rem" }}>
                                        <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#051125", marginBottom: "1rem" }}>MEASUREMENT BLUEPRINT & FABRIC</p>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                                            <input className="cd-input" type="number" placeholder="Chest (cm)" value={measurements.chest} onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })} />
                                            <input className="cd-input" type="number" placeholder="Waist (cm)" value={measurements.waist} onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })} />
                                            <input className="cd-input" type="number" placeholder="Shoulders (cm)" value={measurements.shoulders} onChange={(e) => setMeasurements({ ...measurements, shoulders: e.target.value })} />
                                            <input className="cd-input" type="number" placeholder="Inseam (cm)" value={measurements.inseam} onChange={(e) => setMeasurements({ ...measurements, inseam: e.target.value })} />
                                        </div>
                                        <input className="cd-input" type="text" placeholder="Fabric Preference (e.g. Italian Wool, Egyptian Cotton)" value={fabricProfile} onChange={(e) => setFabricProfile(e.target.value)} />
                                    </div>
                                )}

                                <button className="cd-btn-primary" style={{ marginTop: "1rem", padding: "1rem" }} onClick={handleCreateOrder} disabled={isBooking}>
                                    {isBooking ? "CONFIRMING..." : "CONFIRM CONSULTATION"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;
