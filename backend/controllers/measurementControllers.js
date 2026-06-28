const prisma = require("../config/db");

const numericFields = ["chest", "waist", "hips", "inseam", "shoulder", "sleeve", "neck"];
const measurementPayload = (body) => {
  const data = {};
  if (body.label !== undefined) data.label = String(body.label || "My Measurements").trim() || "My Measurements";
  if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null;
  numericFields.forEach((field) => {
    if (body[field] !== undefined && body[field] !== "") data[field] = parseFloat(body[field]);
  });
  return data;
};

exports.listMeasurements = async (req, res) => {
  try {
    const measurements = await prisma.measurement.findMany({ where: { userId: req.user.id }, orderBy: { updatedAt: "desc" } });
    res.json({ measurements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMeasurement = async (req, res) => {
  try {
    const measurement = await prisma.measurement.create({ data: { userId: req.user.id, ...measurementPayload(req.body) } });
    res.status(201).json({ message: "Measurement profile saved", measurement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMeasurement = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid measurement ID" });
    const existing = await prisma.measurement.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Measurement profile not found" });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    const measurement = await prisma.measurement.update({ where: { id }, data: measurementPayload(req.body) });
    res.json({ message: "Measurement profile updated", measurement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
