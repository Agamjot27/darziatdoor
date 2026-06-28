let io = null;

exports.setIO = (socketIO) => {
    io = socketIO;
};

exports.getIO = () => io;

exports.emitOrderUpdate = (userId, order) => {
    if (!io || !userId) return;
    io.to(String(userId)).emit("order_updated", order);
};

exports.emitTailorLocation = (clientUserId, payload) => {
    if (!io || !clientUserId) return;
    io.to(String(clientUserId)).emit("tailor_location_update", payload);
};

exports.emitNewOrderToTailors = (order) => {
    if (!io) return;
    io.to("tailors").emit("new_pending_order", order);
};
