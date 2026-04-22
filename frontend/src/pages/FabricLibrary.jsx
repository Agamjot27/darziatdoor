import React from 'react';
import { useNavigate } from 'react-router-dom';

const FabricLibrary = () => {
    const navigate = useNavigate();
    const fabrics = [
        { id: 1, name: "Midnight Wool", type: "Italian Wool", color: "Navy Blue", weight: "320g", idealFor: "Suits, Trousers", hex: "#1a2530" },
        { id: 2, name: "Ivory Silk", type: "Mulberry Silk", color: "Ivory", weight: "85g", idealFor: "Shirts, Linings", hex: "#fcf9f3" },
        { id: 3, name: "Emerald Linen", type: "Irish Linen", color: "Emerald Green", weight: "210g", idealFor: "Summer Blazers", hex: "#2b6954" },
        { id: 4, name: "Charcoal Cashmere", type: "Cashmere Blend", color: "Charcoal", weight: "400g", idealFor: "Overcoats", hex: "#36454F" },
        { id: 5, name: "Crimson Velvet", type: "Cotton Velvet", color: "Deep Red", weight: "280g", idealFor: "Evening Wear", hex: "#7a1a2e" },
        { id: 6, name: "Camel Hair", type: "Pure Camel", color: "Tan", weight: "450g", idealFor: "Coats, Jackets", hex: "#c19a6b" }
    ];

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Noto Serif, serif', fontSize: '2.5rem', color: 'var(--on-surface)' }}>The Fabric Library</h1>
                        <p style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface-variant)', marginTop: '0.5rem' }}>Explore our curated collection of premium textiles.</p>
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <button className="btn-secondary" onClick={() => navigate('/tailors')}>Our Artisans</button>
                        <button className="btn-primary" style={{margin: 0}} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                    </div>
                </header>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {fabrics.map(fabric => (
                        <div key={fabric.id} style={{
                            background: 'var(--surface)', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(28, 28, 24, 0.04)',
                            transition: 'transform 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '200px', backgroundColor: fabric.hex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Noto Serif, serif', fontSize: '1.25rem', letterSpacing: '2px' }}>{fabric.name}</div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--on-surface)' }}>{fabric.name}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--on-surface-variant)', fontFamily: 'Manrope, sans-serif' }}>
                                    <p><strong>Type:</strong> {fabric.type}</p>
                                    <p><strong>Weight:</strong> {fabric.weight}</p>
                                    <p><strong>Recommended For:</strong> {fabric.idealFor}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FabricLibrary;
