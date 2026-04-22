import React from 'react';
import { useNavigate } from 'react-router-dom';

const TailorProfile = () => {
    const navigate = useNavigate();
    const tailors = [
        { id: 1, name: "Eleanor Vance", title: "Master Tailor", specialties: ["Bridal", "Evening Wear", "Silk Drape"], experience: "18 Years", rating: "4.9", avatar: "https://i.pravatar.cc/150?u=eleanor" },
        { id: 2, name: "Marcus Thorne", title: "Bespoke Suit Specialist", specialties: ["Savile Row Suits", "Tuxedos", "Wool"], experience: "22 Years", rating: "5.0", avatar: "https://i.pravatar.cc/150?u=marcus" },
        { id: 3, name: "Sunil Kapoor", title: "Cultural Wear Expert", specialties: ["Sherwanis", "Lehengas", "Intricate Embroidery"], experience: "14 Years", rating: "4.8", avatar: "https://i.pravatar.cc/150?u=sunil" },
        { id: 4, name: "Isabella Rossi", title: "Modern Alterations Lead", specialties: ["Resizing", "Denim Customization", "Leather"], experience: "9 Years", rating: "4.7", avatar: "https://i.pravatar.cc/150?u=isabella" },
    ];

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Noto Serif, serif', fontSize: '2.5rem', color: 'var(--on-surface)' }}>Our Artisans</h1>
                        <p style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface-variant)', marginTop: '0.5rem' }}>Meet the master tailors dedicated to crafting your garments.</p>
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <button className="btn-secondary" onClick={() => navigate('/fabrics')}>Fabric Library</button>
                        <button className="btn-primary" style={{margin: 0}} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {tailors.map(tailor => (
                        <div key={tailor.id} style={{
                            display: 'flex',
                            gap: '2rem',
                            background: 'var(--surface-container-low)',
                            padding: '2rem',
                            borderRadius: '8px',
                            alignItems: 'center',
                            border: '1px solid var(--outline-variant)'
                        }}>
                            <img src={tailor.avatar} alt={tailor.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--surface)' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.75rem', color: 'var(--on-surface)', marginBottom: '0.25rem' }}>{tailor.name}</h2>
                                        <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>{tailor.title}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                                        <span style={{ color: '#eab308' }}>★</span>
                                        <span style={{ fontWeight: 'bold' }}>{tailor.rating}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '2rem', color: 'var(--on-surface-variant)', fontSize: '0.95rem' }}>
                                    <div>
                                        <strong>Experience:</strong> {tailor.experience}
                                    </div>
                                    <div>
                                        <strong>Specialties:</strong> {tailor.specialties.join(", ")}
                                    </div>
                                </div>
                            </div>
                            <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ alignSelf: 'center', margin: 0 }}>Request Tailor</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TailorProfile;
