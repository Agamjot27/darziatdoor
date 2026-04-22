const mongoose = require("mongoose");

const tailorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        skills: [String],
        experience: Number,
        availability: {
            type: Boolean,
            default: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0]
            }
        },
        isOnline: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

tailorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Tailor", tailorSchema);