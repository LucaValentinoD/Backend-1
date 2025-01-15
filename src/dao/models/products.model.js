import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "products"


const productSchema = new mongoose.Schema({
    nombre: String,
    descripcion:String, 
    precio: Number,
    thumbnail:String,
    Categoria: String,
    Stock: Number,
    code: String,
    status:{
        type: Boolean,
        Default: true
    }

})
productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection,productSchema)