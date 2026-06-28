const prisma = require("../config/db");

const getMyTailor = async (userId) => prisma.tailor.findUnique({ where: { userId } });
const productData = (body) => ({
  name: String(body.name || "").trim(),
  category: String(body.category || "other").trim().toLowerCase(),
  description: body.description ? String(body.description) : null,
  price: parseInt(body.price, 10),
  stock: parseInt(body.stock ?? 0, 10),
  images: Array.isArray(body.images) ? body.images : (body.image ? [String(body.image)] : []),
  isActive: body.isActive === undefined ? true : Boolean(body.isActive),
  isOnSale: Boolean(body.isOnSale),
});

exports.createProduct = async (req, res) => {
  try {
    const tailor = await getMyTailor(req.user.id);
    if (!tailor) return res.status(404).json({ message: "Tailor profile not found" });
    const data = productData(req.body);
    if (!data.name || !Number.isFinite(data.price)) return res.status(400).json({ message: "Product name and price are required" });
    const product = await prisma.product.create({ data: { ...data, tailorId: tailor.id } });
    res.status(201).json({ message: "Product added", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });
    const tailor = await getMyTailor(req.user.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!tailor || !product) return res.status(404).json({ message: "Product not found" });
    if (product.tailorId !== tailor.id) return res.status(403).json({ message: "Unauthorized" });
    const data = productData({ ...product, ...req.body });
    const updated = await prisma.product.update({ where: { id }, data });
    res.json({ message: "Product updated", product: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });
    const tailor = await getMyTailor(req.user.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!tailor || !product) return res.status(404).json({ message: "Product not found" });
    if (product.tailorId !== tailor.id) return res.status(403).json({ message: "Unauthorized" });
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
