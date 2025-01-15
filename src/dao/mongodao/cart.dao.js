import { cartModel } from "../models/cart.model.js";


class CartDao{
    async getAll(){
        return await cartModel.find();
    }

    async getById(id){
        return await cartModel.findById(id).populate('products.product').exec()
    }

    async create(data){
        return await cartModel.create(data);
    }

    async update(id, data){
        return await cartModel.findByIdAndUpdate(id, data, { new: true }).populate('products.product').exec()    }

    async delete(id){
        return await cartModel.findByIdAndDelete(id);
    }
    async deleteProductInCart(cid,pid){
        const cart = await cartModel.findById(cid)
        const productFilter = cart.products.filter(product => product.product != pid)
    
        return await cartModel.findByIdAndUpdate(cid, { products: productFilter }, { new: true });
    }
    async updateProductInCart(cid, pid, quantity){
        const cart = await cartModel.findById(cid)
        const product = cart.products.find(product => product.product === pid)
        product.quantity = quantity
    
        return await cartModel.findByIdAndUpdate(cid, { products: cart.products }, { new: true });
    }
    
    async deleteProductsInCart(cid){
        const cart = await cartModel.findById(cid)
        const productFilter = cart.products.filter(product => product.product !=pid)
        return await cartModel.findByIdAndUpdate(cid,{products: productFilter},{ new: true } )
    }
}

export const cartsDaoInstance = new CartDao()
