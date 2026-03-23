const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tailorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tailor",
        required: true
    },
    serviceType: {
        type: String,
        enum: ["stitching", "alteration"],
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "in_progress", "completed"],
        default: "pending",
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);