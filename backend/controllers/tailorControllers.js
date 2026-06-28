const prisma = require("../config/db");

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

const ratingForTailor = async (tailorId) => {
  const agg = await prisma.review.aggregate({ where: { tailorId }, _avg: { rating: true }, _count: { rating: true } });
  return { averageRating: agg._avg.rating ? Number(agg._avg.rating.toFixed(1)) : null, reviewCount: agg._count.rating };
};

exports.getNearbyTailors = async (req, res) => {
  try {
    const lat = req.query.lat != null ? parseFloat(req.query.lat) : null;
    const lng = req.query.lng != null ? parseFloat(req.query.lng) : null;
    const specialization = (req.query.specialization || "").trim().toLowerCase();

    const tailors = await prisma.tailor.findMany({
      where: {
        availability: true,
        ...(specialization ? { skills: { has: specialization } } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: { where: { isActive: true }, take: 4, orderBy: { createdAt: "desc" } },
        _count: { select: { reviews: true, products: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const withDistance = await Promise.all(tailors.map(async (tailor) => {
      const rating = await ratingForTailor(tailor.id);
      let distanceKm = null;
      if (lat != null && lng != null && tailor.latitude && tailor.longitude) {
        const rad = Math.PI / 180;
        const dLat = (tailor.latitude - lat) * rad;
        const dLng = (tailor.longitude - lng) * rad;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * rad) * Math.cos(tailor.latitude * rad) * Math.sin(dLng / 2) ** 2;
        distanceKm = Number((6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
      }
      return { ...tailor, ...rating, distanceKm };
    }));

    withDistance.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    res.json({ tailors: withDistance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTailorById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid tailor ID" });

    const tailor = await prisma.tailor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: { where: { isActive: true }, orderBy: { createdAt: "desc" } },
        reviews: { take: 12, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } },
      },
    });
    if (!tailor) return res.status(404).json({ message: "Tailor not found" });

    const rating = await ratingForTailor(id);
    res.json({ tailor: { ...tailor, ...rating } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTailorProfile = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid tailor ID" });

    const tailor = await prisma.tailor.findUnique({ where: { id } });
    if (!tailor) return res.status(404).json({ message: "Tailor not found" });
    if (tailor.userId !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const { bio, specializations, priceRangeMin, priceRangeMax, profilePhoto, isAvailable, latitude, longitude } = req.body;
    const data = {};
    if (bio !== undefined) data.bio = bio;
    if (specializations !== undefined) data.skills = Array.isArray(specializations) ? specializations.map(s => String(s).toLowerCase()) : String(specializations).split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    if (priceRangeMin !== undefined) data.priceRangeMin = parseInt(priceRangeMin, 10) || null;
    if (priceRangeMax !== undefined) data.priceRangeMax = parseInt(priceRangeMax, 10) || null;
    if (profilePhoto !== undefined) data.profilePhoto = profilePhoto;
    if (isAvailable !== undefined) data.availability = Boolean(isAvailable);
    if (latitude !== undefined) data.latitude = parseFloat(latitude) || 0;
    if (longitude !== undefined) data.longitude = parseFloat(longitude) || 0;

    const updated = await prisma.tailor.update({ where: { id }, data, include: { user: { select: { name: true, email: true } } } });
    res.json({ message: "Tailor profile updated", tailor: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTailorProducts = async (req, res) => {
  try {
    const tailorId = parseId(req.params.id);
    if (!tailorId) return res.status(400).json({ message: "Invalid tailor ID" });
    const products = await prisma.product.findMany({ where: { tailorId, isActive: true }, orderBy: { createdAt: "desc" } });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
