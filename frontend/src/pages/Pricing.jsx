import React from "react";
import { useNavigate, Link } from "react-router-dom";

const PricingContent = ({ navigate }) => {
    const categories = [
        {
            id: "suits",
            label: "CATEGORY I",
            title: "Bespoke Suits",
            price: "₹34,999",
            features: ["Half-canvas construction", "Premium wool blends", "2 Fittings included"],
            cta: "CONSULTATION",
            dark: false
        },
        {
            id: "shirts",
            label: "CATEGORY II",
            title: "Custom Shirts",
            price: "₹2,499",
            features: ["100% Egyptian cotton", "Hand-monogramming", "Custom collar & cuff styles"],
            cta: "SELECTION",
            dark: false
        },
        {
            id: "traditional",
            label: "CATEGORY III",
            title: "Traditional Wear",
            price: "₹19,999",
            features: ["Sherwanis & Bandhgalas", "Artisanal hand-embroidery", "Pashm linings"],
            cta: "EXPERIENCE",
            dark: true,
            signature: true
        },
        {
            id: "alterations",
            label: "CATEGORY IV",
            title: "Alterations",
            price: "₹499",
            features: ["Standard trouser tapering", "Jacket sleeve adjustment", "Original hem finishing"],
            cta: "BOOK VISIT",
            dark: false
        }
    ];

    const experiencePoints = [
        {
            title: "Elite Home Visit",
            desc: "A master tailor arrives at your doorstep, bringing the entire atelier to your living room.",
            icon: "location_home"
        },
        {
            title: "32-Point Measurement",
            desc: "Our proprietary measurement system captures every nuance of your posture and frame.",
            icon: "straighten"
        },
        {
            title: "Curated Fabric Selection",
            desc: "Access to over 1,000 swatches from the world's finest mills including Loro Piana and Zegna.",
            icon: "texture"
        },
        {
            title: "Lifetime Alterations",
            desc: "Our commitment doesn't end at delivery. We ensure your fit evolves as you do.",
            icon: "verified"
        }
    ];

    return (
        <div className="container-editorial py-20 animate-fade-in">
            {/* Header Section */}
            <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-32">
                <div className="lg:col-span-8">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#2b6954] mb-6 block">Investment in Excellence</span>
                    <h1 className="text-6xl md:text-8xl text-[#051125] font-serif italic leading-[1.1]">Sartorial Heritage & <br/>Transparent Value.</h1>
                </div>
                <div className="lg:col-span-4">
                    <p className="text-[#45474d] text-sm leading-relaxed font-body italic border-l-2 border-[#2b6954]/20 pl-6 mb-2">
                        We believe in clarity. Our pricing reflects the thousands of hand-stitches, the heritage of the fabric, and the precision of the cut.
                    </p>
                </div>
            </header>

            {/* Bespoke Experience Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-60">
                <div className="lg:col-span-6 relative">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative group">
                        <img 
                            src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" 
                            alt="Craftsmanship" 
                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000" 
                        />
                        <div className="absolute bottom-10 -right-10 bg-[#051125] p-10 text-white max-w-[280px] rounded-xl shadow-3xl">
                             <p className="font-serif italic text-2xl leading-tight">"Every stitch tells a story of heritage."</p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-6 space-y-16">
                    <h2 className="text-4xl text-[#051125] font-serif italic">The Bespoke Experience</h2>
                    <div className="space-y-10">
                        {experiencePoints.map((point) => (
                            <div key={point.title} className="flex gap-6 items-start">
                                <span className="material-symbols-outlined text-[#2b6954] text-3xl">{point.icon}</span>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-[#051125] tracking-tight">{point.title}</h3>
                                    <p className="text-xs text-[#45474d] font-body leading-relaxed max-w-sm">{point.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-60">
                {categories.map((cat) => (
                    <div 
                        key={cat.id} 
                        className={`p-10 rounded-2xl flex flex-col justify-between h-[550px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden ${cat.dark ? 'bg-[#051125] text-white shadow-xl' : 'bg-white border border-[#051125]/5 shadow-lg'}`}
                    >
                        {cat.signature && (
                             <div className="absolute top-6 right-6 px-3 py-1 bg-[#e9c176]/20 border border-[#e9c176]/30 text-[#e9c176] text-[8px] font-bold tracking-[0.2em] uppercase rounded-full">Signature</div>
                        )}
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <span className={`text-[9px] font-bold tracking-[0.3em] uppercase ${cat.dark ? 'text-white/40' : 'text-[#2b6954]'}`}>{cat.label}</span>
                                <h3 className="text-3xl font-serif italic">{cat.title}</h3>
                            </div>
                            <div className="space-y-1">
                                <span className={`text-[10px] uppercase tracking-widest font-bold ${cat.dark ? 'text-white/40' : 'text-[#45474d]/50'}`}>from</span>
                                <div className="text-4xl font-serif italic">{cat.price}</div>
                            </div>
                            <ul className="space-y-4 pt-6 opacity-80">
                                {cat.features.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-xs font-body leading-tight">
                                        <span className={`w-1.5 h-1.5 rounded-full ${cat.dark ? 'bg-[#e9c176]' : 'bg-[#2b6954]'}`}></span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={() => navigate('/login')} className={`w-full py-4 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${cat.dark ? 'bg-[#2b6954] text-white shadow-lg hover:shadow-[#2b6954]/20' : 'bg-white border border-[#051125]/10 text-[#051125] hover:bg-[#051125] hover:text-white'}`}>
                            {cat.cta}
                        </button>
                    </div>
                ))}
            </section>

            {/* Transparency Craft Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-60">
                 <div className="lg:col-span-7 space-y-8">
                    <h2 className="text-5xl text-[#051125] font-serif italic">Transparency in Craft</h2>
                    <p className="text-[#45474d] text-lg leading-relaxed font-body max-w-xl">
                        Unlike off-the-rack brands, our pricing is decoupled from mass-marketing. You pay for the time of the artisan, the density of the thread, and the longevity of the garment. No hidden surcharges for home visits within the metropolitan area.
                    </p>
                    <div className="flex flex-wrap gap-20 pt-8">
                        <div>
                            <div className="text-4xl font-serif italic text-[#051125]">0%</div>
                            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#45474d]/50">Marketing Markup</div>
                        </div>
                        <div>
                            <div className="text-4xl font-serif italic text-[#2b6954]">100%</div>
                            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#45474d]/50">Artisan-Direct</div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-5">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative bg-[#f6f3ed] flex items-center justify-center p-12">
                         <img src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2080&auto=format&fit=crop" alt="Precision" className="w-full h-full object-cover rounded-xl" />
                    </div>
                </div>
            </section>

             {/* Final CTA */}
             <section className="bg-[#051125] rounded-3xl p-24 text-center space-y-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
                <h2 className="text-6xl md:text-8xl text-white font-serif italic leading-[1.1] relative z-10">Begin Your <br/>Sartorial Journey.</h2>
                <p className="text-white/40 font-body text-sm relative z-10 max-w-md mx-auto">Your first consultation includes fabric browsing and a profile setup with no obligation.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                    <button onClick={() => navigate('/login')} className="bg-[#2b6954] text-white px-12 py-6 rounded-xl font-label font-bold text-sm tracking-[0.3em] uppercase shadow-2xl active:scale-95 transition-all">Schedule Home Visit</button>
                    <button onClick={() => navigate('/services')} className="bg-white/5 border border-white/10 text-white px-12 py-6 rounded-xl font-label font-bold text-sm tracking-[0.3em] uppercase hover:bg-white/10 transition-all">View Lookbook</button>
                </div>
            </section>
        </div>
    );
};

const Pricing = ({ asTab = false }) => {
    const navigate = useNavigate();

    if (asTab) {
        return <PricingContent navigate={navigate} />;
    }

    return (
        <div className="bg-[#fcf9f3] min-h-screen">
             <header className="fixed top-0 w-full flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto z-50 bg-[#fcf9f3]/80 backdrop-blur-xl border-b border-[#051125]/5">
                <div className="text-2xl font-serif italic text-[#051125]">DarziAtDoor</div>
                <nav className="hidden md:flex items-center gap-10">
                    <Link to="/" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Atelier</Link>
                    <Link to="/services" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Services</Link>
                    <Link to="/tailors" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Tailors</Link>
                    <Link to="/pricing" className="text-[#2b6954] font-bold border-b-2 border-[#2b6954] py-1 font-label text-sm tracking-widest uppercase">Pricing</Link>
                </nav>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/login')} className="bg-[#051125] text-white px-6 py-3 rounded-lg font-label font-bold text-xs tracking-widest uppercase shadow-xl shadow-[#051125]/10">
                        Book Appointment
                    </button>
                </div>
            </header>
            <main className="pt-32">
                <PricingContent navigate={navigate} />
            </main>
        </div>
    );
};

export { PricingContent };
export default Pricing;
