import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import toast from 'react-hot-toast';

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await API.get(`/orders/${id}`);
                setOrder(response.data);
            } catch (error) {
                toast.error("Atelier archive could not be accessed.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center font-serif italic text-2xl opacity-40">
            Consulting the master tailor...
        </div>
    );
    
    if (!order) return null;

    const stages = [
        { key: "pending", label: "Commission Received", icon: "✉️" },
        { key: "accepted", label: "Artisan Assigned", icon: "📐" },
        { key: "in_progress", label: "In Production", icon: "🪡" },
        { key: "completed", label: "Ready for Fitting", icon: "✨" }
    ];
    
    let currentStageIndex = stages.findIndex(s => s.key === order.status);
    if(order.status === "rejected") currentStageIndex = -1;

    return (
        <div className="min-h-screen bg-[#fcf9f3] pb-20">
            {/* Minimal Header */}
            <header className="px-12 py-8 flex justify-between items-center bg-white/30 backdrop-blur-md sticky top-0 z-50 border-b border-[#051125]/5">
                <button onClick={() => navigate('/dashboard')} className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-all flex items-center gap-2">
                    <span>←</span> Return to Workspace
                </button>
                <div className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Concierge Tracking</div>
            </header>

            <main className="container-editorial pt-20 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    {/* Visual Journey Side */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-serif text-[#051125] leading-tight italic">
                                The journey of your <br/><span className="not-italic font-bold">bespoke item.</span>
                            </h1>
                            <p className="text-sm text-[#45474d] leading-relaxed">
                                Ref: #{order._id.slice(-8).toUpperCase()}
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="relative space-y-12 pl-4">
                            <div className="absolute left-4 top-2 bottom-2 w-px bg-[#051125]/10"></div>
                            
                            {stages.map((stage, index) => {
                                const isCompleted = index <= currentStageIndex;
                                const isActive = index === currentStageIndex;
                                return (
                                    <div key={stage.key} className={`relative pl-12 transition-all duration-700 ${isCompleted ? 'opacity-100' : 'opacity-20'}`}>
                                        <div className={`absolute left-[-4px] top-1 w-2 h-2 rounded-full border-2 border-[#fcf9f3] z-10 ${isCompleted ? 'bg-[#2b6954]' : 'bg-[#051125]/20'}`}></div>
                                        {isActive && <div className="absolute left-[-12px] top-[-7px] w-6 h-6 rounded-full bg-[#2b6954]/10 animate-ping"></div>}
                                        
                                        <div className="space-y-1">
                                            <p className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-[#2b6954]' : 'text-[#45474d]'}`}>
                                                {stage.label}
                                            </p>
                                            {isActive && <p className="text-xs text-[#45474d] opacity-60">Your garment is currently at this stage of craftsmanship.</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="lg:col-span-8 space-y-8">
                        {order.status === "rejected" ? (
                            <div className="p-12 bg-red-50 rounded-2xl border border-red-100 text-center space-y-4">
                                <span className="text-4xl">⚠️</span>
                                <h3 className="text-2xl font-serif text-red-900">Commission Terminated</h3>
                                <p className="text-sm text-red-700 opacity-80 max-w-sm mx-auto">
                                    Our artisans are unable to fulfill this specific request at this time. Please contact the concierge for redirection.
                                </p>
                            </div>
                        ) : (
                            <div className="aspect-[4/3] bg-white rounded-3xl shadow-sm border border-[#051125]/5 p-12 flex flex-col justify-between group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-12 opacity-5 text-[12rem] font-serif rotate-12 transition-transform group-hover:rotate-0 duration-1000">
                                    {stages[Math.max(0, currentStageIndex)].icon}
                                </div>
                                
                                <div className="space-y-8 z-10">
                                    <span className="text-[10px] font-bold tracking-widest uppercase py-2 px-4 bg-[#f6f3ed] rounded-full text-[#051125]">
                                        Specifications Archive
                                    </span>
                                    
                                    <div className="grid grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">Garment Blueprint</p>
                                            {order.serviceType === "stitching" && order.measurements ? (
                                                <div className="space-y-4 font-serif text-lg text-[#051125]">
                                                    <div className="flex justify-between border-b border-[#051125]/5 pb-2">
                                                        <span>Chest Line</span>
                                                        <span className="font-bold">{order.measurements.chest}cm</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-[#051125]/5 pb-2">
                                                        <span>Waist Line</span>
                                                        <span className="font-bold">{order.measurements.waist}cm</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-[#051125]/5 pb-2">
                                                        <span>Shoulder Span</span>
                                                        <span className="font-bold">{order.measurements.shoulders}cm</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-[#051125]/5 pb-2">
                                                        <span>Inseam Length</span>
                                                        <span className="font-bold">{order.measurements.inseam}cm</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="font-serif text-2xl italic">Precision Alteration Slot</p>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">Material Profile</p>
                                            <p className="font-serif text-2xl italic text-[#051125]">
                                                {order.fabricProfile || "Material selection pending."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-[#051125] text-white rounded-2xl flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">Assigned Master Artisan</p>
                                        <p className="font-serif text-xl">{order.tailorId?.name || "Dispatching Artisan..."}</p>
                                    </div>
                                    {order.tailorId && (
                                        <button className="text-[10px] font-bold tracking-widest uppercase border border-white/20 px-4 py-2 rounded hover:bg-white hover:text-[#051125] transition-all">
                                            Contact Atelier
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderTracking;
