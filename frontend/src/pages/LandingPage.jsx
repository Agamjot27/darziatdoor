import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ServicesContent } from "./Services";
import { TailorShowcaseContent } from "./TailorShowcase";
import { PricingContent } from "./Pricing";
import { ProcessContent } from "./Process";

const AtelierContent = ({ navigate }) => (
  <>
    {/* Hero Section */}
    <section className="relative min-h-[80vh] flex items-center px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#051125] to-[#1b263b] opacity-[0.03]"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-screen-2xl mx-auto relative z-10">
        <div className="lg:col-span-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#adedd3]/30 text-[#2b6954] rounded-full">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span className="font-label text-xs font-bold tracking-[0.2em] uppercase">The Bespoke Experience</span>
          </div>
          <h1 className="text-6xl md:text-8xl text-[#051125] leading-[1.1] tracking-tight font-serif italic font-medium">
            Couture, <br/><span className="not-italic font-normal">at your doorstep.</span>
          </h1>
          <p className="text-[#45474d] text-lg md:text-xl max-w-md font-body leading-relaxed">
            Experience the luxury of professional tailoring without leaving your home. Our master artisans bring the atelier to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#051125] text-white px-10 py-5 rounded-lg font-label font-extrabold text-sm tracking-widest uppercase transition-all hover:shadow-2xl hover:shadow-[#051125]/20"
            >
              Book Now
            </button>
            <button 
              onClick={() => navigate('/express')}
              className="group flex items-center gap-3 px-8 py-5 text-[#051125] font-label font-bold text-sm tracking-widest uppercase transition-all"
            >
              Express Dispatch
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_right_alt</span>
            </button>
          </div>
        </div>
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] w-full rounded-xl overflow-hidden shadow-2xl relative">
            <img 
              alt="Luxury fabric" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdlteJMpj1oDAOTK7akyVPu0cIysKkd_Qof5MYERKXDP7F9vsjZ6FwkC4jSncpRTERkVnnxUNfE4IVpna8-OdDpwq9UdOl8g5Ib3Qm1yyUS-Nhva8d9aSTJ6AgQbvW73_tDQ6IX4Cm_haQXA5lA6Qtn-e8qBQbofpB6kkqq2YrjqgCcJMzcM6NMtrlXko1XOGjlkkFry2NOw6F96HyhAP_zl10NKW8XA9LQMQhPbnzWb14OtVvjJ7HyWyaT_Z9QDg3qrofVnnOm1g" 
            />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#adedd3] flex items-center justify-center text-[#2b6954]">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-[#051125]">Master Artisan Guarantee</p>
                  <p className="text-xs font-label uppercase tracking-widest text-[#45474d]">25+ Years of Craftsmanship</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 border-[full] border-[#2b6954]/5 rounded-full -z-10"></div>
        </div>
      </div>
    </section>

    {/* Services Bento Grid */}
    <section className="py-24 px-8 md:px-16 bg-[#f6f3ed]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="font-label text-xs font-bold tracking-[0.3em] uppercase text-[#2b6954] mb-4 block">Our Services</span>
            <h2 className="text-4xl md:text-5xl text-[#051125] leading-tight font-serif italic">Elevated craftsmanship for every occasion.</h2>
          </div>
          <p className="font-body text-[#45474d] max-w-sm mb-2">
            From ceremonial ensembles to power suits, our tailors ensure every stitch tells a story of perfection.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="aspect-square md:aspect-auto md:h-full w-full">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqDr6rJEAmiY-PuXqAadErJ7Nmui-xoK2lmhJ9-qgtJUZnZfq89Q_rZH8zmrkzQfxA4fvX1Ov53zt5h_jaLZXk2OTB4Jf8JTAoOHokTIZoBYms4TAzHlWPaqiz_qotpv00A6DuXJQUlFs81W5Xuclv0mRZ_s02IPliDDvHBBEUggWIFwK6oC5NGQfV1ipq1r4wa2i5vjRbFfbygI9LCFYtOAWf6Vx1CIleogVWpO5JR-xhjFbr0KyVv_Yk0e-2YdvOKkO_N8VuENo" alt="Bespoke Suit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#051125]/80 via-[#051125]/20 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 p-8 text-white">
                  <h3 className="text-3xl mb-2 font-serif italic">Bespoke Suits</h3>
                  <p className="text-white/80 font-body text-sm max-w-xs mb-6">Masterfully crafted to your unique silhouette using premium Italian wools.</p>
                  <button onClick={() => navigate('/login')} className="bg-white text-[#051125] px-6 py-3 rounded-lg font-label font-bold text-xs tracking-widest uppercase">Explore</button>
                </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-white p-8 flex flex-col justify-between h-[300px] shadow-sm">
                <div>
                  <span className="material-symbols-outlined text-[#2b6954] text-4xl mb-6">straighten</span>
                  <h3 className="text-xl text-[#051125] mb-2 font-serif italic">Home Measurement</h3>
                  <p className="text-[#45474d] text-sm font-body">Complimentary measurement sessions at your convenience.</p>
                </div>
                <span className="material-symbols-outlined self-end text-[#c5c6cd] group-hover:text-[#2b6954] transition-colors">north_east</span>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-white p-8 flex flex-col justify-between h-[300px] shadow-sm">
                <div>
                  <span className="material-symbols-outlined text-[#2b6954] text-4xl mb-6">fabric</span>
                  <h3 className="text-xl text-[#051125] mb-2 font-serif italic">Fabric Selection</h3>
                  <p className="text-[#45474d] text-sm font-body">Browse 500+ premium fabrics from world-renowned mills.</p>
                </div>
                <span className="material-symbols-outlined self-end text-[#c5c6cd] group-hover:text-[#2b6954] transition-colors">north_east</span>
          </div>
          <div className="md:col-span-2 group relative overflow-hidden rounded-xl bg-[#051125] text-white p-8 flex flex-col md:flex-row items-center gap-8 h-[300px]">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-serif italic">Alteration Services</h3>
                  <p className="text-white/70 text-sm font-body">Breathe new life into your existing wardrobe with precision alterations.</p>
                  <button onClick={() => navigate('/login')} className="text-[#e9c176] font-label font-bold text-xs tracking-widest uppercase border-b border-[#e9c176]/30 pb-1">Book Pickup</button>
                </div>
                <div className="hidden md:block w-48 h-full bg-white/5 rounded-lg rotate-12 -mr-12 backdrop-blur-sm p-4 text-white/20">
                    <span className="material-symbols-outlined text-6xl">content_cut</span>
                </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Atelier");

    return (
        <div className="bg-[#fcf9f3] text-[#1c1c18] min-h-screen font-body selection:bg-[#adedd3] selection:text-[#2b6954]">
            {/* Nav Header */}
            <header className="fixed top-0 w-full flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto z-50 bg-[#fcf9f3]/80 backdrop-blur-xl border-b border-[#051125]/5">
                <div className="text-2xl font-serif italic text-[#051125]">DarziAtDoor</div>
                <nav className="hidden md:flex items-center gap-10">
                    {["Atelier", "Services", "Tailors", "Process", "Pricing"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab ? "text-[#2b6954] font-bold border-b-2 border-[#2b6954]" : "text-[#051125]/70 font-medium hover:text-[#2b6954]"} py-1 font-label text-sm tracking-widest uppercase transition-all duration-300`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4 text-[#051125]/60 font-label text-xs font-bold tracking-widest uppercase">
                        <Link to="/login" className="hover:text-[#2b6954] transition-colors">Sign In</Link>
                    </div>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-[#051125] text-white px-6 py-3 rounded-lg font-label font-bold text-xs tracking-widest uppercase transition-transform active:scale-95 shadow-xl shadow-[#051125]/10"
                    >
                        Book Measurement
                    </button>
                </div>
            </header>

            <main className="pt-24 min-h-screen">
                <div className="animate-fade-in transition-all duration-500">
                    {activeTab === "Atelier" && <AtelierContent navigate={navigate} />}
                    {activeTab === "Services" && <ServicesContent navigate={navigate} />}
                    {activeTab === "Tailors" && <TailorShowcaseContent navigate={navigate} />}
                    {activeTab === "Pricing" && <PricingContent navigate={navigate} />}
                    {activeTab === "Process" && <ProcessContent navigate={navigate} />}
                    {activeTab !== "Atelier" && activeTab !== "Services" && activeTab !== "Tailors" && activeTab !== "Pricing" && activeTab !== "Process" && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#051125]/40 p-20 space-y-4">
                            <span className="material-symbols-outlined text-6xl animate-pulse">construction</span>
                            <div className="font-serif italic text-2xl text-center">
                                Crafting the {activeTab} Experience...
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-[#051125] text-white py-24 px-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2b6954] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 relative z-10">
                    <div className="space-y-6">
                        <div className="text-3xl font-serif italic">DarziAtDoor</div>
                        <p className="text-white/50 text-sm max-w-xs leading-relaxed font-body">The Digital Atelier. Bridging the gap between traditional craftsmanship and modern convenience.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-12 font-label text-[10px] font-bold tracking-[0.3em] uppercase marker:text-[#2b6954]">
                        <span className="hover:text-[#adedd3] transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-[#adedd3] transition-colors cursor-pointer">Terms of Craft</span>
                        <span className="hover:text-[#adedd3] transition-colors cursor-pointer">Artisan Portal</span>
                    </div>
                    <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/30">© 2024 DARZI AT DOOR. <br/>ALL THREADS RESERVED.</div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
