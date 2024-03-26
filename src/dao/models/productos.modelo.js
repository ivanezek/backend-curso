const mongoose = require("mongoose")

const productosColl = "productos"
const productosSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String, 
    price: { type: Number, required: true, min: 0 },
    thumbnail: String,
    code: String,
    stock: { type: Number, required: true, min: 0 },
    status: Boolean,
    category: String
}, { timestamps: true });

const modeloProductos = mongoose.model(productosColl, productosSchema)

module.exports = {modeloProductos}