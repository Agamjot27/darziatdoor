const EARTH_RADIUS_KM = 6371;
const AVG_SPEED_KMH = 28;

const toRad = (deg) => (deg * Math.PI) / 180;

export const haversineKm = (lat1, lng1, lat2, lng2) => {
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const calcEtaMinutes = (distanceKm) => {
    if (!distanceKm || distanceKm <= 0) return 0;
    return Math.max(1, Math.round((distanceKm / AVG_SPEED_KMH) * 60));
};

export const isValidCoord = (lat, lng) =>
    typeof lat === "number" && typeof lng === "number" &&
    !isNaN(lat) && !isNaN(lng) &&
    Math.abs(lat) <= 90 && Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0);

export const offsetKm = (lat, lng, kmNorth = 2, kmEast = 0) => ({
    lat: lat + (kmNorth / EARTH_RADIUS_KM) * (180 / Math.PI),
    lng: lng + (kmEast / (EARTH_RADIUS_KM * Math.cos(toRad(lat)))) * (180 / Math.PI),
});

export const moveToward = (from, to, fraction = 0.08) => ({
    lat: from.lat + (to.lat - from.lat) * fraction,
    lng: from.lng + (to.lng - from.lng) * fraction,
});

export const formatDistance = (km) => {
    if (!km || km < 0.1) return "< 100 m";
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
};

export const formatEta = (minutes) => {
    if (!minutes || minutes <= 0) return "Arriving soon";
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
};
