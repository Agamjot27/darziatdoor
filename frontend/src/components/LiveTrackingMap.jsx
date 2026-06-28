import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import API from "../api/api";
import { socket } from "../utils/socket";
import {
    haversineKm, calcEtaMinutes, isValidCoord,
    offsetKm, moveToward, formatDistance, formatEta,
} from "../utils/geo";

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };

const userIcon = L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.5);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

const tailorIcon = L.divIcon({
    className: "",
    html: `<div style="position:relative;width:36px;height:36px;">
        <div style="position:absolute;inset:0;background:rgba(43,105,84,0.25);border-radius:50%;animation:lt-pulse 2s infinite;"></div>
        <div style="position:absolute;inset:6px;background:#2b6954;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">✂️</div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const getOrderId = (order) => String(order?._id || order?.id || "");

const TRACKABLE_STATUSES = ["accepted", "in_progress", "pending"];

const LiveTrackingMap = ({ orders, loading }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const userMarkerRef = useRef(null);
    const tailorMarkerRef = useRef(null);
    const routeRef = useRef(null);

    const [userLocation, setUserLocation] = useState(null);
    const [tailorLocation, setTailorLocation] = useState(null);
    const [trackingData, setTrackingData] = useState(null);
    const [geoError, setGeoError] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [simulatedTailor, setSimulatedTailor] = useState(null);
    const [locating, setLocating] = useState(true);

    const trackableOrders = useMemo(
        () => orders.filter((o) => TRACKABLE_STATUSES.includes(o.status) && o.status !== "rejected"),
        [orders]
    );

    const activeOrder = useMemo(() => {
        if (!trackableOrders.length) return null;
        if (selectedOrderId) {
            return trackableOrders.find((o) => getOrderId(o) === selectedOrderId) || trackableOrders[0];
        }
        const priority = trackableOrders.find((o) => o.status === "accepted" || o.status === "in_progress");
        return priority || trackableOrders[0];
    }, [trackableOrders, selectedOrderId]);

    useEffect(() => {
        if (!trackableOrders.length) return;
        setSelectedOrderId((prev) => {
            if (prev && trackableOrders.some((o) => getOrderId(o) === prev)) return prev;
            const priority = trackableOrders.find((o) => o.status === "accepted" || o.status === "in_progress");
            return getOrderId(priority || trackableOrders[0]);
        });
    }, [trackableOrders]);

    // User geolocation
    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError("Geolocation not supported");
            setLocating(false);
            return;
        }
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserLocation(loc);
                setLocating(false);
                setGeoError(null);

                const userId = localStorage.getItem("userId");
                if (userId && socket.connected) {
                    socket.emit("update_location", { role: "user", userId, lat: loc.lat, lng: loc.lng });
                }
            },
            () => {
                setGeoError("Enable location for live tracking");
                setUserLocation(DEFAULT_CENTER);
                setLocating(false);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Fetch tracking data for active order
    useEffect(() => {
        if (!activeOrder) {
            setTrackingData(null);
            setTailorLocation(null);
            return;
        }
        const fetchTracking = async () => {
            try {
                const res = await API.get(`/orders/${getOrderId(activeOrder)}/tracking`);
                setTrackingData(res.data);
                if (isValidCoord(res.data.tailor?.lat, res.data.tailor?.lng)) {
                    setTailorLocation({ lat: res.data.tailor.lat, lng: res.data.tailor.lng });
                    setSimulatedTailor(null);
                }
            } catch {
                /* silent */
            }
        };
        fetchTracking();
        const interval = setInterval(fetchTracking, 30000);
        return () => clearInterval(interval);
    }, [activeOrder]);

    // Socket: real-time tailor location
    useEffect(() => {
        const onTailorLocation = (data) => {
            if (!activeOrder || String(data.orderId) !== getOrderId(activeOrder)) return;
            setTailorLocation({ lat: data.lat, lng: data.lng });
            setSimulatedTailor(null);
        };
        socket.on("tailor_location_update", onTailorLocation);
        return () => socket.off("tailor_location_update", onTailorLocation);
    }, [activeOrder]);

    // Simulate tailor movement when accepted but no live GPS yet
    useEffect(() => {
        if (!userLocation || !activeOrder) return;
        if (activeOrder.status !== "accepted" && activeOrder.status !== "in_progress") return;
        if (tailorLocation && isValidCoord(tailorLocation.lat, tailorLocation.lng)) return;

        const start = offsetKm(userLocation.lat, userLocation.lng, 2.5, 1.2);
        setSimulatedTailor(start);

        const interval = setInterval(() => {
            setSimulatedTailor((prev) => {
                if (!prev) return start;
                const next = moveToward(prev, userLocation, 0.06);
                const dist = haversineKm(next.lat, next.lng, userLocation.lat, userLocation.lng);
                return dist < 0.05 ? prev : next;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [userLocation, activeOrder, tailorLocation]);

    const effectiveTailorLoc = tailorLocation || simulatedTailor;

    const { distanceKm, etaMinutes } = useMemo(() => {
        if (!userLocation || !effectiveTailorLoc) {
            return {
                distanceKm: trackingData?.distanceKm ?? null,
                etaMinutes: trackingData?.etaMinutes ?? null,
            };
        }
        const km = haversineKm(userLocation.lat, userLocation.lng, effectiveTailorLoc.lat, effectiveTailorLoc.lng);
        return { distanceKm: km, etaMinutes: calcEtaMinutes(km) };
    }, [userLocation, effectiveTailorLoc, trackingData]);

    const statusMessage = useMemo(() => {
        if (!activeOrder) return { title: "No active visits", sub: "Book a tailor to see live tracking" };
        if (activeOrder.status === "pending") return { title: "Finding your artisan", sub: "We'll notify you when a tailor accepts" };
        if (activeOrder.status === "completed") return { title: "Visit completed", sub: "Your fitting is done" };
        if (!effectiveTailorLoc) return { title: "Tailor preparing", sub: "Location will appear shortly" };
        if (distanceKm != null && distanceKm < 0.3) return { title: "Tailor has arrived", sub: activeOrder.tailorId?.name || "Your artisan is here" };
        return {
            title: `${formatEta(etaMinutes)} away`,
            sub: `${activeOrder.tailorId?.name || "Your tailor"} is en route for ${activeOrder.garmentType || "your fitting"}`,
        };
    }, [activeOrder, effectiveTailorLoc, distanceKm, etaMinutes]);

    // Initialize Leaflet map
    useEffect(() => {
        if (locating) return;                              // wait until location resolves
        if (!mapRef.current || mapInstance.current) return;
        const center = userLocation || DEFAULT_CENTER;
        mapInstance.current = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false,
        }).setView([center.lat, center.lng], 14);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            maxZoom: 19,
        }).addTo(mapInstance.current);

        return () => {
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
    }, [locating]); // re-run when loading screen clears so mapRef.current is in the DOM

    // Update markers and route
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        const center = userLocation || DEFAULT_CENTER;

        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([center.lat, center.lng]);
        } else {
            userMarkerRef.current = L.marker([center.lat, center.lng], { icon: userIcon })
                .addTo(map)
                .bindTooltip("You", { permanent: false, direction: "top" });
        }

        if (effectiveTailorLoc) {
            const tLatLng = [effectiveTailorLoc.lat, effectiveTailorLoc.lng];
            if (tailorMarkerRef.current) {
                tailorMarkerRef.current.setLatLng(tLatLng);
            } else {
                tailorMarkerRef.current = L.marker(tLatLng, { icon: tailorIcon })
                    .addTo(map)
                    .bindTooltip(activeOrder?.tailorId?.name || "Tailor", { direction: "top" });
            }

            if (routeRef.current) map.removeLayer(routeRef.current);
            routeRef.current = L.polyline(
                [[center.lat, center.lng], tLatLng],
                { color: "#2b6954", weight: 4, dashArray: "8 10", opacity: 0.85 }
            ).addTo(map);

            map.fitBounds(L.latLngBounds([center.lat, center.lng], tLatLng), { padding: [60, 60], maxZoom: 15 });
        } else {
            if (tailorMarkerRef.current) {
                map.removeLayer(tailorMarkerRef.current);
                tailorMarkerRef.current = null;
            }
            if (routeRef.current) {
                map.removeLayer(routeRef.current);
                routeRef.current = null;
            }
            map.setView([center.lat, center.lng], 14);
        }
    }, [userLocation, effectiveTailorLoc, activeOrder]);

    if (loading || locating) {
        return (
            <div className="cd-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ height: 320, background: "linear-gradient(135deg,#f6f3ed,#e8e4dc)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#2b6954", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Locating you on the map...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes lt-pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.4);opacity:0} }`}</style>
            </div>
        );
    }

    return (
        <div className="cd-card animate-fade-up" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
            <style>{`@keyframes lt-pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.4);opacity:0} }`}</style>

            {/* ETA overlay — Blinkit style */}
            <div style={{
                position: "absolute", top: 16, left: 16, right: 16, zIndex: 1000,
                background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
                borderRadius: "0.75rem", padding: "1rem 1.25rem",
                boxShadow: "0 8px 24px rgba(5,17,37,0.1)", border: "1px solid rgba(5,17,37,0.06)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <p style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.15em", color: "#9ca3af", textTransform: "uppercase", margin: "0 0 0.25rem" }}>
                            LIVE TRACKING
                        </p>
                        <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.6rem", fontWeight: 600, color: "#051125", margin: 0, lineHeight: 1.2 }}>
                            {statusMessage.title}
                        </h3>
                        <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.35rem 0 0" }}>{statusMessage.sub}</p>
                    </div>
                    {etaMinutes != null && activeOrder?.status !== "pending" && (
                        <div style={{ textAlign: "center", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", padding: "0.5rem 0.85rem", minWidth: 64 }}>
                            <span style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", fontWeight: 700, color: "#2b6954", display: "block" }}>{etaMinutes}</span>
                            <span style={{ fontSize: "0.5rem", fontWeight: 800, color: "#2b6954", letterSpacing: "0.1em" }}>MIN</span>
                        </div>
                    )}
                </div>

                {trackableOrders.length > 1 && (
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", overflowX: "auto" }}>
                        {trackableOrders.map((o) => (
                            <button key={getOrderId(o)} onClick={() => setSelectedOrderId(getOrderId(o))}
                                style={{
                                    flexShrink: 0, padding: "0.35rem 0.75rem", borderRadius: "2rem", fontSize: "0.55rem", fontWeight: 700,
                                    border: getOrderId(o) === getOrderId(activeOrder) ? "1px solid #051125" : "1px solid rgba(5,17,37,0.15)",
                                    background: getOrderId(o) === getOrderId(activeOrder) ? "#051125" : "#fff",
                                    color: getOrderId(o) === getOrderId(activeOrder) ? "#fff" : "#051125",
                                    cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em",
                                }}>
                                {o.garmentType?.split(" ")[0] || "Order"}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map */}
            <div ref={mapRef} style={{ height: 380, width: "100%", background: "#f3f4f6" }} />

            {/* Bottom bar */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.85rem 1.25rem", borderTop: "1px solid rgba(5,17,37,0.06)", background: "#fcf9f3",
            }}>
                <div style={{ display: "flex", gap: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6" }} />
                        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#6b7280" }}>You</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2b6954" }} />
                        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#6b7280" }}>Tailor</span>
                    </div>
                </div>
                {distanceKm != null ? (
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#051125" }}>{formatDistance(distanceKm)} away</span>
                ) : geoError ? (
                    <span style={{ fontSize: "0.65rem", color: "#b45309" }}>{geoError}</span>
                ) : null}
            </div>
        </div>
    );
};

export default LiveTrackingMap;
