import express from "express";

const app = express();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const users= [];

app.get("/user",(req,res)=>{
    res.send(users)
})

app.post("/user",(req,res)=>{
    const user= req.body
    users.push(user)
    res.send(users)
})