const Order = require("../models/Order");
const Tailor = require("../models/Tailor");
const mongoose = require("mongoose");

// FIND NEARBY TAILORS (Hyper-local query)
exports.findNearbyTailors = async (req, res) => {
    try {
        const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters
        
        if (!lng || !lat) {
            return res.status(400).json({ error: "Longitude and latitude are required" });
        }

        const nearbyTailors = await Tailor.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            },
            isOnline: true
        }).populate("userId", "name email");

        res.json(nearbyTailors);
    } catch (error) {
        console.error("Geospatial error:", error);
        res.status(500).json({ error: error.message });
    }
};

//create order
exports.createOrder = async (req, res) => {
    try {
        console.log("Create Order Request Body:", JSON.stringify(req.body));
        
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database not connected. Current state: " + mongoose.connection.readyState);
        }

        const { serviceType, garmentType, date, measurements, fabricProfile } = req.body;
        
        if (!req.user || !req.user.id) {
            throw new Error("Authentication failed: User ID missing in request context");
        }

        const sanitizedServiceType = serviceType?.trim().toLowerCase();
        const sanitizedGarmentType = garmentType?.trim();

        const order = await Order.create({
            userId: req.user.id,
            serviceType: sanitizedServiceType,
            garmentType: sanitizedGarmentType,
            date,
            measurements,
            fabricProfile,
            status: "pending"
        });

        res.status(201).json({ message: "Order created successfully", order });
    }
    catch (error) {
        console.error("Order Creation Error - FULL STACK:", error);
        res.status(500).json({ 
            message: "Server Error: " + error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
    }
}

//get my orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.id
        });
        res.status(200).json({ message: "Orders fetched", orders });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

// GET single order by ID for tracking
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("tailorId", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Only allow tailor or owning user to see it
        if (req.user.role === "user" && order.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access to order" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET orders assigned to tailor
exports.getTailorOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            tailorId: req.user.id
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL PENDING ORDERS (Job Pool for Tailors)
exports.getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: "pending",
            jobType: "standard"
        }).populate("userId", "name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACCEPT order
exports.acceptOrder = async (req, res) => {
    try {
        const { price } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                tailorId: req.user.id,
                price: Number(price),
                status: "accepted"
            },
            { new: true, runValidators: false }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);

    } catch (error) {
        console.error("Accept Order Error:", error);
        res.status(500).json({ error: error.message });
    }
};
// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("tailorId", "name email");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ASSIGN TAILOR
exports.assignTailor = async (req, res) => {
    try {
        const { tailorId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.tailorId = tailorId;
        order.status = "accepted";

        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// COMPLETE ORDER
exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "completed" },
        { new: true, runValidators: false }
    );
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REJECT ORDER
exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true, runValidators: false }
    );
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};