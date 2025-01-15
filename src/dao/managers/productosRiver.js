import fs from "fs";
import {  v4 as uuid } from "uuid";

export class productosRiver {
    constructor() {
        this.products = [];
        this.path = "./src/managers/data/products.json";
    }

    async getProducts(limit) {
            const file = await fs.promises.readFile(this.path, "utf-8");
            this.products = JSON.parse(file) || [];

        if(!limit) return this.products

        return this.products.slice(0,limit)
    }

    async addProductos(product) {
            await this.getProducts();

            const { nombre, descripcion, precio, thumbnail, categoria, stock, code } = product;

            if (!code || !nombre || !descripcion || !precio || !thumbnail || !categoria || !stock) {
                throw new Error("Faltan campos por completar del Producto!");
            }

            const codeRepetido = this.products.find((prod) => prod.code === code);
            if (codeRepetido) {
                throw new Error("Ya existe este código!");
            }

            const newProduct = {
                id: uuid(),
                nombre,
                descripcion,
                precio,
                thumbnail,
                categoria,
                stock,
                code
            }; 
            
            this.products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log("Producto agregado:", newProduct);
            return newProduct;
    }

    async getProductById(id){
            await this.getProducts();
            const product = this.products.find((product) => product.id === id);
            if (!product) throw new Error(`No se encontró el producto con ID: ${id}`);
            return product;

    }

    async updateProduct(id, data) {

            await this.getProducts();

            const index = this.products.findIndex((product) => product.id === id);
            if (index === -1) {
                throw new Error(`No se encontró el producto con ID: ${id}`);
            }

            this.products[index] = {
                ...this.products[index],
                ...data,
            };

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log("Producto actualizado:", this.products[index]);

            return this.products[index]
    };

    async deleteProduct(id){
        await this.getProductById(id)
        this.products = this.products.filter((products) => products.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
        return `Producto ${id} eliminado.`

    }
}

const Tienda = new productosRiver();

