import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCheck, FiPackage, FiPlus, FiScissors, FiToggleLeft, FiToggleRight, FiTrash2 } from "react-icons/fi";
import API from "../api/api";

const emptyProduct = { name: "", category: "shirts", price: "", stock: "", description: "", image: "" };

function TailorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [pending, setPending] = useState([]);
  const [orders, setOrders] = useState([]);
  const [readymadeOrders, setReadymadeOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [product, setProduct] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try {
      const me = await API.get("/auth/me");
      setProfile(me.data.user.tailorProfile || null);
      const tailorId = me.data.user.tailorProfile?.id;
      await Promise.all([
        API.get("/orders/pending").then((r) => setPending(r.data || [])).catch(() => {}),
        API.get("/orders/tailor").then((r) => setOrders(r.data.orders || r.data || [])).catch(() => {}),
        API.get("/orders/readymade").then((r) => setReadymadeOrders(r.data.orders || [])).catch(() => {}),
        tailorId ? API.get(`/tailors/${tailorId}/products`).then((r) => setProducts(r.data.products || [])).catch(() => {}) : Promise.resolve(),
      ]);
    } catch {
      toast.error("Could not load tailor dashboard");
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const activeOrders = useMemo(() => orders.filter((order) => ["accepted", "in_progress"].includes(order.status)), [orders]);
  const revenue = useMemo(() => orders.filter((order) => order.status === "completed").reduce((sum, order) => sum + Number(order.price || 0), 0), [orders]);

  const toggleOnline = async () => {
    try {
      await API.put("/auth/tailor/status", { isOnline: !profile?.isOnline });
      setProfile((prev) => ({ ...(prev || {}), isOnline: !prev?.isOnline }));
      toast.success(!profile?.isOnline ? "You are online" : "You are offline");
    } catch {
      toast.error("Could not update availability");
    }
  };

  const acceptOrder = async (orderId) => {
    if (!quotes[orderId]) return toast.error("Add a quote first");
    try {
      await API.put(`/orders/accept/${orderId}`, { price: quotes[orderId] });
      toast.success("Booking accepted");
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not accept booking");
    }
  };

  const progressOrder = async (order, status) => {
    try {
      await API.patch(`/orders/${order.id || order._id}/status`, { status });
      toast.success("Booking updated");
      fetchAll();
    } catch {
      toast.error("Could not update booking");
    }
  };

  const updateReadymade = async (order, status) => {
    try {
      await API.patch(`/orders/readymade/${order.id}/status`, { status });
      toast.success("Readymade order updated");
      fetchAll();
    } catch {
      toast.error("Could not update readymade order");
    }
  };

  const addProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await API.post("/products", { ...product, images: product.image ? [product.image] : [] });
      setProduct(emptyProduct);
      toast.success("Product added");
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add product");
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("Product hidden");
    } catch {
      toast.error("Could not remove product");
    }
  };

  return (
    <div className="dad-page dad-app">
      <header className="dad-nav dad-nav-inline darkbar">
        <button className="dad-brand as-button" onClick={() => navigate("/")}>DarziAtDoor Vendor</button>
        <nav>
          <button onClick={toggleOnline}>{profile?.isOnline ? <FiToggleRight /> : <FiToggleLeft />} {profile?.isOnline ? "Online" : "Offline"}</button>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }}>Sign out</button>
        </nav>
      </header>

      <main className="dad-workspace">
        <section className="dad-dashboard-head tailor">
          <div><span className="dad-kicker dark">Tailor operating desk</span><h1>Bookings, boutique stock, and delivery statuses.</h1></div>
          <div className="dad-metric"><strong>{pending.length}</strong><span>New requests</span></div>
          <div className="dad-metric"><strong>{activeOrders.length}</strong><span>Active jobs</span></div>
          <div className="dad-metric"><strong>Rs {revenue}</strong><span>Completed revenue</span></div>
        </section>

        <section className="dad-grid-main tailor-grid">
          <div className="dad-stack">
            <section className="dad-panel">
              <div className="dad-section-head compact"><div><FiScissors /><h2>Incoming stitching bookings</h2></div></div>
              <div className="dad-request-grid">
                {pending.map((order) => (
                  <article className="dad-request" key={order.id || order._id}>
                    <span>{order.jobType || "standard"}</span>
                    <h3>{order.garmentType}</h3>
                    <p>{order.user?.name || "Customer"} requested {order.serviceType}</p>
                    <div className="dad-quote"><input type="number" placeholder="Quote" value={quotes[order.id || order._id] || ""} onChange={(e) => setQuotes({ ...quotes, [order.id || order._id]: e.target.value })} /><button onClick={() => acceptOrder(order.id || order._id)}>Accept</button></div>
                  </article>
                ))}
                {!pending.length && <p className="dad-empty">No pending bookings right now.</p>}
              </div>
            </section>

            <section className="dad-panel">
              <div className="dad-section-head compact"><div><FiCheck /><h2>Workshop queue</h2></div></div>
              <div className="dad-order-list">
                {orders.map((order) => (
                  <div className="dad-order vendor" key={order.id || order._id}>
                    <span>{order.status}</span><strong>{order.garmentType}</strong><em>Rs {order.price || "quote"}</em>
                    {order.status === "accepted" && <button onClick={() => progressOrder(order, "in_progress")}>Start</button>}
                    {order.status === "in_progress" && <button onClick={() => progressOrder(order, "completed")}>Complete</button>}
                  </div>
                ))}
                {!orders.length && <p className="dad-empty">Accepted stitching jobs will appear here.</p>}
              </div>
            </section>

            <section className="dad-panel">
              <div className="dad-section-head compact"><div><FiPackage /><h2>Readymade orders</h2></div></div>
              <div className="dad-order-list">
                {readymadeOrders.map((order) => (
                  <div className="dad-order vendor" key={order.id}>
                    <span>{order.status}</span><strong>{order.items?.length || 0} boutique items</strong><em>Rs {order.total}</em>
                    {order.status !== "delivered" && <button onClick={() => updateReadymade(order, order.status === "placed" ? "confirmed" : order.status === "confirmed" ? "packed" : order.status === "packed" ? "out_for_delivery" : "delivered")}>Next</button>}
                  </div>
                ))}
                {!readymadeOrders.length && <p className="dad-empty">Boutique orders will arrive here.</p>}
              </div>
            </section>
          </div>

          <aside className="dad-stack dad-sidebar">
            <section className="dad-panel dad-accent-panel">
              <FiPlus />
              <h2>Add boutique product</h2>
              <form className="dad-form" onSubmit={addProduct}>
                <input placeholder="Product name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
                <select value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })}><option>shirts</option><option>pants</option><option>kurtas</option><option>suits</option><option>dupatta</option><option>other</option></select>
                <input type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
                <input type="number" placeholder="Stock" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
                <input placeholder="Image URL" value={product.image} onChange={(e) => setProduct({ ...product, image: e.target.value })} />
                <textarea placeholder="Description" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
                <button className="dad-btn dad-btn-primary" disabled={saving}>{saving ? "Saving..." : "Add product"}</button>
              </form>
            </section>

            <section className="dad-panel">
              <h2>Boutique inventory</h2>
              <div className="dad-inventory">
                {products.map((item) => (
                  <div key={item.id}><strong>{item.name}</strong><span>Rs {item.price} / {item.stock} left</span><button onClick={() => removeProduct(item.id)}><FiTrash2 /></button></div>
                ))}
                {!products.length && <p className="dad-empty">Add your first rack item to start boutique sales.</p>}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default TailorDashboard;
