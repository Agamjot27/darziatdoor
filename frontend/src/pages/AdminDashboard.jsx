import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
    pending: { bg: "rgba(238,206,43,0.08)", color: "#b45309" },
    accepted: { bg: "rgba(43,105,84,0.08)", color: "#121613" },
    in_progress: { bg: "rgba(43,238,75,0.08)", color: "#166534" },
    completed: { bg: "rgba(43,238,75,0.12)", color: "#2bee4b" },
    rejected: { bg: "rgba(220,38,38,0.05)", color: "#dc2626" },
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (role !== "admin") {
            toast.error("Admin access only");
            navigate("/dashboard");
        }
    }, [role, navigate]);

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [tailors, setTailors] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [updatingOrder, setUpdatingOrder] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, tailorsRes] = await Promise.all([
                API.get("/admin/stats"),
                API.get("/admin/users"),
                API.get("/admin/tailors"),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data.users || []);
            setTailors(tailorsRes.data.tailors || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (role === "admin") fetchAll(); }, [role]);

    const updateOrderStatus = async (orderId, status) => {
        setUpdatingOrder(orderId);
        try {
            await API.put(`/admin/orders/${orderId}`, { status });
            toast.success(`Order updated to ${status}`);
            fetchAll();
        } catch {
            toast.error("Failed to update order");
        } finally {
            setUpdatingOrder(null);
        }
    };

    const deleteUser = async (userId, name) => {
        if (!window.confirm(`Delete user "${name}"? This will also remove all their orders.`)) return;
        try {
            await API.delete(`/admin/users/${userId}`);
            toast.success("User deleted");
            fetchAll();
        } catch {
            toast.error("Failed to delete user");
        }
    };

    const handleLogout = async () => {
        try { await API.post("/auth/logout"); } catch {}
        localStorage.clear();
        navigate("/login");
    };

    const tabs = ["overview", "orders", "users", "tailors"];

    if (role !== "admin") return null;

    return (
        <div style={{ minHeight: "100vh", background: "#fafffa", color: "#121613", fontFamily: "var(--font-twk-lausanne)", display: "flex" }}>
            {/* Sidebar */}
            <aside style={{ width: 220, background: "#121613", display: "flex", flexDirection: "column", padding: "1.75rem 0", position: "fixed", top: 0, bottom: 0, left: 0, borderRight: "1px solid rgba(18,22,19,0.1)" }}>
                <div style={{ padding: "0 1.5rem 1.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <p style={{ fontFamily: "var(--font-editorial-new)", fontSize: "1.35rem", fontWeight: 300, color: "#fafffa", margin: "0 0 0.25rem", lineHeight: 1.1 }}>Admin Console</p>
                    <p style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.2em", color: "#516254" }}>DARZIATDOOR</p>
                </div>
                <nav style={{ padding: "1rem 0", flex: 1 }}>
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            display: "block", width: "100%", padding: "0.65rem 1.5rem", background: activeTab === tab ? "rgba(255,255,255,0.04)" : "transparent",
                            border: "none", color: activeTab === tab ? "#2bee4b" : "rgba(250,255,250,0.5)",
                            textAlign: "left", fontSize: "0.82rem", fontWeight: activeTab === tab ? 550 : 350,
                            cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", letterSpacing: "0.02em",
                            borderLeft: activeTab === tab ? "3px solid #2bee4b" : "3px solid transparent",
                            transition: "all 0.2s",
                        }}>
                            {tab === "overview" ? "📊 Overview" : tab === "orders" ? "📋 Orders" : tab === "users" ? "👥 Users" : "✂️ Tailors"}
                        </button>
                    ))}
                </nav>
                <div style={{ padding: "0 1rem" }}>
                    <button onClick={() => navigate("/dashboard")} style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(250,255,250,0.6)", padding: "0.6rem", borderRadius: "10px", fontSize: "0.65rem", fontWeight: 550, cursor: "pointer", fontFamily: "inherit", marginBottom: "0.5rem" }}>
                        ← MAIN APP
                    </button>
                    <button onClick={handleLogout} style={{ width: "100%", background: "transparent", border: "none", color: "rgba(250,255,250,0.38)", fontSize: "0.65rem", fontWeight: 550, cursor: "pointer", fontFamily: "inherit" }}>
                        SIGN OUT
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ marginLeft: 220, flex: 1, padding: "2.5rem", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                    <div>
                        <p style={{ fontSize: "0.6rem", fontWeight: 550, letterSpacing: "0.2em", color: "#516254", margin: "0 0 0.3rem" }}>ADMIN CONSOLE</p>
                        <h1 style={{ fontFamily: "var(--font-editorial-new)", fontSize: "2.5rem", fontWeight: 300, color: "#121613", margin: 0, textTransform: "capitalize", lineHeight: 1.1 }}>
                            {activeTab}
                        </h1>
                    </div>
                    <button onClick={fetchAll} style={{ background: "transparent", border: "1px solid rgba(18,22,19,0.15)", color: "#121613", padding: "0.6rem 1.2rem", borderRadius: "10px", fontSize: "0.6rem", fontWeight: 550, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em" }}>
                        ↻ REFRESH
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "4rem", color: "#516254", fontStyle: "italic" }}>Loading data…</div>
                ) : (
                    <>
                        {/* ── OVERVIEW ── */}
                        {activeTab === "overview" && stats && (
                            <div className="reveal">
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
                                    {[
                                        { label: "TOTAL ORDERS", value: stats.totalOrders, icon: "📋" },
                                        { label: "CLIENTS", value: stats.totalUsers, icon: "👥" },
                                        { label: "TAILORS", value: stats.totalTailors, icon: "✂️" },
                                        { label: "TOTAL REVENUE", value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`, icon: "💰" },
                                    ].map((s) => (
                                        <div key={s.label} style={{ background: "#fafffa", borderRadius: "14px", padding: "1.5rem", border: "1px solid rgba(18,22,19,0.08)" }}>
                                            <p style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>{s.icon}</p>
                                            <p style={{ fontFamily: "var(--font-editorial-new)", fontSize: "2.2rem", fontWeight: 300, color: "#121613", margin: "0 0 0.25rem", lineHeight: 1 }}>{s.value}</p>
                                            <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.15em", color: "#516254", margin: 0 }}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                    {/* Orders by status */}
                                    <div style={{ background: "#fafffa", borderRadius: "14px", padding: "1.5rem", border: "1px solid rgba(18,22,19,0.08)" }}>
                                        <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.15em", color: "#516254", margin: "0 0 1rem" }}>ORDERS BY STATUS</p>
                                        {(stats.ordersByStatus || []).map((s) => (
                                            <div key={s.status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0", borderBottom: "1px solid rgba(18,22,19,0.05)" }}>
                                                <span style={{
                                                    padding: "0.2rem 0.6rem", borderRadius: "5px", fontSize: "0.6rem", fontWeight: 800,
                                                    background: STATUS_COLORS[s.status]?.bg || "rgba(18,22,19,0.05)",
                                                    color: STATUS_COLORS[s.status]?.color || "#516254",
                                                }}>
                                                    {s.status?.toUpperCase()}
                                                </span>
                                                <span style={{ fontWeight: 700, color: "#121613" }}>{s._count.status}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Recent orders */}
                                    <div style={{ background: "#fafffa", borderRadius: "14px", padding: "1.5rem", border: "1px solid rgba(18,22,19,0.08)" }}>
                                        <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.15em", color: "#516254", margin: "0 0 1rem" }}>RECENT ORDERS</p>
                                        {(stats.recentOrders || []).slice(0, 6).map((o) => (
                                            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0", borderBottom: "1px solid rgba(18,22,19,0.05)", fontSize: "0.78rem" }}>
                                                <div>
                                                    <p style={{ margin: 0, color: "#121613", fontWeight: 500 }}>{o.garmentType}</p>
                                                    <p style={{ margin: 0, color: "#516254", fontSize: "0.65rem" }}>{o.user?.name}</p>
                                                </div>
                                                <span style={{
                                                    padding: "0.15rem 0.5rem", borderRadius: "5px", fontSize: "0.55rem", fontWeight: 800,
                                                    background: STATUS_COLORS[o.status]?.bg || "rgba(18,22,19,0.05)",
                                                    color: STATUS_COLORS[o.status]?.color || "#516254",
                                                }}>
                                                    {o.status?.toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── ORDERS ── */}
                        {activeTab === "orders" && (
                            <div className="reveal" style={{ background: "#fafffa", borderRadius: "14px", border: "1px solid rgba(18,22,19,0.08)", overflow: "hidden" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid rgba(18,22,19,0.08)" }}>
                                            {["ID", "Client", "Garment", "Tailor", "Status", "Price", "Payment", "Action"].map((h) => (
                                                <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", color: "#516254", textTransform: "uppercase" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(stats?.recentOrders || []).map((o) => (
                                            <tr key={o.id} style={{ borderBottom: "1px solid rgba(18,22,19,0.05)" }}>
                                                <td style={{ padding: "1rem", fontSize: "0.78rem", color: "#516254" }}>#{String(o.id).slice(-5)}</td>
                                                <td style={{ padding: "1rem", fontSize: "0.82rem", color: "#121613" }}>{o.user?.name || "—"}</td>
                                                <td style={{ padding: "1rem", fontSize: "0.82rem", color: "#121613" }}>{o.garmentType}</td>
                                                <td style={{ padding: "1rem", fontSize: "0.78rem", color: "#516254" }}>{o.tailor?.user?.name || "Unassigned"}</td>
                                                <td style={{ padding: "1rem" }}>
                                                    <span style={{ padding: "0.2rem 0.55rem", borderRadius: "5px", fontSize: "0.55rem", fontWeight: 800, background: STATUS_COLORS[o.status]?.bg, color: STATUS_COLORS[o.status]?.color }}>
                                                        {o.status?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "1rem", fontSize: "0.78rem", color: "#121613" }}>{o.price ? `₹${o.price}` : "—"}</td>
                                                <td style={{ padding: "1rem" }}>
                                                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: o.paymentStatus === "paid" ? "#2bee4b" : "#516254" }}>
                                                        {(o.paymentStatus || "unpaid").toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "1rem" }}>
                                                    <select
                                                        value={o.status}
                                                        disabled={updatingOrder === o.id}
                                                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                        style={{ background: "transparent", color: "#121613", border: "none", borderBottom: "1px solid rgba(18,22,19,0.15)", padding: "0.3rem 0.5rem", fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit", outline: "none" }}
                                                    >
                                                        {["pending", "accepted", "in_progress", "completed", "rejected"].map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── USERS ── */}
                        {activeTab === "users" && (
                            <div className="reveal" style={{ background: "#fafffa", borderRadius: "14px", border: "1px solid rgba(18,22,19,0.08)", overflow: "hidden" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid rgba(18,22,19,0.08)" }}>
                                            {["Name", "Email", "Role", "Orders", "Joined", "Action"].map((h) => (
                                                <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", color: "#516254", textTransform: "uppercase" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} style={{ borderBottom: "1px solid rgba(18,22,19,0.05)" }}>
                                                <td style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 550, color: "#121613" }}>{u.name}</td>
                                                <td style={{ padding: "1rem", fontSize: "0.78rem", color: "#516254" }}>{u.email}</td>
                                                <td style={{ padding: "1rem" }}>
                                                    <span style={{ padding: "0.2rem 0.55rem", borderRadius: "5px", fontSize: "0.55rem", fontWeight: 800, background: u.role === "admin" ? "rgba(43,238,75,0.08)" : "rgba(18,22,19,0.05)", color: u.role === "admin" ? "#2bee4b" : "#516254" }}>
                                                        {u.role?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "1rem", fontSize: "0.82rem", color: "#516254" }}>{u._count?.orders || 0}</td>
                                                <td style={{ padding: "1rem", fontSize: "0.72rem", color: "#516254" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: "1rem" }}>
                                                    {u.role !== "admin" && (
                                                        <button onClick={() => deleteUser(u.id, u.name)} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "0.3rem 0.65rem", borderRadius: "5px", fontSize: "0.6rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                                                            DELETE
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── TAILORS ── */}
                        {activeTab === "tailors" && (
                            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1.5rem" }}>
                                {tailors.map((t) => (
                                    <div key={t.id} style={{ background: "#fafffa", borderRadius: "14px", padding: "1.5rem", border: "1px solid rgba(18,22,19,0.08)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                            <div>
                                                <p style={{ fontWeight: 700, color: "#121613", margin: "0 0 0.2rem", fontSize: "0.95rem" }}>{t.user?.name}</p>
                                                <p style={{ fontSize: "0.7rem", color: "#516254", margin: 0 }}>{t.user?.email}</p>
                                            </div>
                                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.isOnline ? "#2bee4b" : "#c8d2c8", display: "inline-block", flexShrink: 0, marginTop: 4 }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.78rem" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ color: "#516254" }}>Experience</span>
                                                <span style={{ color: "#121613", fontWeight: 600 }}>{t.experience ? `${t.experience} yrs` : "—"}</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ color: "#516254" }}>Orders</span>
                                                <span style={{ color: "#121613", fontWeight: 600 }}>{t._count?.orders || 0}</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ color: "#516254" }}>Avg Rating</span>
                                                <span style={{ color: "#121613", fontWeight: 700 }}>{t.averageRating ? `★ ${t.averageRating}` : "No reviews"}</span>
                                            </div>
                                            {t.skills?.length > 0 && (
                                                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                                                    {t.skills.slice(0, 3).map((s) => (
                                                        <span key={s} style={{ background: "rgba(18,22,19,0.05)", color: "#516254", padding: "0.2rem 0.5rem", borderRadius: "2rem", fontSize: "0.55rem", fontWeight: 700 }}>{s}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {tailors.length === 0 && (
                                    <div style={{ color: "#516254", fontStyle: "italic", padding: "2rem" }}>No tailors registered yet.</div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
