import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

/* ─────────── inline style-tag for hover/scrollbar CSS ─────────── */
const InjectCSS = () => (
    <style>{`
        .td-nav-item:hover { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.85) !important; }
        .td-commission-card:hover { border-color: rgba(43,105,84,0.25) !important; box-shadow: 0 8px 24px rgba(5,17,37,0.06) !important; transform: translateY(-1px); }
        .td-queue-card:hover { border-color: rgba(43,105,84,0.15) !important; }
        .td-accept-btn:hover { background: #1f4d3d !important; }
        .td-complete-btn:hover { background: #1b263b !important; }
        .td-new-comm:hover { background: #1f4d3d !important; }
        .td-quick-action:hover { background: #f6f3ed !important; }
        .td-right-sidebar::-webkit-scrollbar { width: 4px; }
        .td-right-sidebar::-webkit-scrollbar-thumb { background: rgba(5,17,37,0.1); border-radius: 4px; }
        .td-main::-webkit-scrollbar { width: 6px; }
        .td-main::-webkit-scrollbar-thumb { background: rgba(5,17,37,0.08); border-radius: 4px; }
        @keyframes td-fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .td-animate { animation: td-fadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    `}</style>
);

// --- SVG Icons ---
const Icons = {
    Workshop: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    Orders: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    Measurements: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    Fabrics: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    Analytics: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    Bench: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="14" width="18" height="4" rx="1"/><path d="M16 18v3"/><path d="M8 18v3"/><path d="M5 14v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>,
    Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    Close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    Support: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    Wallet: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>,
    Scissors: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
    Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};


const TailorDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [priceInputs, setPriceInputs] = useState({});
    const [isOnline, setIsOnline] = useState(false);
    const [activeNav, setActiveNav] = useState("workshop");
    const [detailOrder, setDetailOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const [tailorRes, pendingRes] = await Promise.all([
                API.get("/orders/tailor"),
                API.get("/orders/pending")
            ]);
            setOrders(tailorRes.data.orders || tailorRes.data);
            setPendingOrders(pendingRes.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleLogout = async () => {
        try { await API.post("/auth/logout"); } catch (e) { /* silent */ }
        localStorage.removeItem("role");
        navigate("/login");
    };

    const toggleOnlineStatus = async () => {
        try {
            const newStatus = !isOnline;
            await API.put("/auth/tailor/status", { isOnline: newStatus });
            setIsOnline(newStatus);
            toast.success(newStatus ? "You're now online for jobs." : "You're now offline.");
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const acceptOrder = async (orderId) => {
        const price = priceInputs[orderId];
        if (!price) { toast.error("Enter your quote first."); return; }
        try {
            await API.put(`/orders/accept/${orderId}`, { price: Number(price) });
            toast.success("Commission accepted at ₹" + price);
            fetchOrders();
        } catch (e) {
            toast.error(e.response?.data?.message || e.response?.data?.error || "Failed to accept");
        }
    };

    const completeOrder = async (orderId) => {
        try {
            await API.put(`/orders/complete/${orderId}`);
            toast.success("Order marked as completed!");
            fetchOrders();
        } catch (e) {
            toast.error("Failed to complete order.");
        }
    };

    const rejectOrder = async (orderId) => {
        try {
            await API.put(`/orders/reject/${orderId}`);
            toast.success("Order rejected.");
            fetchOrders();
        } catch (e) {
            toast.error("Failed to reject order.");
        }
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getTimeSince = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const stageMap = { pending: 0, accepted: 1, in_progress: 2, completed: 3 };
    const stages = ["Drafting", "Cutting", "First Fitting", "Final Stitching"];

    const activeOrders = orders.filter(o => o.status === "accepted" || o.status === "in_progress");
    const completedOrders = orders.filter(o => o.status === "completed");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    const navItems = [
        { key: "workshop", label: "Workshop", Icon: Icons.Workshop },
        { key: "orders", label: "Orders", Icon: Icons.Orders },
        { key: "measurements", label: "Measurement Book", Icon: Icons.Measurements },
        { key: "fabrics", label: "Fabric Gallery", Icon: Icons.Fabrics },
        { key: "analytics", label: "Analytics", Icon: Icons.Analytics },
    ];

    const renderWorkshop = () => (
        <>
            {/* Greeting + Stats */}
            <section className="td-animate" style={S.greetingRow}>
                <div style={S.greetingLeft}>
                    <p style={S.overline}>WORKSHOP OVERVIEW</p>
                    <h2 style={S.greeting}>{getGreeting()}, Master<br/>Tailor.</h2>
                </div>
                <div style={S.statsRow}>
                    <div style={S.statCard}>
                        <div style={S.statTop}>
                            <span style={S.statNum}>{activeOrders.length + pendingOrders.length}</span>
                            <span style={S.statBadge}>+{pendingOrders.length} THIS WEEK</span>
                        </div>
                        <p style={S.statLabel}>ACTIVE COMMISSIONS</p>
                    </div>
                    <div style={{ ...S.statCard, background: "#051125" }}>
                        <div style={S.statTop}>
                            <span style={{ ...S.statNum, color: "#fff" }}>4.9</span>
                            <span style={{ color: "#e9c176", fontSize: "1.2rem" }}>★</span>
                        </div>
                        <p style={{ ...S.statLabel, color: "rgba(255,255,255,0.5)" }}>ARTISAN RATING</p>
                    </div>
                </div>
            </section>

            {/* ── INCOMING COMMISSIONS ── */}
            <section className="td-animate" style={{ ...S.section, animationDelay: "0.1s" }}>
                <div style={S.sectionHeader}>
                    <div>
                        <h3 style={S.sectionTitle}>Incoming Commissions</h3>
                        <p style={S.sectionSub}>NEW REQUESTS REQUIRING REVIEW</p>
                    </div>
                    <button onClick={fetchOrders} style={S.viewAllBtn}>VIEW ALL REQUESTS</button>
                </div>

                {pendingOrders.length === 0 ? (
                    <div style={S.emptyState}>
                        <p style={S.emptyText}>No new commissions waiting.</p>
                        <p style={S.emptyHint}>NEW CLIENT REQUESTS WILL APPEAR HERE.</p>
                    </div>
                ) : (
                    <div style={S.commGrid}>
                        {pendingOrders.map(order => (
                            <div key={order._id} className="td-commission-card" style={S.commCard}>
                                {/* Top row: badge + time */}
                                <div style={S.commTop}>
                                    <span style={{
                                        ...S.badge,
                                        background: order.jobType === "express" ? "#fef2f2" : "#f0fdf4",
                                        color: order.jobType === "express" ? "#dc2626" : "#166534",
                                        border: order.jobType === "express" ? "1px solid #fecaca" : "1px solid #bbf7d0",
                                    }}>
                                        {order.jobType === "express" ? "URGENT" : "STANDARD"}
                                    </span>
                                    <span style={S.timeAgo}>{getTimeSince(order.createdAt)}</span>
                                </div>

                                {/* Title + client */}
                                <h4 style={S.commTitle}>{order.garmentType || order.serviceType}</h4>
                                <p style={S.commClient}>Client : {order.userId?.name || "Anonymous"}</p>

                                {/* Fabric chip + actions */}
                                <div style={S.commBottom}>
                                    <div style={S.fabricChip}>
                                        <div style={S.fabricSwatch} />
                                        <span style={S.fabricName}>
                                            {order.fabricProfile || order.serviceType}
                                        </span>
                                    </div>
                                    <button
                                        style={S.detailsBtn}
                                        onClick={() => setDetailOrder(detailOrder === order._id ? null : order._id)}
                                    >
                                        DETAILS
                                    </button>
                                    <button
                                        className="td-accept-btn"
                                        style={{
                                            ...S.acceptBtn,
                                            opacity: priceInputs[order._id] ? 1 : 0.5,
                                            cursor: priceInputs[order._id] ? "pointer" : "not-allowed"
                                        }}
                                        disabled={!priceInputs[order._id]}
                                        onClick={() => acceptOrder(order._id)}
                                    >
                                        ACCEPT
                                    </button>
                                </div>

                                {/* Price input */}
                                <div style={S.priceRow}>
                                    <span style={S.priceSign}>₹</span>
                                    <input
                                        type="number"
                                        placeholder="Your Quote"
                                        style={S.priceInput}
                                        value={priceInputs[order._id] || ""}
                                        onChange={(e) => setPriceInputs({ ...priceInputs, [order._id]: e.target.value })}
                                    />
                                </div>

                                {/* Expandable details */}
                                {detailOrder === order._id && (
                                    <div style={S.detailsPanel}>
                                        <div style={S.detailGrid}>
                                            <div><span style={S.detailKey}>Service</span><span style={S.detailVal}>{order.serviceType}</span></div>
                                            <div><span style={S.detailKey}>Garment</span><span style={S.detailVal}>{order.garmentType || "N/A"}</span></div>
                                            <div><span style={S.detailKey}>Date</span><span style={S.detailVal}>{new Date(order.date).toLocaleDateString()}</span></div>
                                            <div><span style={S.detailKey}>Fabric</span><span style={S.detailVal}>{order.fabricProfile || "Not specified"}</span></div>
                                        </div>
                                        {order.measurements && (
                                            <div style={S.detailMeasure}>
                                                <p style={S.detailKey}>Measurements</p>
                                                <div style={S.measureGrid}>
                                                    {order.measurements.chest && <div style={S.measureCell}><span style={S.measureKey}>Chest (Circ.)</span><span style={S.measureVal}>{order.measurements.chest} cm</span></div>}
                                                    {order.measurements.waist && <div style={S.measureCell}><span style={S.measureKey}>Waist</span><span style={S.measureVal}>{order.measurements.waist} cm</span></div>}
                                                    {order.measurements.shoulders && <div style={S.measureCell}><span style={S.measureKey}>Shoulders</span><span style={S.measureVal}>{order.measurements.shoulders} cm</span></div>}
                                                    {order.measurements.inseam && <div style={S.measureCell}><span style={S.measureKey}>Inseam</span><span style={S.measureVal}>{order.measurements.inseam} cm</span></div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── WORKSHOP QUEUE ── */}
            <section className="td-animate" style={{ ...S.section, animationDelay: "0.2s" }}>
                <div style={S.sectionHeader}>
                    <div>
                        <h3 style={S.sectionTitle}>Workshop Queue</h3>
                        <p style={S.sectionSub}>CURRENT PRODUCTION STAGES</p>
                    </div>
                </div>

                {activeOrders.length === 0 && completedOrders.length === 0 ? (
                    <div style={S.emptyState}>
                        <p style={S.emptyText}>No active projects in the workshop.</p>
                        <p style={S.emptyHint}>ACCEPT A COMMISSION TO BEGIN.</p>
                    </div>
                ) : (
                    <div style={S.queueList}>
                        {[...activeOrders, ...completedOrders.slice(0, 3)].map(order => {
                            const cs = stageMap[order.status] ?? 0;
                            return (
                                <div key={order._id} className="td-queue-card" style={S.queueCard}>
                                    <div style={S.queueTop}>
                                        <div>
                                            <h4 style={S.queueTitle}>{order.garmentType || order.serviceType}</h4>
                                            <p style={S.queueRef}>CLIENT: REF #{order._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <span style={S.duePill}>
                                            DUE: {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Stage progress */}
                                    <div style={S.stagesWrap}>
                                        <div style={S.stagesTrack}>
                                            {/* Background line */}
                                            <div style={S.stagesLineBg} />
                                            {/* Filled line */}
                                            <div style={{ ...S.stagesLineFill, width: `${(cs / (stages.length - 1)) * 100}%` }} />
                                            {/* Dots */}
                                            {stages.map((stage, i) => (
                                                <div key={stage} style={{ ...S.stageCol, left: `${(i / (stages.length - 1)) * 100}%` }}>
                                                    <div style={{
                                                        ...S.stageDot,
                                                        background: i <= cs ? "#2b6954" : "#d1d5db",
                                                        boxShadow: i === cs ? "0 0 0 4px rgba(43,105,84,0.18)" : "none",
                                                        width: i === cs ? 16 : 12,
                                                        height: i === cs ? 16 : 12,
                                                    }} />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Labels */}
                                        <div style={S.stagesLabels}>
                                            {stages.map((stage, i) => (
                                                <span key={stage} style={{
                                                    ...S.stageLabel,
                                                    color: i <= cs ? "#2b6954" : "#bfc1c6",
                                                    fontWeight: i === cs ? 800 : 600,
                                                }}>{stage.toUpperCase()}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {order.status !== "completed" && (
                                        <div style={S.queueActions}>
                                            {order.price && <span style={S.queuePrice}>₹{order.price}</span>}
                                            <div style={{ flex: 1 }} />
                                            <button className="td-complete-btn" style={S.completeBtn} onClick={() => completeOrder(order._id)}>
                                                <span style={S.btnIcon}><Icons.Check /></span> MARK COMPLETE
                                            </button>
                                            <button style={S.cancelBtn} onClick={() => rejectOrder(order._id)}>
                                                <span style={S.btnIcon}><Icons.Close /></span> CANCEL
                                            </button>
                                        </div>
                                    )}
                                    {order.status === "completed" && (
                                        <div style={S.completedRow}>
                                            <span style={S.completedBadge}><span style={S.btnIcon}><Icons.Check /></span> COMPLETED</span>
                                            {order.price && <span style={S.queuePrice}>₹{order.price}</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );

    const renderOrders = () => (
        <section className="td-animate" style={S.section}>
            <div style={S.sectionHeader}>
                <div>
                    <h3 style={S.sectionTitle}>All Orders</h3>
                    <p style={S.sectionSub}>MANAGE YOUR COMMISSIONS</p>
                </div>
            </div>
            <div style={S.card}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(5,17,37,0.06)", textAlign: "left" }}>
                            <th style={S.th}>Client</th>
                            <th style={S.th}>Service</th>
                            <th style={S.th}>Status</th>
                            <th style={S.th}>Price</th>
                            <th style={S.th}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o._id} style={{ borderBottom: "1px solid rgba(5,17,37,0.04)" }}>
                                <td style={S.td}>{o.userId?.name || "Anonymous"}</td>
                                <td style={S.td}>{o.serviceType}</td>
                                <td style={S.td}>
                                    <span style={{ ...S.badge, background: o.status === 'completed' ? '#f0fdf4' : '#fef2f2', color: o.status === 'completed' ? '#166534' : '#dc2626' }}>
                                        {o.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={S.td}>{o.price ? "₹" + o.price : "-"}</td>
                                <td style={S.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan="5" style={{...S.td, textAlign: "center", color: "#9ca3af"}}>No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );

    const renderMeasurements = () => {
        const ordersWithMeasurements = orders.filter(o => o.measurements && Object.keys(o.measurements).length > 0);
        return (
            <section className="td-animate" style={S.section}>
                <div style={S.sectionHeader}>
                    <div>
                        <h3 style={S.sectionTitle}>Measurement Book</h3>
                        <p style={S.sectionSub}>CLIENT PROFILES</p>
                    </div>
                </div>
                <div style={S.commGrid}>
                    {ordersWithMeasurements.map(o => (
                        <div key={o._id} style={S.commCard}>
                            <h4 style={S.commTitle}>{o.userId?.name || "Anonymous"}</h4>
                            <p style={S.commClient}>Date: {new Date(o.createdAt).toLocaleDateString()}</p>
                            <div style={S.detailMeasure}>
                                <div style={S.measureGrid}>
                                    {o.measurements.chest && <div style={S.measureCell}><span style={S.measureKey}>Chest</span><span style={S.measureVal}>{o.measurements.chest}</span></div>}
                                    {o.measurements.waist && <div style={S.measureCell}><span style={S.measureKey}>Waist</span><span style={S.measureVal}>{o.measurements.waist}</span></div>}
                                    {o.measurements.shoulders && <div style={S.measureCell}><span style={S.measureKey}>Shoulders</span><span style={S.measureVal}>{o.measurements.shoulders}</span></div>}
                                    {o.measurements.inseam && <div style={S.measureCell}><span style={S.measureKey}>Inseam</span><span style={S.measureVal}>{o.measurements.inseam}</span></div>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {ordersWithMeasurements.length === 0 && (
                        <div style={S.emptyState}>
                            <p style={S.emptyText}>No measurements found.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    };

    const renderFabrics = () => {
        const fabrics = [
            { id: 1, name: "Italian Wool", img: "https://images.unsplash.com/photo-1589781303964-f6df948a5293?q=80&w=2070&auto=format&fit=crop" },
            { id: 2, name: "Egyptian Cotton", img: "https://images.unsplash.com/photo-1585467381244-3101eb652bb2?q=80&w=2000&auto=format&fit=crop" },
            { id: 3, name: "Silk Blend", img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2000&auto=format&fit=crop" },
            { id: 4, name: "Premium Linen", img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" },
        ];
        return (
            <section className="td-animate" style={S.section}>
                <div style={S.sectionHeader}>
                    <div>
                        <h3 style={S.sectionTitle}>Fabric Gallery</h3>
                        <p style={S.sectionSub}>AVAILABLE MATERIALS</p>
                    </div>
                </div>
                <div style={S.commGrid}>
                    {fabrics.map(f => (
                        <div key={f.id} style={{ ...S.commCard, padding: 0, overflow: "hidden" }}>
                            <div style={{ height: "150px", overflow: "hidden" }}>
                                <img src={f.img} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ padding: "1rem" }}>
                                <h4 style={S.commTitle}>{f.name}</h4>
                                <p style={S.commClient}>In Stock</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const renderAnalytics = () => (
        <section className="td-animate" style={S.section}>
            <div style={S.sectionHeader}>
                <div>
                    <h3 style={S.sectionTitle}>Analytics</h3>
                    <p style={S.sectionSub}>PERFORMANCE OVERVIEW</p>
                </div>
            </div>
            <div style={S.statsRow}>
                <div style={S.statCard}>
                    <p style={S.statLabel}>TOTAL REVENUE</p>
                    <h4 style={S.statNum}>₹{totalRevenue.toLocaleString("en-IN")}</h4>
                </div>
                <div style={S.statCard}>
                    <p style={S.statLabel}>COMPLETED ORDERS</p>
                    <h4 style={S.statNum}>{completedOrders.length}</h4>
                </div>
                <div style={S.statCard}>
                    <p style={S.statLabel}>ACTIVE ORDERS</p>
                    <h4 style={S.statNum}>{activeOrders.length}</h4>
                </div>
            </div>
            <div style={{...S.card, marginTop: "2rem"}}>
                <p style={S.statLabel}>PERFORMANCE INSIGHTS</p>
                <div style={{ marginTop: "1rem", color: "#6b7280", fontSize: "0.85rem", lineHeight: "1.6" }}>
                    <p>• Your average completion time is 4.2 days.</p>
                    <p>• Highest demand is for <b>{orders.length > 0 ? orders[0].serviceType : "N/A"}</b>.</p>
                    <p>• 98% of your clients have rated you 5 stars.</p>
                </div>
            </div>
        </section>
    );

    const renderSettings = () => (
        <section className="td-animate" style={S.section}>
            <div style={S.sectionHeader}>
                <div>
                    <h3 style={S.sectionTitle}>Settings</h3>
                    <p style={S.sectionSub}>PROFILE & PREFERENCES</p>
                </div>
            </div>
            <div style={{...S.card, maxWidth: "600px"}}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={S.detailKey}>Full Name</label>
                    <input type="text" defaultValue="Master Tailor" style={{...S.searchInput, background: "#f6f3ed", padding: "0.8rem", borderRadius: "0.4rem", marginTop: "0.5rem"}} />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={S.detailKey}>Specialties</label>
                    <input type="text" defaultValue="Bespoke Suits, Traditional Wear" style={{...S.searchInput, background: "#f6f3ed", padding: "0.8rem", borderRadius: "0.4rem", marginTop: "0.5rem"}} />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={S.detailKey}>Contact Email</label>
                    <input type="email" defaultValue="tailor@darziatdoor.com" style={{...S.searchInput, background: "#f6f3ed", padding: "0.8rem", borderRadius: "0.4rem", marginTop: "0.5rem"}} />
                </div>
                <button style={S.acceptBtn}>SAVE CHANGES</button>
            </div>
        </section>
    );

    return (
        <>
        <InjectCSS />
        <div style={S.root}>
            {/* ══════════ LEFT SIDEBAR ══════════ */}
            <aside style={S.sidebar}>
                <div>
                    {/* Brand */}
                    <div style={S.brand}>
                        <h1 style={S.brandTitle}>The Digital<br/>Atelier</h1>
                        <p style={S.brandSub}>MASTER TAILOR</p>
                    </div>

                    {/* Nav */}
                    <nav style={S.nav}>
                        <div style={S.benchRow}>
                            <span style={S.benchEmoji}><Icons.Bench /></span>
                            <span style={S.benchLabel}>BENCH</span>
                            <span style={S.workshopLabel}>Workshop</span>
                        </div>
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                className="td-nav-item"
                                onClick={() => setActiveNav(item.key)}
                                style={{
                                    ...S.navItem,
                                    ...(activeNav === item.key ? S.navActive : {})
                                }}
                            >
                                {activeNav === item.key && <span style={S.navBar} />}
                                <span style={S.navDot}>
                                    <item.Icon />
                                </span>
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Footer */}
                <div style={S.sidebarFooter}>
                    <button className="td-new-comm" style={S.newCommBtn}>
                        NEW COMMISSION
                    </button>
                    <button style={S.footerLink} onClick={() => setActiveNav("settings")}><span style={{marginRight: "8px", verticalAlign: "middle"}}><Icons.Settings /></span> Settings</button>
                    <button style={S.footerLink} onClick={handleLogout}><span style={{marginRight: "8px", verticalAlign: "middle"}}><Icons.Support /></span> Support</button>
                </div>
            </aside>

            {/* ══════════ MAIN CONTENT ══════════ */}
            <main className="td-main" style={S.main}>
                {/* Top Bar */}
                <header style={S.topBar}>
                    <div style={S.topBarLeft}>
                        <span style={S.topBarLogo}>Atelier OS</span>
                        <div style={S.searchWrap}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input type="text" placeholder="Search commissions..." style={S.searchInput} />
                        </div>
                    </div>
                    <div style={S.topBarRight}>
                        <button style={S.iconBtn} title="Notifications">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            <span style={S.notifDot} />
                        </button>
                        <button style={S.iconBtn} title="Messages">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </button>
                        <button
                            onClick={toggleOnlineStatus}
                            style={{
                                ...S.statusPill,
                                background: isOnline ? "#dcfce7" : "#f3f4f6",
                                color: isOnline ? "#166534" : "#6b7280",
                                border: isOnline ? "1px solid #bbf7d0" : "1px solid #e5e7eb"
                            }}
                        >
                            <span style={{ ...S.statusDot, background: isOnline ? "#22c55e" : "#9ca3af" }} />
                            {isOnline ? "Online" : "Offline"}
                        </button>
                        <div style={S.avatar}>
                            <img
                                src="https://api.dicebear.com/7.x/initials/svg?seed=MT&backgroundColor=051125&textColor=e9c176"
                                alt="avatar"
                                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                            />
                        </div>
                    </div>
                </header>

                {activeNav === "workshop" && renderWorkshop()}
                {activeNav === "orders" && renderOrders()}
                {activeNav === "measurements" && renderMeasurements()}
                {activeNav === "fabrics" && renderFabrics()}
                {activeNav === "analytics" && renderAnalytics()}
                {activeNav === "settings" && renderSettings()}
            </main>

            {/* ══════════ RIGHT SIDEBAR ══════════ */}
            <aside className="td-right-sidebar" style={S.rightBar}>
                {/* Fit Profile Card */}
                <div style={S.fitCard}>
                    <div style={S.fitTop}>
                        <p style={S.fitLabel}>FIT PROFILE</p>
                        <span style={S.fitIcon}><Icons.Scissors /></span>
                    </div>
                    <h3 style={S.fitName}>Master Tailor</h3>
                    <div style={S.fitRows}>
                        <div style={S.fitRow}><span style={S.fitKey}>Active Orders</span><span style={S.fitVal}>{activeOrders.length}</span></div>
                        <div style={S.fitRow}><span style={S.fitKey}>Pending Review</span><span style={S.fitVal}>{pendingOrders.length}</span></div>
                        <div style={S.fitRow}><span style={S.fitKey}>Completed</span><span style={S.fitVal}>{completedOrders.length}</span></div>
                        <div style={S.fitRow}><span style={S.fitKey}>Total</span><span style={S.fitVal}>{orders.length}</span></div>
                    </div>
                    {orders.length > 0 && (
                        <div style={S.styleNotes}>
                            <p style={S.styleNotesTitle}>STYLE NOTES</p>
                            <p style={S.styleNotesText}>
                                "{activeOrders.length} active projects in the workshop. {pendingOrders.length} new commissions awaiting review."
                            </p>
                        </div>
                    )}
                </div>

                {/* Revenue Card */}
                <div style={S.revenueCard}>
                    <div style={S.revenueRow}>
                        <div style={S.revenueIconWrap}>
                            <Icons.Wallet />
                        </div>
                        <div>
                            <p style={S.revenueLabel}>WEEKLY REVENUE</p>
                            <p style={S.revenueVal}>₹{totalRevenue.toLocaleString("en-IN")}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div style={S.rightCard}>
                    <h4 style={S.rightCardTitle}>Quick Actions</h4>
                    <button className="td-quick-action" style={S.quickAction} onClick={() => navigate("/fabrics")}><span style={S.qaIcon}><Icons.Fabrics /></span> Fabric Library</button>
                    <button className="td-quick-action" style={S.quickAction} onClick={fetchOrders}><span style={S.qaIcon}><Icons.Refresh /></span> Refresh Orders</button>
                    <button className="td-quick-action" style={{ ...S.quickAction, color: "#dc2626", borderBottom: "none" }} onClick={handleLogout}><span style={S.qaIcon}><Icons.Logout /></span> Sign Out</button>
                </div>
            </aside>
        </div>
        </>
    );
};

/* ═══════════════════════════════════════════════════════════
   STYLES — modelled after the Atelier OS reference mock-up
   ═══════════════════════════════════════════════════════════ */
const S = {
    root: { display: "flex", minHeight: "100vh", background: "#fcf9f3", fontFamily: "'Manrope', sans-serif" },

    /* ── SIDEBAR ── */
    sidebar: {
        width: 220, minWidth: 220, background: "#051125", color: "#fff",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
        paddingTop: "1.75rem", paddingBottom: "1.5rem",
    },
    brand: { padding: "0 1.5rem 1.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    brandTitle: { fontFamily: "'Noto Serif', serif", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 4 },
    brandSub: { fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)" },

    nav: { padding: "1.25rem 0" },
    benchRow: { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0 1.5rem", marginBottom: "0.6rem" },
    benchEmoji: { color: "rgba(255,255,255,0.35)" },
    benchLabel: { fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)" },
    workshopLabel: { fontSize: "0.75rem", fontWeight: 600, color: "#e9c176", marginLeft: "0.25rem" },

    navItem: {
        position: "relative", display: "flex", alignItems: "center", gap: "0.65rem",
        width: "100%", padding: "0.6rem 1.5rem", background: "transparent", border: "none",
        color: "rgba(255,255,255,0.5)", fontFamily: "'Manrope', sans-serif", fontSize: "0.82rem",
        fontWeight: 500, cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
    },
    navActive: { color: "#e9c176", fontWeight: 700, background: "rgba(255,255,255,0.06)" },
    navBar: { position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, background: "#2b6954", borderRadius: "0 2px 2px 0" },
    navDot: { display: "flex", alignItems: "center", justifyContent: "center", width: 18, flexShrink: 0 },

    sidebarFooter: { padding: "0 1rem", display: "flex", flexDirection: "column", gap: "0.25rem" },
    newCommBtn: {
        width: "100%", padding: "0.8rem", background: "#2b6954", color: "#fff", border: "none",
        borderRadius: "0.4rem", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em",
        cursor: "pointer", fontFamily: "'Manrope', sans-serif", marginBottom: "0.5rem", transition: "background 0.2s",
    },
    footerLink: {
        background: "transparent", border: "none", color: "rgba(255,255,255,0.38)",
        fontSize: "0.78rem", cursor: "pointer", padding: "0.35rem 0.5rem", textAlign: "left",
        fontFamily: "'Manrope', sans-serif", transition: "color 0.2s", display: "flex", alignItems: "center",
    },

    /* ── MAIN ── */
    main: { flex: 1, marginLeft: 220, marginRight: 280, padding: "0 2.5rem 3rem", overflowY: "auto", minHeight: "100vh" },

    /* Top bar */
    topBar: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 0", borderBottom: "1px solid rgba(5,17,37,0.05)",
        position: "sticky", top: 0, background: "#fcf9f3", zIndex: 50,
    },
    topBarLeft: { display: "flex", alignItems: "center", gap: "1.25rem" },
    topBarLogo: { fontFamily: "'Noto Serif', serif", fontSize: "0.95rem", fontWeight: 600, color: "#051125" },
    searchWrap: {
        display: "flex", alignItems: "center", gap: "0.5rem",
        background: "#f0eee8", borderRadius: "0.4rem", padding: "0.5rem 1rem", minWidth: 200,
    },
    searchInput: {
        border: "none", background: "transparent", outline: "none",
        fontSize: "0.78rem", fontFamily: "'Manrope', sans-serif", color: "#051125", width: "100%",
    },
    topBarRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
    iconBtn: {
        position: "relative", background: "transparent", border: "none", cursor: "pointer",
        padding: "0.4rem", borderRadius: "0.35rem", display: "flex", alignItems: "center",
    },
    notifDot: { position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: "#e9c176" },
    statusPill: {
        display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.85rem",
        borderRadius: "2rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em",
        cursor: "pointer", fontFamily: "'Manrope', sans-serif", textTransform: "uppercase",
    },
    statusDot: { width: 7, height: 7, borderRadius: "50%" },
    avatar: { width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid #051125" },

    /* Greeting */
    greetingRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "2rem 0 2.5rem", gap: "2rem" },
    greetingLeft: {},
    overline: { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color: "#9ca3af", marginBottom: "0.35rem" },
    greeting: { fontFamily: "'Noto Serif', serif", fontSize: "2.1rem", fontWeight: 400, color: "#051125", lineHeight: 1.2, letterSpacing: "-0.02em" },
    statsRow: { display: "flex", gap: "0.75rem", flexShrink: 0 },
    statCard: { padding: "1.1rem 1.4rem", background: "#fff", borderRadius: "0.6rem", border: "1px solid rgba(5,17,37,0.06)", minWidth: 155 },
    statTop: { display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.2rem" },
    statNum: { fontFamily: "'Noto Serif', serif", fontSize: "2rem", fontWeight: 700, color: "#051125", lineHeight: 1 },
    statBadge: { fontSize: "0.55rem", fontWeight: 700, color: "#2b6954", letterSpacing: "0.05em" },
    statLabel: { fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", color: "#9ca3af" },

    /* Sections */
    section: { marginBottom: "2.5rem" },
    sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" },
    sectionTitle: { fontFamily: "'Noto Serif', serif", fontSize: "1.35rem", fontWeight: 400, color: "#051125", fontStyle: "italic", marginBottom: 3 },
    sectionSub: { fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", color: "#9ca3af" },
    viewAllBtn: {
        background: "transparent", border: "none", fontSize: "0.65rem", fontWeight: 700,
        letterSpacing: "0.08em", color: "#6b7280", cursor: "pointer", textDecoration: "underline",
        textUnderlineOffset: "3px", fontFamily: "'Manrope', sans-serif",
    },

    /* Commission cards */
    commGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" },
    commCard: {
        background: "#fff", borderRadius: "0.6rem", border: "1px solid rgba(5,17,37,0.06)",
        padding: "1.4rem", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    },
    commTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" },
    badge: { padding: "0.2rem 0.55rem", borderRadius: "0.25rem", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.08em" },
    timeAgo: { fontSize: "0.72rem", color: "#9ca3af" },
    commTitle: { fontFamily: "'Noto Serif', serif", fontSize: "1.1rem", fontWeight: 600, color: "#051125", marginBottom: "0.15rem" },
    commClient: { fontSize: "0.82rem", color: "#6b7280", marginBottom: "0.85rem" },
    commBottom: { display: "flex", alignItems: "center", gap: "0.5rem" },
    fabricChip: { display: "flex", alignItems: "center", gap: "0.4rem", flex: 1 },
    fabricSwatch: { width: 22, height: 22, borderRadius: "50%", background: "#1a1a1a", flexShrink: 0 },
    fabricName: { fontSize: "0.65rem", fontWeight: 700, color: "#374151", letterSpacing: "0.02em", textTransform: "uppercase" },
    detailsBtn: {
        background: "transparent", border: "1px solid rgba(5,17,37,0.12)", padding: "0.4rem 0.75rem",
        borderRadius: "0.35rem", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em",
        cursor: "pointer", fontFamily: "'Manrope', sans-serif", color: "#051125",
    },
    acceptBtn: {
        background: "#2b6954", color: "#fff", border: "none", padding: "0.45rem 0.95rem",
        borderRadius: "0.35rem", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em",
        fontFamily: "'Manrope', sans-serif", transition: "background 0.2s",
    },
    priceRow: {
        display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.75rem",
        background: "#f9f7f2", borderRadius: "0.35rem", padding: "0.1rem 0.5rem",
        border: "1px solid rgba(5,17,37,0.06)",
    },
    priceSign: { fontSize: "0.82rem", color: "#9ca3af", fontWeight: 600 },
    priceInput: {
        flex: 1, border: "none", background: "transparent", padding: "0.45rem 0",
        fontSize: "0.8rem", fontFamily: "'Manrope', sans-serif", outline: "none", color: "#051125",
    },
    detailsPanel: { marginTop: "0.85rem", padding: "1rem 1.1rem", background: "#f6f3ed", borderRadius: "0.5rem" },
    detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem 1.5rem" },
    detailKey: { display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", marginBottom: 2, textTransform: "uppercase" },
    detailVal: { display: "block", fontSize: "0.82rem", color: "#374151", fontWeight: 600 },
    detailMeasure: { marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(5,17,37,0.06)" },
    measureGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1.5rem", marginTop: "0.4rem" },
    measureCell: { display: "flex", justifyContent: "space-between" },
    measureKey: { fontSize: "0.78rem", color: "#6b7280" },
    measureVal: { fontSize: "0.82rem", fontWeight: 700, color: "#051125" },

    /* Queue */
    queueList: { display: "flex", flexDirection: "column", gap: "1rem" },
    queueCard: {
        background: "#fff", borderRadius: "0.6rem", border: "1px solid rgba(5,17,37,0.06)",
        padding: "1.5rem 2rem", transition: "border-color 0.3s",
    },
    queueTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.4rem" },
    queueTitle: { fontFamily: "'Noto Serif', serif", fontSize: "1.05rem", fontWeight: 600, color: "#051125", marginBottom: 2 },
    queueRef: { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: "#9ca3af" },
    duePill: {
        fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.06em", color: "#6b7280",
        padding: "0.3rem 0.7rem", borderRadius: "2rem", border: "1px solid rgba(5,17,37,0.08)",
    },

    /* Stages */
    stagesWrap: { marginBottom: "0.5rem" },
    stagesTrack: { position: "relative", height: 16, marginBottom: "0.4rem" },
    stagesLineBg: { position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#e5e7eb", transform: "translateY(-50%)" },
    stagesLineFill: { position: "absolute", top: "50%", left: 0, height: 2, background: "#2b6954", transform: "translateY(-50%)", transition: "width 0.5s ease", borderRadius: 1 },
    stageCol: { position: "absolute", top: "50%", transform: "translate(-50%, -50%)" },
    stageDot: { borderRadius: "50%", transition: "all 0.3s ease" },
    stagesLabels: { display: "flex", justifyContent: "space-between" },
    stageLabel: { fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.08em", textAlign: "center" },

    queueActions: { display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid rgba(5,17,37,0.05)" },
    queuePrice: { fontWeight: 700, fontSize: "0.95rem", color: "#051125", fontFamily: "'Noto Serif', serif" },
    completeBtn: {
        background: "#051125", color: "#fff", border: "none", padding: "0.55rem 1.1rem",
        borderRadius: "0.35rem", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em",
        cursor: "pointer", fontFamily: "'Manrope', sans-serif", transition: "background 0.2s", display: "flex", alignItems: "center", gap: "0.4rem",
    },
    cancelBtn: {
        background: "#fef2f2", color: "#dc2626", border: "none", padding: "0.55rem 1.1rem",
        borderRadius: "0.35rem", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em",
        cursor: "pointer", fontFamily: "'Manrope', sans-serif", display: "flex", alignItems: "center", gap: "0.4rem",
    },
    btnIcon: { display: "flex", alignItems: "center", justifyContent: "center" },
    completedRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(5,17,37,0.05)" },
    completedBadge: { fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em", color: "#2b6954", background: "#f0fdf4", padding: "0.3rem 0.7rem", borderRadius: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" },

    /* Empty state */
    emptyState: { padding: "3rem", textAlign: "center", background: "#fff", borderRadius: "0.6rem", border: "1px dashed rgba(5,17,37,0.1)" },
    emptyText: { fontFamily: "'Noto Serif', serif", fontStyle: "italic", color: "#6b7280", marginBottom: "0.3rem" },
    emptyHint: { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "#d1d5db" },

    /* ── RIGHT SIDEBAR ── */
    rightBar: {
        width: 280, minWidth: 280, position: "fixed", top: 0, right: 0, bottom: 0,
        padding: "1.25rem", overflowY: "auto", display: "flex", flexDirection: "column",
        gap: "0.85rem", background: "#f6f3ed", borderLeft: "1px solid rgba(5,17,37,0.05)",
    },

    /* Fit Profile */
    fitCard: {
        background: "#fff", borderRadius: "0.6rem", padding: "1.3rem",
        border: "1px solid rgba(5,17,37,0.06)", boxShadow: "0 4px 12px rgba(5,17,37,0.03)",
    },
    fitTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" },
    fitLabel: { fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.18em", color: "#9ca3af" },
    fitIcon: { color: "#051125" },
    fitName: { fontFamily: "'Noto Serif', serif", fontSize: "1.15rem", fontWeight: 700, color: "#051125", marginBottom: "1rem" },
    fitRows: { marginBottom: "0.85rem" },
    fitRow: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.45rem 0", borderBottom: "1px solid rgba(5,17,37,0.04)",
    },
    fitKey: { fontSize: "0.78rem", color: "#6b7280" },
    fitVal: { fontSize: "0.82rem", fontWeight: 700, color: "#051125" },
    styleNotes: { background: "#f0fdf4", borderRadius: "0.4rem", padding: "0.85rem" },
    styleNotesTitle: { fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.14em", color: "#2b6954", marginBottom: "0.35rem" },
    styleNotesText: { fontSize: "0.75rem", color: "#374151", lineHeight: 1.5, fontStyle: "italic" },

    /* Revenue */
    revenueCard: { background: "#fff", borderRadius: "0.6rem", padding: "1.1rem 1.3rem", border: "1px solid rgba(5,17,37,0.06)" },
    revenueRow: { display: "flex", alignItems: "center", gap: "0.85rem" },
    revenueIconWrap: {
        color: "#2b6954", width: 44, height: 44, background: "#f0fdf4",
        borderRadius: "0.4rem", display: "flex", alignItems: "center", justifyContent: "center",
    },
    revenueLabel: { fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", color: "#9ca3af", marginBottom: 2 },
    revenueVal: { fontFamily: "'Noto Serif', serif", fontSize: "1.3rem", fontWeight: 700, color: "#051125" },

    /* Right card */
    rightCard: { background: "#fff", borderRadius: "0.6rem", padding: "1.1rem 1.3rem", border: "1px solid rgba(5,17,37,0.06)" },
    rightCardTitle: {
        fontFamily: "'Noto Serif', serif", fontSize: "0.95rem", fontWeight: 600, color: "#051125",
        marginBottom: "0.75rem", paddingBottom: "0.6rem", borderBottom: "1px solid rgba(5,17,37,0.06)",
    },
    quickAction: {
        display: "block", width: "100%", background: "transparent", border: "none",
        padding: "0.55rem 0.25rem", fontSize: "0.8rem", cursor: "pointer",
        fontFamily: "'Manrope', sans-serif", color: "#374151", textAlign: "left",
        borderBottom: "1px solid rgba(5,17,37,0.04)", transition: "background 0.2s", borderRadius: "0.25rem",
        display: "flex", alignItems: "center",
    },
    qaIcon: { marginRight: "10px", display: "flex", alignItems: "center", color: "inherit" },

    /* New Styles */
    card: { background: "#fff", borderRadius: "0.6rem", border: "1px solid rgba(5,17,37,0.06)", padding: "1.5rem" },
    th: { padding: "1rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase" },
    td: { padding: "1rem", fontSize: "0.85rem", color: "#374151", fontWeight: 500 },
};

export default TailorDashboard;
