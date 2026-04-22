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

    },
    serviceType: {
        type: String,
        enum: ["stitching", "alteration", "bespoke"],
        required: true,
        lowercase: true,
        trim: true
    },
    garmentType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    measurements: {
        chest: { type: Number },
        waist: { type: Number },
        inseam: { type: Number },
        shoulders: { type: Number }
    },
    fabricProfile: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "in_progress", "completed", "rejected"],
        default: "pending",
    },
    jobType: {
        type: String,
        enum: ["standard", "express"],
        default: "standard"
    },
    jobLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    price: {
        type: Number
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);