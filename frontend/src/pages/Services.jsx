import React from "react";
import { useNavigate, Link } from "react-router-dom";

const ServicesContent = ({ navigate }) => {
    const categories = [
        {
            id: "mens",
            title: "Men's Wear",
            desc: "Sharp silhouettes for the modern gentleman. From power suits to casual linens, tailored to your exact measurements.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdlteJMpj1oDAOTK7akyVPu0cIysKkd_Qof5MYERKXDP7F9vsjZ6FwkC4jSncpRTERkVnnxUNfE4IVpna8-OdDpwq9UdOl8g5Ib3Qm1yyUS-Nhva8d9aSTJ6AgQbvW73_tDQ6IX4Cm_haQXA5lA6Qtn-e8qBQbofpB6kkqq2YrjqgCcJMzcM6NMtrlXko1XOGjlkkFry2NOw6F96HyhAP_zl10NKW8XA9LQMQhPbnzWb14OtVvjJ7HyWyaT_Z9QDg3qrofVnnOm1g",
            tags: ["Suits", "Dress Shirts", "Trousers"],
            colSpan: "lg:col-span-8"
        },
        {
            id: "womens",
            title: "Women's Wear",
            desc: "Elegant drapes and precise cuts for every occasion. Experience the luxury of a perfect fit.",
            image: "https://images.unsplash.com/photo-1591366754631-13054a1713cf?q=80&w=1974&auto=format&fit=crop",
            tags: ["Evening Gowns", "Blouses & Tops", "Custom Skirts"],
            colSpan: "lg:col-span-4",
            isVertical: true
        },
        {
            id: "traditional",
            title: "Traditional",
            desc: "Heritage designs meeting contemporary craftsmanship. Custom Sherwanis, Lehengas, and Kurtas.",
            image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2000&auto=format&fit=crop",
            colSpan: "lg:col-span-6",
            hasImageLeft: true
        },
        {
            id: "alterations",
            title: "Alterations",
            desc: "The perfect fit for your existing wardrobe.",
            icon: "straighten",
            colSpan: "lg:col-span-3",
            bg: "bg-[#f6f3ed]"
        },
        {
            id: "fabrics",
            title: "Fabrics",
            desc: "Sourced from the finest mills worldwide.",
            icon: "texture",
            colSpan: "lg:col-span-3",
            bg: "bg-[#051125]",
            textColor: "text-white"
        }
    ];

    return (
        <div className="container-editorial">
            <div className="space-y-12 mb-20 animate-fade-in">
                <div className="space-y-4">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#2b6954]">Select Your Craft</span>
                    <h1 className="text-5xl md:text-7xl text-[#051125] leading-tight font-serif italic max-w-3xl">
                        Bespoke Tailoring<br/>Redefined for You.
                    </h1>
                    <p className="max-w-xl text-[#45474d] text-lg leading-relaxed font-body">
                        Choose a category to begin your personalized tailoring journey. Our master artisans are ready to bring your vision to life with precision and soul.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className={`${cat.colSpan} ${cat.bg || 'bg-white'} rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group`}>
                        {cat.image ? (
                            <div className={`flex flex-col ${cat.isVertical ? '' : 'lg:flex-row'} h-full`}>
                                {!cat.hasImageLeft && (
                                    <div className="flex-1 p-10 flex flex-col justify-center space-y-6">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#2b6954] text-sm">architecture</span>
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#45474d]/60 font-label">Master Collection</span>
                                        </div>
                                        <h3 className="text-3xl font-serif italic text-[#051125]">{cat.title}</h3>
                                        <p className="text-sm text-[#45474d] leading-relaxed max-w-sm font-body">{cat.desc}</p>
                                        {cat.tags && (
                                            <div className="flex flex-wrap gap-2">
                                                {cat.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-[#f6f3ed] text-[10px] font-bold tracking-wider uppercase rounded-full font-label">{tag}</span>
                                                ))}
                                                <span 
                                                    onClick={() => navigate('/login')}
                                                    className="px-3 py-1 bg-[#051125] text-white text-[10px] font-bold tracking-wider uppercase rounded-full cursor-pointer hover:bg-[#2b6954] transition-colors font-label"
                                                >
                                                    Select →
                                                </span>
                                            </div>
                                        )}
                                        {cat.isVertical && (
                                            <button 
                                                onClick={() => navigate('/login')}
                                                className="w-full bg-white border border-[#051125]/10 py-4 font-label text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#051125] hover:text-white transition-all"
                                            >
                                                Explore
                                            </button>
                                        )}
                                    </div>
                                )}
                                <div className={`${cat.isVertical ? 'h-64' : 'flex-1'} overflow-hidden relative`}>
                                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    {cat.isVertical && (
                                        <div className="absolute inset-x-0 bottom-0 p-8 glass m-4 rounded-lg hidden lg:block">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-serif italic text-white">{cat.title}</h3>
                                                <div className="flex flex-col gap-1 text-[10px] font-bold text-white/80 uppercase tracking-widest font-label">
                                                    {cat.tags.map(tag => <span key={tag}>• {tag}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {cat.hasImageLeft && (
                                    <div className="flex-1 p-10 flex flex-col justify-center space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#2b6954] text-sm">history_edu</span>
                                        </div>
                                        <h3 className="text-3xl font-serif italic text-[#051125]">{cat.title}</h3>
                                        <p className="text-sm text-[#45474d] leading-relaxed max-w-sm font-body">{cat.desc}</p>
                                        <button 
                                            onClick={() => navigate('/login')}
                                            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#2b6954] font-label group/btn"
                                        >
                                            View Heritage <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_right_alt</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-10 h-full flex flex-col justify-between">
                                <span className="material-symbols-outlined text-4xl opacity-40">{cat.icon}</span>
                                <div>
                                    <h3 className={`text-2xl font-serif italic mb-2 ${cat.textColor || 'text-[#051125]'}`}>{cat.title}</h3>
                                    <p className={`text-sm opacity-70 font-body ${cat.textColor || 'text-[#45474d]'}`}>{cat.desc}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop" alt="Consult" className="w-full h-full object-cover" />
                    <div className="absolute bottom-8 right-8 bg-white p-6 rounded-lg shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-serif italic text-[#051125]">15+</span>
                            <div className="text-[8px] font-bold uppercase tracking-widest text-[#45474d] font-label">Years of Sartorial<br/>Excellence</div>
                        </div>
                    </div>
                </div>
                <div className="space-y-8 p-6">
                    <h2 className="text-5xl text-[#051125] leading-tight font-serif italic">Can't decide?<br/>Consult with an Artisan.</h2>
                    <p className="text-[#45474d] leading-relaxed font-body">
                        Our experts are available for home visits to discuss your style needs, provide fabric samples, and take over 30 precise measurements to ensure a flawless finish.
                    </p>
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="bg-[#f6f3ed] p-3 rounded-lg"><span className="material-symbols-outlined text-[#2b6954]">business_center</span></div>
                            <div>
                                <p className="font-bold text-sm">Doorstep Measurement</p>
                                <p className="text-xs text-[#45474d]/70 font-body">We come to your home or office at your convenience.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="bg-[#f6f3ed] p-3 rounded-lg"><span className="material-symbols-outlined text-[#2b6954]">palette</span></div>
                            <div>
                                <p className="font-bold text-sm">Fabric Selection</p>
                                <p className="text-xs text-[#45474d]/70 font-body">Choose from 500+ premium fabric swatches on-site.</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-[#2b6954] text-white px-10 py-5 rounded-lg font-label font-bold text-sm tracking-widest uppercase shadow-xl shadow-[#2b6954]/20 hover:bg-[#051125] transition-all"
                    >
                        Book Styling Session
                    </button>
                </div>
            </div>
        </div>
    );
};

const Services = ({ asTab = false }) => {
    const navigate = useNavigate();

    if (asTab) {
        return <ServicesContent navigate={navigate} />;
    }

    return (
        <div className="bg-[#fcf9f3] text-[#1c1c18] min-h-screen pb-20">
            <header className="fixed top-0 w-full flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto z-50 bg-[#fcf9f3]/80 backdrop-blur-xl border-b border-[#051125]/5">
                <div className="text-2xl font-serif italic text-[#051125]">DarziAtDoor</div>
                <nav className="hidden md:flex items-center gap-10">
                    <Link to="/" className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase">Landing</Link>
                    <Link to="/services" className="text-[#2b6954] font-bold border-b-2 border-[#2b6954] py-1 font-label text-sm tracking-widest uppercase">Services</Link>
                    <a className="text-[#051125]/70 font-medium hover:text-[#2b6954] transition-colors duration-300 font-label text-sm tracking-widest uppercase" href="#">Tailors</a>
                </nav>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/login')} className="bg-[#051125] text-white px-6 py-3 rounded-lg font-label font-bold text-xs tracking-widest uppercase shadow-xl shadow-[#051125]/10">
                        Book Measurement
                    </button>
                </div>
            </header>
            <main className="pt-32">
                <ServicesContent navigate={navigate} />
            </main>
        </div>
    );
};

export { ServicesContent };
export default Services;
