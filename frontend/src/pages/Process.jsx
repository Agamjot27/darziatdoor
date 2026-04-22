import React from "react";
import { useNavigate, Link } from "react-router-dom";

const ProcessContent = ({ navigate }) => {
    const steps = [
        {
            num: "01",
            title: "The Discovery",
            desc: "Your journey begins with an Elite Home Visit. Our master stylist arrives at your doorstep with over 1,000 premium fabric swatches, helping you curate a wardrobe that reflects your status.",
            icon: "event_upcoming",
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop"
        },
        {
            num: "02",
            title: "The Blueprint",
            desc: "Precision is our religion. We capture 32 unique anatomical measurements and take posture photographs to create a digital chassis of your silhouette.",
            icon: "straighten",
            image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2080&auto=format&fit=crop",
            reverse: true
        },
        {
            num: "03",
            title: "The Heritage",
            desc: "From Scabal to Loro Piana, we source the finest wools and silks. Each fabric is decanted and rested for 24 hours before the first cut is made.",
            icon: "texture",
            image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
        },
        {
            num: "04",
            title: "The Craft",
            desc: "Our master artisans in the atelier spend 40+ hours on each garment. Every buttonhole is hand-sewn, and every floating canvas is stitched by hand using horsehair.",
            icon: "content_cut",
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop",
            reverse: true
        },
        {
            num: "05",
            title: "The Finality",
            desc: "We return for a final fitting. Only when every line is absolute and every drape is perfect do we hand over the masterpiece in our signature garment bag.",
            icon: "verified",
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop"
        }
    ];

    return (
        <div className="container-editorial py-20 pb-40 space-y-40">
            {/* Process Hero */}
            <header className="text-center space-y-6 max-w-4xl mx-auto mb-60">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#2b6954] block">How We Create</span>
                <h1 className="text-7xl md:text-9xl text-[#051125] font-serif italic leading-none">The Sartorial<br/>Journey</h1>
                <p className="text-[#45474d] text-base font-body leading-relaxed max-w-xl mx-auto opacity-70">
                    Bespoke is not a product, it is a relationship. Discover the five phases of craftsmanship that define the DarziAtDoor standard.
                </p>
                <div className="pt-10 flex justify-center">
                    <div className="w-px h-24 bg-[#051125]/10"></div>
                </div>
            </header>

            {/* Step-by-Step Sections */}
            <div className="space-y-40 lg:space-y-80">
                {steps.map((step) => (
                    <section key={step.num} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center`}>
                        <div className={`lg:col-span-6 space-y-10 ${step.reverse ? 'lg:order-2' : ''}`}>
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-serif italic text-[#2b6954]/40">{step.num}</span>
                                <div className="h-px flex-1 bg-[#051125]/5"></div>
                            </div>
                            <div className="space-y-6">
                                <span className="material-symbols-outlined text-[#2b6954] text-5xl">{step.icon}</span>
                                <h2 className="text-5xl text-[#051125] font-serif italic leading-tight">{step.title}</h2>
                                <p className="text-[#45474d] text-lg leading-relaxed font-body max-w-lg">{step.desc}</p>
                            </div>
                        </div>
                        <div className={`lg:col-span-6 relative group ${step.reverse ? 'lg:order-1' : ''}`}>
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                                <img 
                                    src={step.image} 
                                    alt={step.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#051125]/30 to-transparent"></div>
                            </div>
                            {/* Decorative Frame */}
                            <div className={`absolute -inset-4 border border-[#051125]/5 rounded-3xl -z-10 transition-transform duration-700 group-hover:scale-105`}></div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Quality Statement Section */}
            <div className="mt-80 bg-[#f6f3ed] p-20 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2b6954]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8 relative z-10">
                        <h2 className="text-4xl font-serif italic text-[#051125]">"Quality is never an accident; it is always the result of intelligent effort."</h2>
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-px bg-[#051125]/20"></span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#45474d]/60">MASTER CUTTER JURGENSEN</span>
                        </div>
                    </div>
                    <div className="bg-white p-10 rounded-2xl shadow-xl space-y-6 relative z-10">
                         <div className="flex gap-2">
                             {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[#e9c176] text-sm">star</span>)}
                         </div>
                         <p className="text-sm font-body italic text-[#051125]/80">"The home measurement was flawless. Looking at the silhouette of the final blazer, I understood why bespoke is considered an art form."</p>
                         <p className="text-[10px] font-bold tracking-widest text-[#2b6954] uppercase">— KARAN MALHOTRA, ARCHITECT</p>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <section className="bg-[#051125] rounded-3xl p-24 text-center space-y-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-12 h-full gap-1 border-x border-white/5">
                        {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white/5"></div>)}
                    </div>
                </div>
                <h2 className="text-5xl md:text-7xl text-white font-serif italic leading-[1.1] relative z-10">Wear the Confidence<br/>of a Perfect Fit.</h2>
                <p className="text-white/40 font-body text-sm relative z-10 max-w-md mx-auto">Join a guild of visionaries who value the art of personal expression.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                    <button onClick={() => navigate('/login')} className="bg-[#2b6954] text-white px-12 py-6 rounded-xl font-label font-bold text-sm tracking-[0.3em] uppercase shadow-2xl hover:bg-[#327a61] transition-all">Get Measured Today</button>
                    <button onClick={() => navigate('/tailors')} className="bg-white/5 border border-white/10 text-white px-12 py-6 rounded-xl font-label font-bold text-sm tracking-[0.3em] uppercase hover:bg-white/10 transition-all">Meet Our Artisans</button>
                </div>
            </section>
        </div>
    );
};

const Process = ({ asTab = false }) => {
    const navigate = useNavigate();

    if (asTab) {
        return <ProcessContent navigate={navigate} />;
    }

    return (
        <div className="bg-[#fcf9f3] min-h-screen">
             <header className="fixed top-0 w-full flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto z-50 bg-[#fcf9f3]/80 backdrop-blur-xl border-b border-[#051125]/5">
                <div className="text-2xl font-serif italic text-[#051125]">DarziAtDoor</div>
                <nav className="hidden md:flex items-center gap-10">
                    <Link to="/" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Atelier</Link>
                    <Link to="/services" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Services</Link>
                    <Link to="/tailors" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Tailors</Link>
                    <Link to="/process" className="text-[#2b6954] font-bold border-b-2 border-[#2b6954] py-1 font-label text-sm tracking-widest uppercase">Process</Link>
                    <Link to="/pricing" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Pricing</Link>
                </nav>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/login')} className="bg-[#051125] text-white px-6 py-3 rounded-lg font-label font-bold text-xs tracking-widest uppercase shadow-xl shadow-[#051125]/10">
                        Start Your Journey
                    </button>
                </div>
            </header>
            <main className="pt-32">
                <ProcessContent navigate={navigate} />
            </main>
        </div>
    );
};

export { ProcessContent };
export default Process;
