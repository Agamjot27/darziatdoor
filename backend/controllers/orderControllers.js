const prisma = require("../config/db");
const { emitOrderUpdate, emitNewOrderToTailors } = require("../utils/socket");
const { haversineKm, calcEtaMinutes, isValidCoord } = require("../utils/geo");
const { sendNotificationEmail } = require("../utils/email");

// Helper to format order response to match the frontend expectations
const formatOrder = (order) => {
    if (!order) return null;
    return {
        _id: String(order.id),
        id: order.id,
        userId: order.userId,
        serviceType: order.serviceType,
        garmentType: order.garmentType,
        date: order.date,
        measurements: order.measurements,
        fabricProfile: order.fabricProfile,
        status: order.status,
        jobType: order.jobType,
        price: order.price,
        paymentStatus: order.paymentStatus || "unpaid",
        hasReview: !!(order.review),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        latitude: order.latitude,
        longitude: order.longitude,
        tailorId: order.tailorId ? {
            id: order.tailorId,
            name: order.tailor?.user?.name || null,
            email: order.tailor?.user?.email || null,
            latitude: order.tailor?.latitude ?? null,
            longitude: order.tailor?.longitude ?? null,
        } : null,
        user: order.user ? {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email
        } : null
    };
};

// FIND NEARBY TAILORS (Hyper-local query using PostGIS)
exports.findNearbyTailors = async (req, res) => {
    try {
        const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters
        
        if (!lng || !lat) {
            return res.status(400).json({ error: "Longitude and latitude are required" });
        }

        const parsedLng = parseFloat(lng);
        const parsedLat = parseFloat(lat);
        const parsedDist = parseFloat(maxDistance);

        // Raw SQL query to use PostGIS ST_DWithin on standard latitude/longitude columns
        const nearbyTailors = await prisma.$queryRaw`
            SELECT 
                t.id, 
                t."userId", 
                t.skills, 
                t.experience, 
                t.availability, 
                t.latitude, 
                t.longitude, 
                t."isOnline",
                u.name AS "userName",
                u.email AS "userEmail"
            FROM "Tailor" t
            JOIN "User" u ON t."userId" = u.id
            WHERE t."isOnline" = true
              AND ST_DWithin(
                ST_MakePoint(t.longitude, t.latitude)::geography,
                ST_MakePoint(${parsedLng}, ${parsedLat})::geography,
                ${parsedDist}
              )
        `;

        // Map database result structure to match old Mongoose output formats if needed
        const formattedTailors = nearbyTailors.map(t => ({
            _id: t.id,
            id: t.id,
            userId: {
                _id: t.userId,
                id: t.userId,
                name: t.userName,
                email: t.userEmail
            },
            skills: t.skills,
            experience: t.experience,
            availability: t.availability,
            isOnline: t.isOnline,
            location: {
                type: "Point",
                coordinates: [t.longitude, t.latitude]
            }
        }));

        res.json(formattedTailors);
    } catch (error) {
        console.error("Geospatial error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Create Order
exports.createOrder = async (req, res) => {
    try {
        console.log("Create Order Request Body:", JSON.stringify(req.body));
        
        const { serviceType, garmentType, date, measurements, measurementId, fabricProfile, latitude, longitude, jobType } = req.body;
        
        if (!req.user || !req.user.id) {
            throw new Error("Authentication failed: User ID missing in request context");
        }

        const sanitizedServiceType = serviceType?.trim().toLowerCase();
        const sanitizedGarmentType = garmentType?.trim();

        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                serviceType: sanitizedServiceType,
                garmentType: sanitizedGarmentType,
                date: new Date(date),
                measurements: measurements || {},
                measurementId: measurementId ? parseInt(measurementId, 10) : null,
                fabricProfile,
                latitude: latitude != null ? parseFloat(latitude) : 0,
                longitude: longitude != null ? parseFloat(longitude) : 0,
                status: "pending",
                jobType: jobType === "express" ? "express" : "standard"
            },
            include: {
                tailor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        const formatted = formatOrder(order);
        emitOrderUpdate(req.user.id, formatted);
        emitNewOrderToTailors(formatted);
        res.status(201).json({ message: "Order created successfully", order: formatted });
    }
    catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ 
            message: "Server Error: " + error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
    }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
    try {
        const dbOrders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                tailor: {
                    include: { user: { select: { name: true, email: true } } }
                },
                review: true
            },
            orderBy: { createdAt: "desc" }
        });
        const orders = dbOrders.map(formatOrder);
        res.status(200).json({ message: "Orders fetched", orders });
    }
    catch (error) {
        console.error("Get my orders error:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET single order by ID for tracking
exports.getOrderById = async (req, res) => {
    try {
        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await prisma.order.findUnique({
            where: { id: parsedId },
            include: {
                tailor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Only allow tailor or owning user to see it
        // req.user.role can be "user" or "tailor"
        // order.userId matches req.user.id (if client)
        if (req.user.role === "user" && order.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access to order" });
        }

        res.json(formatOrder(order));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET orders assigned to tailor
exports.getTailorOrders = async (req, res) => {
    try {
        // First find the tailor profile corresponding to this userId
        const tailor = await prisma.tailor.findUnique({
            where: { userId: req.user.id }
        });

        if (!tailor) {
            return res.status(404).json({ message: "Tailor profile not found" });
        }

        const dbOrders = await prisma.order.findMany({
            where: {
                tailorId: tailor.id
            },
            include: {
                tailor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        res.json(dbOrders.map(formatOrder));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL PENDING ORDERS (Job Pool for Tailors) â€” both standard and express
exports.getPendingOrders = async (req, res) => {
    try {
        const dbOrders = await prisma.order.findMany({
            where: {
                status: "pending",
                jobType: { in: ["standard", "express"] }
            },
            include: {
                user: { select: { name: true, email: true } }
            },
            orderBy: [
                { jobType: "desc" }, // express first
                { createdAt: "asc" }
            ]
        });
        
        res.json(dbOrders.map(formatOrder));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACCEPT order
exports.acceptOrder = async (req, res) => {
    try {
        const { price } = req.body;
        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        // Find tailor profile
        const tailor = await prisma.tailor.findUnique({
            where: { userId: req.user.id }
        });

        if (!tailor) {
            return res.status(404).json({ message: "Tailor profile not found" });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parsedId },
            data: {
                tailorId: tailor.id,
                price: parseFloat(price),
                status: "accepted"
            },
            include: {
                tailor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        const formatted = formatOrder(updatedOrder);
        emitOrderUpdate(updatedOrder.userId, formatted);
        res.json(formatted);
    } catch (error) {
        console.error("Accept Order Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const dbOrders = await prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                tailor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        res.json(dbOrders.map(formatOrder));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ASSIGN TAILOR
exports.assignTailor = async (req, res) => {
    try {
        const { tailorId } = req.body;
        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await prisma.order.update({
            where: { id: parsedId },
            data: {
                tailorId: parseInt(tailorId),
                status: "accepted"
            }
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// COMPLETE ORDER
exports.completeOrder = async (req, res) => {
  try {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await prisma.order.update({
        where: { id: parsedId },
        data: { status: "completed" },
        include: {
            tailor: {
                include: {
                    user: { select: { name: true, email: true } }
                }
            }
        }
    });

    const formatted = formatOrder(order);
    emitOrderUpdate(order.userId, formatted);
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REJECT ORDER
exports.rejectOrder = async (req, res) => {
  try {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await prisma.order.update({
        where: { id: parsedId },
        data: { status: "rejected" },
        include: {
            tailor: {
                include: {
                    user: { select: { name: true, email: true } }
                }
            }
        }
    });

    const formatted = formatOrder(order);
    emitOrderUpdate(order.userId, formatted);
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CANCEL ORDER (client â€” pending only)
exports.cancelOrder = async (req, res) => {
    try {
        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const existing = await prisma.order.findUnique({ where: { id: parsedId } });
        if (!existing) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (existing.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if (existing.status !== "pending") {
            return res.status(400).json({ message: "Only pending orders can be cancelled" });
        }

        const order = await prisma.order.update({
            where: { id: parsedId },
            data: { status: "rejected" },
            include: {
                tailor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        const formatted = formatOrder(order);
        emitOrderUpdate(order.userId, formatted);
        res.json({ message: "Order cancelled", order: formatted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// RESCHEDULE ORDER (client â€” pending or accepted)
exports.rescheduleOrder = async (req, res) => {
    try {
        const { date } = req.body;
        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }
        if (!date) {
            return res.status(400).json({ message: "New date is required" });
        }

        const existing = await prisma.order.findUnique({ where: { id: parsedId } });
        if (!existing) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (existing.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if (!["pending", "accepted"].includes(existing.status)) {
            return res.status(400).json({ message: "This order cannot be rescheduled" });
        }

        const order = await prisma.order.update({
            where: { id: parsedId },
            data: { date: new Date(date) },
            include: {
                tailor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        const formatted = formatOrder(order);
        emitOrderUpdate(order.userId, formatted);
        res.json({ message: "Visit rescheduled", order: formatted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LIVE TRACKING â€” tailor + client locations, distance, ETA
exports.getOrderTracking = async (req, res) => {
    try {
        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await prisma.order.findUnique({
            where: { id: parsedId },
            include: {
                tailor: { include: { user: { select: { name: true } } } },
                user: { select: { latitude: true, longitude: true, name: true } },
            },
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (req.user.role === "user" && order.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const userLat = isValidCoord(order.user?.latitude, order.user?.longitude)
            ? order.user.latitude
            : (isValidCoord(order.latitude, order.longitude) ? order.latitude : null);
        const userLng = isValidCoord(order.user?.latitude, order.user?.longitude)
            ? order.user.longitude
            : (isValidCoord(order.latitude, order.longitude) ? order.longitude : null);

        const tailorLat = order.tailor?.latitude;
        const tailorLng = order.tailor?.longitude;
        const hasTailorLoc = isValidCoord(tailorLat, tailorLng);
        const hasUserLoc = isValidCoord(userLat, userLng);

        let distanceKm = null;
        let etaMinutes = null;
        if (hasTailorLoc && hasUserLoc) {
            distanceKm = haversineKm(userLat, userLng, tailorLat, tailorLng);
            etaMinutes = calcEtaMinutes(distanceKm);
        }

        res.json({
            orderId: order.id,
            status: order.status,
            garmentType: order.garmentType,
            tailor: order.tailor ? {
                name: order.tailor.user?.name || "Your tailor",
                lat: hasTailorLoc ? tailorLat : null,
                lng: hasTailorLoc ? tailorLng : null,
            } : null,
            user: {
                lat: userLat,
                lng: userLng,
            },
            distanceKm,
            etaMinutes,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// PATCH /api/bookings/:id/status - PRD lifecycle endpoint for stitching bookings
exports.updateBookingStatus = async (req, res) => {
    try {
        const parsedId = parseInt(req.params.id, 10);
        const { status } = req.body;
        if (Number.isNaN(parsedId)) return res.status(400).json({ message: "Invalid booking ID" });

        const validStatuses = ["pending", "accepted", "in_progress", "completed", "cancelled", "rejected"];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

        const existing = await prisma.order.findUnique({ where: { id: parsedId }, include: { tailor: true } });
        if (!existing) return res.status(404).json({ message: "Booking not found" });
        if (req.user.role === "user" && (existing.userId !== req.user.id || existing.status !== "pending" || status !== "cancelled")) {
            return res.status(403).json({ message: "Customers can only cancel pending bookings" });
        }
        if (req.user.role === "tailor") {
            const tailor = await prisma.tailor.findUnique({ where: { userId: req.user.id } });
            if (!tailor) return res.status(404).json({ message: "Tailor profile not found" });
            if (existing.tailorId && existing.tailorId !== tailor.id) return res.status(403).json({ message: "Unauthorized" });
        }

        const order = await prisma.order.update({
            where: { id: parsedId },
            data: { status },
            include: { tailor: { include: { user: { select: { name: true, email: true } } } }, review: true, user: { select: { name: true, email: true } } }
        });
        const formatted = formatOrder(order);
        emitOrderUpdate(order.userId, formatted);
        if (order.user?.email) {
          sendNotificationEmail({
            to: order.user.email,
            subject: `DarziAtDoor Booking Update: Order #${order.id}`,
            text: `Your stitching booking #${order.id} for ${order.garmentType} has been updated to: ${status.toUpperCase()}.`,
          });
        }
        res.json({ message: "Booking status updated", order: formatted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

