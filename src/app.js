import express from "express";
import handlebars from "express-handlebars"
import userRoutes from "./router/user-routes.js"
import productsRoutes from "./router/products-routes.js"
import cartsRoutes from "./router/carts-routes.js"
import { Server, Socket } from "socket.io";
import { Messages } from "./dao/managers/message.js"
import { connectMongoDB } from "./config/mongoDB.config.js";

connectMongoDB()
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use("/api/products", productsRoutes)
app.use("/api/carts", cartsRoutes)



app.get("/",(req,res)=>{
  res.render("index")

})

let messages = [];
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado con el id ${socket.id}`);

  socket.on("newUser", (data) => {
    socket.broadcast.emit("newUser", data);
  });
  socket.on("message", async (data) =>  {
    console.log(data)
    const messageManager = new Messages();
    await messageManager.addMessage(data.user, data.message);
  
    const messages = await messageManager.getMessages();
    socket.emit("messageLogs", messages); 
  });
});