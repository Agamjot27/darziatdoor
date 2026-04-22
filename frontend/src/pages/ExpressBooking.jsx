import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ExpressBooking = () => {
    const navigate = useNavigate();
    const [searching, setSearching] = useState(false);
    const [nearbyTailors, setNearbyTailors] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setUserLocation({ lng: longitude, lat: latitude });
                },
                (error) => {
                    toast.error("Location access is required for Express services.");
                }
            );
        }
    }, []);

    const findTailors = async () => {
        if (!userLocation) {
            toast.error("Detecting your location. Please wait.");
            return;
        }

        setSearching(true);
        try {
            const res = await axios.get(
                `http://localhost:5000/api/orders/nearby?lng=${userLocation.lng}&lat=${userLocation.lat}`,
                { withCredentials: true }
            );
            setNearbyTailors(res.data);
            if (res.data.length === 0) {
                toast("Our artisans are currently occupied. Trying to dispatch anyway...", { icon: "⏳" });
            }
        } catch (error) {
            toast.error("Connection to Atelier lost.");
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18] pb-20">
            {/* Minimal Header */}
            <header className="px-12 py-8 flex justify-between items-center transition-all bg-white/30 backdrop-blur-md sticky top-0 z-50">
                <div onClick={() => navigate('/')} className="text-2xl font-serif font-bold italic cursor-pointer">Darzi.</div>
                <div className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Express Atelier Dispatch</div>
            </header>

            <main className="container-editorial flex flex-col items-center pt-20 max-w-4xl mx-auto px-6">
                <div className="text-center space-y-8 reveal w-full">
                    <div className="inline-block py-2 px-4 bg-[#adedd3]/30 rounded-full">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#2b6954]">High-Speed Bespoke</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-serif text-[#051125] leading-tight">
                        Precision at <br/><span className="italic serif font-normal">the speed of thought.</span>
                    </h1>
                    <p className="text-lg text-[#45474d] leading-relaxed max-w-xl mx-auto">
                        Dispatch a master tailor to your coordinate. Measurements, repairs, or fitting—all resolved within the hour.
                    </p>

                    <div className="p-12 bg-white rounded-3xl shadow-sm border border-[#051125]/5 relative overflow-hidden group max-w-md mx-auto">
                        <div className={`h-40 w-40 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#051125]/5 transition-all duration-1000 ${searching ? 'animate-pulse bg-[#f6f3ed]' : ''}`}>
                             <span className={`text-6xl transition-transform duration-500 ${searching ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>🧵</span>
                        </div>
                        
                        <button
                            onClick={findTailors}
                            disabled={searching}
                            className="btn-fastener btn-primary w-full !text-xs !py-4"
                        >
                            {searching ? "Scanning Coordinate Grid..." : "Find Nearest Artisan"}
                        </button>
                    </div>
                </div>

                {nearbyTailors.length > 0 && (
                    <div className="mt-20 w-full space-y-8 reveal" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-serif uppercase tracking-tight text-[#051125]">Active Artisans Nearby</h3>
                            <span className="text-[10px] font-bold tracking-widest text-[#2b6954] uppercase bg-[#adedd3]/30 px-3 py-1 rounded-full">
                                {nearbyTailors.length} Found
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {nearbyTailors.map((tailor) => (
                                <div key={tailor._id} className="p-8 bg-white rounded-2xl shadow-sm flex justify-between items-center gap-6 border border-[#051125]/5 hover:border-[#2b6954]/20 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-[#f6f3ed] rounded-lg flex items-center justify-center text-xl">✂️</div>
                                        <div>
                                            <p className="font-serif text-lg text-[#051125]">{tailor.userId.name}</p>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#45474d] opacity-50">{tailor.experience} years of craft</p>
                                        </div>
                                    </div>
                                    <button className="btn-fastener btn-accent !py-3 !px-10 !text-[10px]">
                                        Dispatch
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExpressBooking;
