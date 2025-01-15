import { Router } from "express";
import {productosRiver} from "../dao/managers/productosRiver.js"
import { productsDaoInstance } from "../dao/mongodao/products.dao.js";

const ProductosRiver = new productosRiver();
const router = Router();

router.get("/", async (req, res)=> {
    const { limit, page, sort, category} = req.query
try{
    const options ={
        limit: limit || 10,
        page: page || 1,
        sort: {
            price: sort === "asc" ? 1 : -1
        },
        lean:true 
    };

    if (category){
        const products  = await productsDaoInstance.getAll({ category: category },options);
        console.log(category)
        return res.json({status: "ok", payload: products})
    }
    const products  = await productsDaoInstance.getAll({},options);
    res.json({status: "ok", payload: products})
}catch(error){
    console.log(error);
}
})

router.get("/:pid",async (req,res)=>{
    try {
        const {pid}= req.params
        const products= await productsDaoInstance.getById(pid);
        console.log(products)
        res.json({status: "ok", payload: products})
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

router.post("/", async (req,res)=>{

    try {
    const body = req.body;
        const products= await productsDao.create(body) 
        res.json({status: "ok", payload: products})
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

router.put("/:pid",async (req,res)=>{
    try {
        const {pid}= req.params
        const body = req.body;
        const products= await productsDao.update(pid, body, {new: true});
        console.log(products)
        res.json({status: "ok", payload: products})
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

router.delete("/:pid",async (req,res)=>{
    try {
        const {pid}= req.params
        const products= await productsDao.delete(pid);
        console.log(products)
        res.json({status: "ok", payload: `El producto con id: ${pid}, fue eliminado.`})
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})


export default router;