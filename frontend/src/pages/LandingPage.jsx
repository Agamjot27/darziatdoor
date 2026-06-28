import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  FiArrowRight, 
  FiScissors, 
  FiClock, 
  FiAward, 
  FiMapPin, 
  FiCalendar, 
  FiCheckCircle, 
  FiTruck, 
  FiSend, 
  FiShare2, 
  FiGlobe,
  FiStar,
  FiShoppingBag,
  FiUser
} from "react-icons/fi";
import API from "../api/api";

const heroBg = "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2000&auto=format&fit=crop";
const mensImg = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop";
const womensImg = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop";
const alterationsImg = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop";
const boutiqueInteriorImg = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop";

const defaultTailors = [
  { id: 1, name: "Aman Atelier", area: "Sector 17, Chandigarh", rating: "4.9", skills: "Suits, shirts, alterations", distance: "1.8 km" },
  { id: 2, name: "Noor Boutique", area: "Model Town, Ludhiana", rating: "4.8", skills: "Kurtas, dupattas, boutique sets", distance: "2.4 km" },
  { id: 3, name: "Kapoor Tailors", area: "Civil Lines, Delhi", rating: "4.7", skills: "Pants, formalwear, repairs", distance: "3.1 km" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Services");
  const [email, setEmail] = useState("");
  const [tailors, setTailors] = useState(defaultTailors);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Fetch live tailors if backend API is active
    API.get("/tailors/nearby")
      .then((r) => {
        if (r.data.tailors && r.data.tailors.length > 0) {
          const formatted = r.data.tailors.map((t) => ({
            id: t.id,
            name: t.user?.name || "Artisan Tailor",
            area: t.bio || "Local Artisan Workshop",
            rating: t.averageRating || "4.9",
            skills: (t.skills || ["Custom Stitching"]).join(", "),
            distance: t.distanceKm ? `${t.distanceKm} km` : "Nearby"
          }));
          setTailors(formatted);
        }
      })
      .catch(() => {
        // Fallback to initial top-rated artisan array
      });
  }, []);

  const handleBookingRedirect = (category) => {
    if (!token) {
      toast.info("Please log in or register to book your custom fitting session.");
      navigate("/login");
    } else {
      navigate("/dashboard", { state: { garmentType: category } });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "DarziAtDoor", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="bespoke-landing">
      {/* Top Navbar */}
      <header className="bespoke-nav">
        <div className="bespoke-nav-brand" onClick={() => navigate("/")}>
          DarziAtDoor
        </div>

        <nav className="bespoke-nav-links">
          {["Services", "Process", "Tailors", "Pricing"].map((item) => (
            <button
              key={item}
              className={`bespoke-nav-link ${activeNav === item ? "active" : ""}`}
              onClick={() => {
                setActiveNav(item);
                if (item === "Services") document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" });
                if (item === "Process") document.getElementById("process-section")?.scrollIntoView({ behavior: "smooth" });
                if (item === "Tailors") document.getElementById("tailors-section")?.scrollIntoView({ behavior: "smooth" });
                if (item === "Pricing") navigate("/pricing");
              }}
            >
              {item}
              {activeNav === item && <span className="active-pill" />}
            </button>
          ))}
        </nav>

        <div className="bespoke-nav-actions">
          {token ? (
            <button className="bespoke-btn-black" onClick={() => navigate(role === "tailor" ? "/tailor-dashboard" : "/dashboard")}>
              <FiUser style={{ marginRight: 6 }} /> My Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="bespoke-login-link">Login</Link>
              <button className="bespoke-btn-black" onClick={() => navigate("/login")}>
                Book Now
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="bespoke-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(249, 248, 246, 0.96) 0%, rgba(249, 248, 246, 0.85) 45%, rgba(249, 248, 246, 0.1) 100%), url(${heroBg})`
        }}
      >
        <div className="bespoke-hero-content">
          <span className="bespoke-kicker">DIGITAL ATELIER EXPERIENCE</span>
          <h1 className="bespoke-hero-title">
            Bespoke Elegance, <br />
            Delivered to Your Doorstep.
          </h1>
          <p className="bespoke-hero-desc">
            Premium tailoring services for Men and Women. Pickup, stitch, and deliver - all at the click of a button.
          </p>
          <div className="bespoke-hero-buttons">
            <button className="bespoke-btn-hero-primary" onClick={() => handleBookingRedirect("Suit")}>
              Book a Tailor <span className="scissors-icon">✂</span>
            </button>
            <button className="bespoke-btn-hero-secondary" onClick={() => navigate("/tailors")}>
              View Collections <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Black Feature Strip */}
      <div className="bespoke-feature-strip">
        <div className="feature-strip-item">
          <FiClock className="strip-icon" />
          <div>
            <strong>48-Hour Delivery</strong>
            <span>Express options for urgent fittings</span>
          </div>
        </div>
        <div className="feature-strip-item">
          <FiAward className="strip-icon" />
          <div>
            <strong>Expert Master Tailors</strong>
            <span>40+ years of heritage craftsmanship</span>
          </div>
        </div>
        <div className="feature-strip-item">
          <FiMapPin className="strip-icon" />
          <div>
            <strong>Free Home Visit</strong>
            <span>Professional measurement at your place</span>
          </div>
        </div>
      </div>

      {/* Tailoring Services Section */}
      <section className="bespoke-section" id="services-section">
        <div className="bespoke-section-header">
          <h2>Tailoring Services</h2>
          <p>Explore our range of bespoke services.</p>
        </div>

        <div className="services-grid">
          {/* Row 1 */}
          <div className="service-card dark-overlay-card" style={{ backgroundImage: `url(${mensImg})` }} onClick={() => handleBookingRedirect("Shirt")}>
            <div className="service-card-content">
              <h3>Men's Tailoring</h3>
              <span className="card-link">View Details ↗</span>
            </div>
          </div>

          <div className="service-card dark-overlay-card" style={{ backgroundImage: `url(${womensImg})` }} onClick={() => handleBookingRedirect("Kurta")}>
            <div className="service-card-content">
              <h3>Women's Tailoring</h3>
              <span className="card-link">View Details ↗</span>
            </div>
          </div>

          <div className="service-card dark-overlay-card" style={{ backgroundImage: `url(${alterationsImg})` }} onClick={() => handleBookingRedirect("Alteration")}>
            <div className="service-card-content">
              <h3>Alterations</h3>
              <span className="card-link">View Details ↗</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="service-card large-card dark-overlay-card" style={{ backgroundImage: `url(${boutiqueInteriorImg})` }} onClick={() => navigate("/dashboard")}>
            <div className="service-card-content">
              <h3>Bespoke Collection</h3>
              <p>Curated designs by our master artisans & ready-to-wear boutique rack.</p>
            </div>
          </div>

          <div className="service-card custom-design-card">
            <div className="custom-card-icon">
              <FiScissors />
            </div>
            <h3>Custom Designing</h3>
            <p>Have a dream outfit? Upload your sketch and let us bring it to life.</p>
            <button className="bespoke-btn-black-sm" onClick={() => handleBookingRedirect("Custom Design")}>
              Start Design
            </button>
          </div>
        </div>
      </section>

      {/* Tailors Network Section (Dual-mode functionality integration) */}
      <section className="bespoke-section" id="tailors-section" style={{ paddingTop: 0 }}>
        <div className="bespoke-section-header">
          <h2>Available Artisans Near You</h2>
          <p>Browse top-rated master tailors providing home visits & boutique garments.</p>
        </div>
        <div className="tailors-network-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {tailors.map((tailor) => (
            <div key={tailor.id} className="testimonial-card" style={{ marginTop: 0, cursor: "pointer" }} onClick={() => navigate("/tailors")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "Bodoni Moda, serif", fontSize: "20px", margin: "0 0 4px 0" }}>{tailor.name}</h3>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{tailor.area}</span>
                </div>
                <div style={{ background: "#fef08a", color: "#854d0e", padding: "4px 8px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiStar /> {tailor.rating}
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 16px 0", fontStyle: "normal" }}>Specialization: {tailor.skills}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#2563eb" }}>{tailor.distance}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Book Fitting →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bespoke-section how-it-works-bg" id="process-section">
        <div className="bespoke-section-header center">
          <h2>How It Works</h2>
          <p>Our seamless 3-step process ensures luxury is just a few clicks away.</p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-icon-circle">
              <FiCalendar />
            </div>
            <h3>1. Book a Visit</h3>
            <p>Schedule a time that works for you. Our tailor visits your home or office.</p>
          </div>

          <div className="step-item">
            <div className="step-icon-circle">
              <FiScissors />
            </div>
            <h3>2. Expert Measurement</h3>
            <p>Precise sizing and fabric selection by experts. We pickup your material or provide our own.</p>
          </div>

          <div className="step-item">
            <div className="step-icon-circle">
              <FiTruck />
            </div>
            <h3>3. Doorstep Delivery</h3>
            <p>Your bespoke outfit is delivered to your door in as little as 48 hours.</p>
          </div>
        </div>
      </section>

      {/* Testimonials & Press Section */}
      <section className="bespoke-section" id="portfolio-section">
        <div className="testimonials-layout">
          <div className="testimonials-left">
            <h2 className="section-serif-title">Loved by the discerning.</h2>
            
            <div className="testimonial-card">
              <p className="quote-text">
                "The fit was impeccable. I never knew getting a custom suit could be this effortless. DarziAtDoor has truly modernized the heritage of tailoring."
              </p>
              <div className="quote-author">
                <div className="author-avatar gold">AV</div>
                <div>
                  <strong>Alexandra Vance</strong>
                  <span>Creative Director, Vogue</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="quote-text">
                "Finally, a service that understands the value of time without compromising on the quality of a handmade garment."
              </p>
              <div className="quote-author">
                <div className="author-avatar blue">MT</div>
                <div>
                  <strong>Marcus Thorne</strong>
                  <span>Tech Entrepreneur</span>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonials-right">
            <div className="press-card">
              <h3>As Seen In</h3>
              <div className="press-logos">
                <span>VOGUE</span>
                <span>GQ</span>
                <span>Forbes</span>
                <span>BAZAAR</span>
              </div>
              <hr className="press-divider" />
              <p className="press-footer-text">Trusted by over 5,000+ bespoke clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bespoke-cta-banner">
        <h2>Ready to Experience Bespoke Luxury?</h2>
        <p>Join thousands of stylish professionals who trust DarziAtDoor for their wardrobe needs.</p>
        <button className="bespoke-btn-white-pill" onClick={() => handleBookingRedirect("Suit")}>
          Book Your First Visit
        </button>
      </section>

      {/* Footer */}
      <footer className="bespoke-footer">
        <div className="footer-main">
          <div className="footer-col brand-col">
            <div className="footer-brand">DarziAtDoor</div>
            <p>Crafting digital convenience with traditional artisanal heritage.</p>
            <button className="share-btn" onClick={handleShare} title="Share Link"><FiShare2 /></button>
          </div>

          <div className="footer-col">
            <h4>SERVICES</h4>
            <ul>
              <li><Link to="/dashboard">Men's Tailoring</Link></li>
              <li><Link to="/dashboard">Women's Tailoring</Link></li>
              <li><Link to="/dashboard">Bespoke Suits</Link></li>
              <li><Link to="/dashboard">Corporate Wear</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SUPPORT</h4>
            <ul>
              <li><Link to="/process">Measurement Guide</Link></li>
              <li><Link to="/process">Privacy Policy</Link></li>
              <li><Link to="/process">Terms of Service</Link></li>
              <li><Link to="/process">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col newsletter-col">
            <h4>NEWSLETTER</h4>
            <p>Subscribe to receive style updates and exclusive offers.</p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Thank you for subscribing!"); setEmail(""); }} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <button type="submit"><FiSend /></button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2024 DarziAtDoor. Crafted with precision.</div>
          <div className="footer-locales">
            <span><FiGlobe /> English</span>
            <span>📍 Delhi, NCR</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
