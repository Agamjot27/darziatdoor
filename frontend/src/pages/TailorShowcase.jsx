import React from "react";
import { useNavigate, Link } from "react-router-dom";

const TailorShowcaseContent = ({ navigate }) => {
    const tailors = [
        {
            id: "giovanni",
            name: "Master Giovanni Rossi",
            title: "THE NEAPOLITAN ARCHITECT",
            desc: "Specializing in the 'Spalla Camicia' or shirt-sleeve shoulder, Giovanni brings the relaxed elegance of Naples to every stitch. With 42 years at the cutting table, he views fabric as a living structure.",
            specialties: ["Neapolitan Shoulder", "Deconstructed Blazers", "Linen & Silk Blends"],
            image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop",
            est: "EST. 1982",
            cta: "Book a Consultation",
            layout: "image-left"
        },
        {
            id: "alastair",
            name: "Alastair Cunningham",
            title: "THE SAVILE ROW PURIST",
            desc: "A veteran of London's golden mile, Alastair is the master of the 'Drape Cut.' His suits are defined by a high armhole and a chest that subtly swells, creating a silhouette of quiet power.",
            specialties: ["Savile Row Drape", "Lightweight Tweeds", "Formal Morning Wear"],
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop",
            cta: "Schedule Private Fitting",
            layout: "image-right",
            quote: "The cut is the character of the man."
        }
    ];

    const lexicon = [
        {
            title: "The Floating Canvas",
            desc: "Unstructured garments, our canvas is long and hand-stitched horsehair, allowing the suit to mold to your body over time while retaining its architectural integrity.",
            icon: "architecture"
        },
        {
            title: "Anatomical Draft",
            desc: "Every pattern is drawn from scratch based on 35 unique measurements.",
            icon: "straighten",
            dark: true
        },
        {
            title: "Bespoke Initialing",
            desc: "Subtle hand-embroidery of your legacy inside the breast pocket.",
            icon: "edit_note",
            secondary: true
        }
    ];

    return (
        <div className="container-editorial py-20 pb-40">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-40 animate-fade-in">
                <div className="lg:col-span-7 space-y-6">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#2b6954]">The Masters of Heritage</span>
                    <h1 className="text-7xl md:text-9xl text-[#051125] font-serif italic leading-none">Master<br/>Tailors</h1>
                    <p className="max-w-md text-[#45474d] text-base leading-relaxed font-body">
                        Every garment tells a story of precision. Meet the artisans who blend centuries-old techniques with modern vision to define the silhouette of the contemporary gentleman.
                    </p>
                </div>
                <div className="lg:col-span-5 relative">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2080&auto=format&fit=crop" alt="Mastery" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-10 -left-10 bg-[#2b6954] text-white p-10 rounded-xl shadow-2xl max-w-[240px]">
                        <span className="text-4xl font-serif italic block mb-2">450+</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-70">Years of Combined Expertise</span>
                    </div>
                </div>
            </div>

            {/* Tailor Profiles */}
            <div className="space-y-40">
                {tailors.map((tailor) => (
                    <div key={tailor.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-center`}>
                        {tailor.layout === "image-left" ? (
                            <>
                                <div className="lg:col-span-5 relative group">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-8 border-white">
                                        <img src={tailor.image} alt={tailor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold tracking-widest text-[#051125]">{tailor.est}</div>
                                </div>
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="space-y-2">
                                        <h2 className="text-5xl text-[#051125] font-serif italic">{tailor.name}</h2>
                                        <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#2b6954]">{tailor.title}</div>
                                    </div>
                                    <p className="text-[#45474d] text-lg leading-relaxed font-body max-w-xl">{tailor.desc}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {tailor.specialties.map(spec => (
                                            <span key={spec} className="px-4 py-2 bg-[#f6f3ed] text-[10px] font-bold text-[#051125] rounded-full uppercase tracking-wider">{spec}</span>
                                        ))}
                                    </div>
                                    <button onClick={() => navigate('/login')} className="bg-[#051125] text-white px-10 py-5 rounded-lg font-label font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-4 group/btn shadow-xl shadow-[#051125]/10">
                                        {tailor.cta}
                                        <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward_ios</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
                                    <div className="space-y-2">
                                        <h2 className="text-5xl text-[#051125] font-serif italic">{tailor.name}</h2>
                                        <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#2b6954]">{tailor.title}</div>
                                    </div>
                                    <p className="text-[#45474d] text-lg leading-relaxed font-body max-w-xl">{tailor.desc}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {tailor.specialties.map(spec => (
                                            <span key={spec} className="px-4 py-2 bg-[#adedd3]/30 text-[#2b6954] rounded-full text-[10px] font-bold uppercase tracking-wider">{spec}</span>
                                        ))}
                                    </div>
                                    <button onClick={() => navigate('/login')} className="bg-white border-2 border-[#051125] text-[#051125] px-10 py-5 rounded-lg font-label font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-4 group/btn hover:bg-[#051125] hover:text-white transition-all">
                                        {tailor.cta}
                                        <span className="material-symbols-outlined">calendar_today</span>
                                    </button>
                                </div>
                                <div className="lg:col-span-5 relative order-1 lg:order-2 group">
                                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                                        <img src={tailor.image} alt={tailor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent text-white text-right">
                                             <p className="italic text-xl font-serif">"{tailor.quote}"</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Lexicon Section */}
            <div className="mt-60">
                <div className="text-center mb-24 space-y-4">
                    <h2 className="text-5xl text-[#051125] font-serif italic">The Artisan's Lexicon</h2>
                    <p className="text-[#45474d]/70 text-sm font-body max-w-xl mx-auto">Our mastery extends beyond mere measurement. We specialize in the nuances that differentiate a suit from a masterpiece.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 p-12 bg-[#f6f3ed] rounded-2xl flex flex-col justify-between h-[400px] shadow-sm relative overflow-hidden group">
                         <span className="material-symbols-outlined text-[#2b6954] text-5xl transition-transform group-hover:scale-110">architecture</span>
                         <div className="space-y-4 relative z-10">
                            <h3 className="text-2xl text-[#051125] font-serif italic">{lexicon[0].title}</h3>
                            <p className="text-xs text-[#45474d] font-body leading-relaxed">{lexicon[0].desc}</p>
                         </div>
                    </div>
                    <div className="md:col-span-4 p-12 bg-[#051125] text-white rounded-2xl flex flex-col justify-between h-[400px] shadow-xl">
                         <span className="material-symbols-outlined text-[#e9c176] text-5xl">straighten</span>
                         <div className="space-y-4">
                            <h3 className="text-2xl font-serif italic">{lexicon[1].title}</h3>
                            <p className="text-xs text-white/60 font-body leading-relaxed">{lexicon[1].desc}</p>
                         </div>
                    </div>
                    <div className="md:col-span-3 p-12 bg-[#2b6954] text-white rounded-2xl flex flex-col justify-between h-[400px] shadow-lg">
                         <span className="material-symbols-outlined text-white/50 text-5xl">edit_note</span>
                         <div className="space-y-4">
                            <h3 className="text-xl font-serif italic">{lexicon[2].title}</h3>
                            <p className="text-xs text-white/70 font-body leading-relaxed">{lexicon[2].desc}</p>
                         </div>
                    </div>

                    <div className="md:col-span-7 rounded-2xl overflow-hidden shadow-2xl h-[350px] relative group">
                        <img src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" alt="Fabrics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-12 flex flex-col justify-end">
                            <h3 className="text-3xl text-white font-serif italic mb-2">Fabric Selection</h3>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest font-label">Over 1,200 Mill-direct grades</p>
                        </div>
                    </div>
                    <div className="md:col-span-5 p-12 bg-[#fcf9f3] border border-[#051125]/10 rounded-2xl flex flex-col justify-between h-[350px]">
                        <div className="flex justify-between items-start">
                             <h3 className="text-2xl text-[#051125] font-serif italic">Global Fitting Tours</h3>
                             <span className="material-symbols-outlined text-[#051125]/20 text-4xl">public</span>
                        </div>
                        <p className="text-sm text-[#45474d] font-body">Our master artisans visit London, New York, and Tokyo monthly. Experience the Darzi standard in your home city.</p>
                        <div className="flex gap-4">
                            <span className="w-2 h-2 rounded-full bg-[#2b6954] animate-pulse"></span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#2b6954]">Next Tour: NYC • April 12-15</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-60 bg-[#051125] rounded-3xl p-20 text-center space-y-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2b6954] to-transparent opacity-10"></div>
                <h2 className="text-6xl md:text-8xl text-white font-serif italic leading-none relative z-10">Begin Your<br/>Sartorial Journey</h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                    <button onClick={() => navigate('/login')} className="bg-white text-[#051125] px-12 py-6 rounded-xl font-label font-bold text-sm tracking-[0.3em] uppercase hover:shadow-2xl transition-all active:scale-95">Book Your Fitting</button>
                    <button onClick={() => navigate('/services')} className="text-white/70 font-label font-bold text-xs tracking-[0.3em] uppercase border-b border-white/20 pb-2 hover:text-white transition-colors">View Our Portfolio Collection</button>
                </div>
            </div>
        </div>
    );
};

const TailorShowcase = ({ asTab = false }) => {
    const navigate = useNavigate();

    if (asTab) {
        return <TailorShowcaseContent navigate={navigate} />;
    }

    return (
        <div className="bg-[#fcf9f3] min-h-screen">
             <header className="fixed top-0 w-full flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto z-50 bg-[#fcf9f3]/80 backdrop-blur-xl border-b border-[#051125]/5">
                <div className="text-2xl font-serif italic text-[#051125]">DarziAtDoor</div>
                <nav className="hidden md:flex items-center gap-10">
                    <Link to="/" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Atelier</Link>
                    <Link to="/services" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Services</Link>
                    <Link to="/tailors" className="text-[#2b6954] font-bold border-b-2 border-[#2b6954] py-1 font-label text-sm tracking-widest uppercase">Tailors</Link>
                </nav>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/login')} className="bg-[#051125] text-white px-6 py-3 rounded-lg font-label font-bold text-xs tracking-widest uppercase shadow-xl shadow-[#051125]/10">
                        Catch a Tailor
                    </button>
                </div>
            </header>
            <main className="pt-32">
                <TailorShowcaseContent navigate={navigate} />
            </main>
        </div>
    );
};

export { TailorShowcaseContent };
export default TailorShowcase;
