import { Router } from "express";
import {productosRiver} from "../dao/managers/productosRiver.js"
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/products.model.js";
import { productsDaoInstance } from "../dao/mongodao/products.dao.js";
import { cartsDaoInstance } from "../dao/mongodao/cart.dao.js";


const router = Router();


router.get("/", async (req, res)=> {

try{
    const carts  = await cartsDaoInstance.getAll();
    res.json({status: "ok", payload: carts})
}catch(error){
    console.log(error);
}
})

router.post("/", async (req, res) => {
try {
    const cart = await cartsDaoInstance.create({});
    console.log(cart)
    res.json({status: "ok", payload: cart})
} catch (error) {
    console.log(error);
    res.send(error.message);
}
});


router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
    const cart = await cartsDaoInstance.getById(cid);
    if (!cart) return res.json({ status: "error", message: `Carrito con id ${cid} no encontrado` });

    res.json({ status: "ok", payload: cart });
    } catch (error) {
    console.log(error);
    res.send(error.message);
    }
});
router.delete("/:cid",async (req,res)=>{
    try {
        const {cid}= req.params
        const products= await cartsDaoInstance.delete(cid);
        console.log(products)
        res.json({status: "ok", payload: `El carrito con id: ${cid}, fue eliminado.`})
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
const { cid, pid } = req.params;
try {
    const product = await productsDaoInstance.getById(pid);
    if (!product) throw new Error(`No se encuentra el producto con el id ${pid}`);
    const carrito = await cartsDaoInstance.getById(cid);
    if(!carrito) return     res.json({status: "error", message: `El carrito con ${cid} no existe capo.`})
        const cartProduct = carrito.products.find(
            (productCart) => productCart.product.toString() === pid
        );
        

        if (!cartProduct) {
            carrito.products.push({ product: pid, quantity: 1 });
        } else {
            cartProduct.quantity++;
        }
const cart = await cartsDaoInstance.update(cid,{ products: carrito.products}, {new: true})

    console.log(product,carrito)
    res.json({status: "ok", payload: cart})
} catch (error) {
    console.log(error);
    res.send(error.message);
}
});

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const { quantity } = req.body; 
        const product = await productsDaoInstance.getById(pid);
        if (!product) throw new Error(`No se encuentra el producto con el id ${pid}`);

        const carrito = await cartsDaoInstance.getById(cid);
        if (!carrito) return res.json({ status: "error", message: `El carrito con ${cid} no existe.` });

        const cartProduct = carrito.products.find(p => p.product.toString() === pid);

        if (!cartProduct) return res.json({ status: "error", message: `El producto con id ${pid} no está en el carrito.` });

        if (cartProduct.quantity <= quantity) {
            carrito.products = carrito.products.filter(p => p.product.toString() !== pid); 
        } else {
            cartProduct.quantity -= quantity;
        }

        await carrito.save();

        res.json({ status: "ok", payload: carrito });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

    

    router.put("/:cid/product/:pid", async (req, res) => {
        const {cid, pid} = req.params;
        const {quantity} = req.body;
        try {
        const product = await productsDaoInstance.getById(pid)
        if (!product) return res.json({ status: "error", message: `Product id ${pid} not found` });
    
        const cart = await cartsDaoInstance.getById(cid);
        if (!cart) return res.json({ status: "error", message: `Cart id ${cid} not found` });
    
        const cartUpdated = await cartsDaoInstance.updateProductInCart(cid, pid, quantity);
    
        res.json({ status: "ok", payload: cartUpdated });
    
        } catch (error) {
        console.log(error);
        res.send(error.message);
        }
    })
    router.delete("/:cid", async (req, res) => {
        const { cid } = req.params;
        try {
        const cart = await cartsDaoInstance.getById(cid);
        if (!cart) return res.json({ status: "error", message: `Cart id ${cid} not found` });
    
        const cartUpdated = await cartsDaoInstance.deleteProductsInCart(cid);
    
        res.json({ status: "ok", payload: cartUpdated });
    
        } catch (error) {
        console.log(error);
        res.send(error.message);
        }
    });

    


export default router;