import fs from "fs";
import { v4 as uuid } from "uuid";

export class CartRiver{
constructor(){
    this.cart=[];
    this.path = "./src/managers/data/cart.json"
}
async getCart() {
    const file = await fs.promises.readFile(this.path, "utf-8");
    const fileParse = JSON.parse(file);

    this.cart = fileParse || [];

    return this.cart;
}


async createCart() {
    await this.getCart();

    const newCart = {
    id: uuid(),
    products: [],
    };

    this.cart.push(newCart);

    await fs.promises.writeFile(this.path, JSON.stringify(this.cart));

    return newCart;
    }

    async getCartById(cid) {
        await this.getCart();
    
        const cart = this.cart.find((cart) => cart.id === cid);
    
        if (!cart) throw new Error("Cart not found");
    
        return cart;
    }

    async addProductToCart(cid, pid) {
        
        const cart = await this.getCartById(cid);
    
        const product = cart.products.find((productsCart) => productsCart.product === pid);
        if (!product) {

        cart.products.push({ product: pid, quantity: 1 });
        } else {

        product.quantity++;
        }
    

        await fs.promises.writeFile(this.path, JSON.stringify(this.cart));
    
        return cart;
    }
    
    async deletePrDelCart(cid, pid) {
        const cart = await this.getCartById(cid);
    
        const product = cart.products.find((productsCart) => productsCart.product === pid);
    
        if (!product) {
            return `Producto que quieres eliminar del Cart no existe!.`;
        } else {
            if (product.quantity > 1) {
                product.quantity -= 1;
            } else {
                const productIndex = cart.products.findIndex((productsCart) => productsCart.product === pid);
                cart.products.splice(productIndex, 1);
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, 2));
    
            return `Producto ${pid} actualizado en el carrito.`;
        }
    }
    
}         


















