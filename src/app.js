const express = require("express");
const productRouter = require("./routes/products.router")
const cartRouter = require("./routes/cart.router")


const PORT = 8080;
const app = express();
app.use(express.json())


app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)


app.get("/", (req, res) => {
    res.send('Servidor con Express');
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
    console.log('Servidor OK en puerto', PORT);
});