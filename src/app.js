const express = require("express");
const path = require("path")
const mongoose = require("mongoose")
const http = require("http")
const handlebars = require("express-handlebars")
const productRouter = require("./routes/products.router")
const cartRouter = require("./routes/cart.router")
const {viewsRouter, handleRealTimeProductsSocket} = require("./routes/views.router");
const socketIO = require("socket.io");

const PORT = 8080;
const app = express();
const server = http.createServer(app)
const io = socketIO(server);


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

//RUTAS
app.use("/", viewsRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

handleRealTimeProductsSocket(io);



app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

server.listen(PORT, () => {
    console.log("Servidor OK en puerto", PORT);
  });


const connect = async()=>{
    try{
        await mongoose.connect("mongodb+srv://ivanrosales:cursoCoder@backend-db.g9wu9xl.mongodb.net/?retryWrites=true&w=majority&appName=backend-db&dbName=curso-coderhouse",{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conectado a MongoDB")
    }catch(error){
        console.error("Error al conectar a MongoDB", error)
    }
}

connect()