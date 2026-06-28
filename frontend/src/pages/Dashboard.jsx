import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMapPin, FiMinus, FiPlus, FiEdit3, FiScissors, FiShoppingBag, FiTruck } from "react-icons/fi";
import API from "../api/api";
import TailorDashboard from "./TailorDashboard";
import LiveTrackingMap from "../components/LiveTrackingMap";

const demoTailors = [
  {
    id: 1,
    user: { name: "Aman Atelier" },
    skills: ["suits", "shirts", "alterations"],
    averageRating: 4.9,
    distanceKm: 1.8,
    priceRangeMin: 699,
    priceRangeMax: 3499,
    products: [
      { id: 101, name: "White Oxford Shirt", category: "shirts", price: 1299, stock: 8, images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop"] },
      { id: 102, name: "Tailored Navy Trouser", category: "pants", price: 1799, stock: 4, images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop"] },
    ],
  },
  {
    id: 2,
    user: { name: "Noor Boutique" },
    skills: ["kurtas", "dupatta", "suits"],
    averageRating: 4.8,
    distanceKm: 2.4,
    priceRangeMin: 499,
    priceRangeMax: 2899,
    products: [
      { id: 201, name: "Cotton Kurta Set", category: "kurtas", price: 1499, stock: 6, images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=900&auto=format&fit=crop"] },
      { id: 202, name: "Block Print Dupatta", category: "dupatta", price: 699, stock: 12, images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop"] },
    ],
  },
];

const emptyBooking = { serviceType: "stitching", garmentType: "Shirt", date: "", measurementId: "", fabricProfile: "Cotton" };
const emptyMeasurement = { label: "Everyday Fit", chest: "", waist: "", hips: "", inseam: "", shoulder: "", sleeve: "", neck: "", notes: "" };

function Dashboard() {
  const role = localStorage.getItem("role");
  if (role === "tailor") return <TailorDashboard />;

  const navigate = useNavigate();
  const [tailors, setTailors] = useState(demoTailors);
  const [orders, setOrders] = useState([]);
  const [readymadeOrders, setReadymadeOrders] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [cart, setCart] = useState(null);
  const [booking, setBooking] = useState(emptyBooking);
  const [measurement, setMeasurement] = useState(emptyMeasurement);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedTailor, setSelectedTailor] = useState(null);

  const fetchAll = async () => {
    const requests = [
      API.get("/tailors/nearby").then((r) => setTailors(r.data.tailors?.length ? r.data.tailors : demoTailors)).catch(() => {}),
      API.get("/orders").then((r) => setOrders(r.data.orders || [])).catch(() => {}),
      API.get("/orders/readymade").then((r) => setReadymadeOrders(r.data.orders || [])).catch(() => {}),
      API.get("/measurements").then((r) => setMeasurements(r.data.measurements || [])).catch(() => {}),
      API.get("/cart").then((r) => setCart(r.data.cart)).catch(() => {}),
    ];
    await Promise.all(requests);
  };

  useEffect(() => { fetchAll(); }, []);

  const visibleTailors = useMemo(() => {
    if (selectedSpecialization === "all") return tailors;
    return tailors.filter((tailor) => (tailor.skills || []).includes(selectedSpecialization));
  }, [selectedSpecialization, tailors]);

  const products = useMemo(() => visibleTailors.flatMap((tailor) => (tailor.products || []).map((product) => ({ ...product, tailor }))), [visibleTailors]);
  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const setDemoCartItem = (product, quantityDelta = 1) => {
    const existingItems = Array.isArray(cart?.items) ? cart.items : [];
    const isDifferentTailor = cart?.tailorId && cart.tailorId !== product.tailor.id && existingItems.length > 0;
    if (isDifferentTailor && !window.confirm("Your cart has another tailor's products. Replace it?")) return;

    const baseItems = isDifferentTailor ? [] : existingItems;
    const nextItems = baseItems.some((item) => item.productId === product.id)
      ? baseItems.map((item) => item.productId === product.id ? { ...item, quantity: Math.max(0, item.quantity + quantityDelta) } : item).filter((item) => item.quantity > 0)
      : [...baseItems, { productId: product.id, name: product.name, quantity: Math.max(1, quantityDelta), price: product.price, image: product.images?.[0] || null }];

    setCart(nextItems.length ? { tailorId: product.tailor.id, tailor: product.tailor, items: nextItems, isDemo: true } : null);
    toast.success(quantityDelta > 0 ? "Added to cart" : "Cart updated");
  };
  const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const saveMeasurement = async (event) => {
    event.preventDefault();
    try {
      const res = await API.post("/measurements", measurement);
      setMeasurements((prev) => [res.data.measurement, ...prev]);
      setMeasurement(emptyMeasurement);
      toast.success("Measurement profile saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save measurements");
    }
  };

  const createBooking = async (event) => {
    event.preventDefault();
    try {
      await API.post("/orders", booking);
      setBooking(emptyBooking);
      toast.success("Stitching booking created");
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create booking");
    }
  };

  const addToCart = async (product) => {
    const isDemoProduct = product.id >= 100 || !Number.isInteger(product.id);
    if (isDemoProduct) {
      setDemoCartItem(product, 1);
      return;
    }

    try {
      const res = await API.post("/cart/add", { productId: product.id, quantity: 1 });
      setCart(res.data.cart);
      toast.success("Added to cart");
    } catch (error) {
      if (error.response?.status === 409 && window.confirm("Your cart has another tailor's products. Replace it?")) {
        const res = await API.post("/cart/add", { productId: product.id, quantity: 1, replaceCart: true });
        setCart(res.data.cart);
        toast.success("Cart switched to this tailor");
      } else if ([400, 404].includes(error.response?.status) || !error.response) {
        setDemoCartItem(product, 1);
      } else {
        toast.error(error.response?.data?.message || "Could not add item");
      }
    }
  };

  const placeReadymadeOrder = async () => {
    if (cart?.isDemo) {
      const demoOrder = {
        id: `demo-${Date.now()}`,
        type: "Readymade",
        items: cart.items,
        total: cartTotal,
        status: "placed",
        createdAt: new Date().toISOString(),
      };
      setReadymadeOrders((prev) => [demoOrder, ...prev]);
      setCart(null);
      toast.success("Readymade order placed");
      return;
    }

    try {
      await API.post("/orders/readymade", { deliveryAddress: { line1: "Home", city: "Local", pincode: "000000" } });
      setCart(null);
      toast.success("Readymade order placed");
      fetchAll();
    } catch (error) {
      if ([400, 404].includes(error.response?.status) && cartItems.length) {
        setReadymadeOrders((prev) => [{ id: `demo-${Date.now()}`, type: "Readymade", items: cartItems, total: cartTotal, status: "placed" }, ...prev]);
        setCart(null);
        toast.success("Readymade order placed");
      } else {
        toast.error(error.response?.data?.message || "Checkout failed");
      }
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (cart?.isDemo) {
      const nextItems = cartItems.map((item) => item.productId === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
      setCart(nextItems.length ? { ...cart, items: nextItems } : null);
      return;
    }

    try {
      const res = await API.put(`/cart/item/${productId}`, { quantity });
      setCart(res.data.cart);
    } catch {
      const nextItems = cartItems.map((item) => item.productId === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
      setCart(nextItems.length ? { ...(cart || {}), items: nextItems, isDemo: true } : null);
    }
  };

  return (
    <div className="dad-page dad-customer-shell">
      <header className="dad-lux-nav">
        <button className="dad-lux-brand" onClick={() => navigate("/")}>DarziAtDoor</button>
        <nav>
          <button className="active">Dashboard</button>
          <button onClick={() => document.getElementById("orders")?.scrollIntoView({ behavior: "smooth" })}>My Orders</button>
          <button onClick={() => document.getElementById("boutique")?.scrollIntoView({ behavior: "smooth" })}>Boutique</button>
          <button onClick={() => document.getElementById("measurements")?.scrollIntoView({ behavior: "smooth" })}>Measurements</button>
        </nav>
        <div className="dad-lux-actions">
          <button title="Notifications">bell</button>
          <button title="Cart">bag</button>
          <button className="dad-lux-avatar" onClick={() => { localStorage.clear(); navigate("/login"); }}>S</button>
        </div>
      </header>

      <main className="dad-lux-layout">
        <div className="dad-lux-main">
          <section className="dad-lux-hero-row">
            <div>
              <p className="dad-lux-kicker">Customer Command Center</p>
              <h1>Welcome back,<br /><span>Siddharth</span></h1>
            </div>
            <div className="dad-lux-stats">
              <article><strong>{orders.length + readymadeOrders.length}</strong><span>Total Orders</span></article>
              <article><strong>{measurements.length}</strong><span>Fit Profiles</span></article>
            </div>
          </section>

          <section className="dad-lux-map-card">
            <LiveTrackingMap orders={orders} loading={false} />
            <div className="dad-lux-map-footer">
              <span>Current Action: Fabric pickup and final measurements</span>
              <button type="button">Contact Artisan</button>
            </div>
          </section>

          <section className="dad-lux-section">
            <div className="dad-lux-section-head">
              <h2>Nearby tailors</h2>
              <div className="dad-lux-filter-row">
                {["all", "suits", "shirts", "kurtas", "alterations"].map((item) => (
                  <button key={item} className={selectedSpecialization === item ? "active" : ""} onClick={() => setSelectedSpecialization(item)}>{item}</button>
                ))}
              </div>
            </div>
            <div className="dad-lux-tailors">
              {visibleTailors.map((tailor, index) => (
                <button className="dad-lux-tailor-card" key={tailor.id} onClick={() => setSelectedTailor(tailor)}>
                  <span className={index % 2 ? "gold" : "red"}>{tailor.user?.name?.slice(0, 1) || "T"}</span>
                  <div>
                    <strong>{tailor.user?.name}</strong>
                    <small>{(tailor.skills || []).join(" / ")}</small>
                  </div>
                  <em>{tailor.distanceKm ? `${tailor.distanceKm} km` : "nearby"}</em>
                </button>
              ))}
            </div>
          </section>

          <section className="dad-lux-section" id="boutique">
            <div className="dad-lux-section-head">
              <h2>Boutique rack</h2>
              <button className="dad-lux-link" type="button">View All Collection</button>
            </div>
            <div className="dad-lux-products">
              {products.map((product) => (
                <article className="dad-lux-product-card" key={`${product.tailor.id}-${product.id}`}>
                  <div className="dad-lux-product-image">
                    <img src={product.images?.[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop"} alt={product.name} />
                  </div>
                  <div className="dad-lux-product-body">
                    <p>{product.tailor.user?.name}</p>
                    <h3>{product.name}</h3>
                    <footer><strong>Rs {product.price}</strong><button onClick={() => addToCart(product)}>+</button></footer>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="dad-lux-section" id="orders">
            <h2>Order history</h2>
            <div className="dad-lux-orders">
              {[...orders.map((o) => ({ ...o, type: "Stitching" })), ...readymadeOrders.map((o) => ({ ...o, type: "Readymade", garmentType: `${o.items?.length || 0} items` }))].slice(0, 8).map((order) => {
                const orderId = order.id || order._id;
                return (
                  <div className="dad-lux-order-row" key={`${order.type}-${orderId}`}>
                    <div><span className={order.status === "rejected" ? "danger" : ""}>{order.type}</span><strong>{order.garmentType || order.serviceType}</strong></div>
                    <em>{order.status}</em>
                    {order.type === "Stitching" && orderId ? <button onClick={() => navigate(`/track/${orderId}`)}>Track</button> : <button>Invoice</button>}
                  </div>
                );
              })}
              {!orders.length && !readymadeOrders.length && <p className="dad-empty">No orders yet. Book stitching or checkout boutique products to start.</p>}
            </div>
          </section>
        </div>

        <aside className="dad-lux-sidebar">
          <section className="dad-lux-booking">
            <div className="dad-lux-booking-icon"><FiScissors /></div>
            <h2>Book custom stitching</h2>
            <form onSubmit={createBooking} className="dad-lux-dark-form">
              <label>Item Category<select value={booking.garmentType} onChange={(e) => setBooking({ ...booking, garmentType: e.target.value })}><option>Shirt</option><option>Trousers</option><option>Pant</option><option>Kurta</option><option>Suit</option><option>Alteration</option></select></label>
              <label>Preferred Date<input type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} required /></label>
              <label>Measurements<select value={booking.measurementId} onChange={(e) => setBooking({ ...booking, measurementId: e.target.value })}><option value="">Attach measurements later</option>{measurements.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
              <label>Fabric Type<input placeholder="Cotton, Linen, Silk..." value={booking.fabricProfile} onChange={(e) => setBooking({ ...booking, fabricProfile: e.target.value })} /></label>
              <button>Create booking</button>
            </form>
          </section>

          <section className="dad-lux-measure" id="measurements">
            <div className="dad-lux-side-head"><h2>Measurements</h2><button type="button">Edit</button></div>
            <div className="dad-lux-fit-card"><strong>{measurement.label || "Everyday Fit"}</strong><span>ACTIVE</span><div><i style={{ width: `${measurements.length ? 85 : 45}%` }} /></div><p>{measurements.length ? "Saved fit profile ready for reuse." : "Add measurements for precision."}</p></div>
            <form onSubmit={saveMeasurement} className="dad-lux-measure-form">
              {[
                ["chest", "Chest (cm)"], ["waist", "Waist (cm)"], ["hips", "Hips (cm)"], ["inseam", "Inseam (cm)"]
              ].map(([field, label]) => <label key={field}>{label}<input type="number" step="0.1" placeholder="--" value={measurement[field]} onChange={(e) => setMeasurement({ ...measurement, [field]: e.target.value })} /></label>)}
              <button>Save fit profile</button>
            </form>
          </section>

          <section className="dad-lux-cart">
            <h2>Cart</h2>
            {cartItems.map((item) => (
              <div className="dad-lux-cart-row" key={item.productId}><strong>{item.name}</strong><span>Rs {item.price}</span><div><button onClick={() => updateCartItem(item.productId, item.quantity - 1)}><FiMinus /></button>{item.quantity}<button onClick={() => updateCartItem(item.productId, item.quantity + 1)}><FiPlus /></button></div></div>
            ))}
            {!cartItems.length && <p>Boutique items stay saved in your account for 24 hours.</p>}
            {!!cartItems.length && <><div className="dad-lux-total"><span>Total</span><strong>Rs {cartTotal}</strong></div><button className="dad-lux-checkout" onClick={placeReadymadeOrder}>Checkout</button></>}
          </section>
        </aside>
      </main>

      {selectedTailor && <div className="dad-modal" onClick={() => setSelectedTailor(null)}><div onClick={(e) => e.stopPropagation()}><button onClick={() => setSelectedTailor(null)}>Close</button><h2>{selectedTailor.user?.name}</h2><p>{selectedTailor.bio || "Available for custom stitching and boutique delivery."}</p><strong>{selectedTailor.averageRating || "New"} rating</strong><span>{(selectedTailor.skills || []).join(" / ")}</span></div></div>}
    </div>
  );
}

export default Dashboard;





