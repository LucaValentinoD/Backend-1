import fs from "fs";

class productosRiver {
    constructor() {
        this.products = [];
        this.path = "./data/products.json";
    }

    async getProducts() {
        try {
            const file = await fs.promises.readFile(this.path, "utf-8");
            this.products = JSON.parse(file) || [];
        } catch (error) {
            console.log(error); // Manejo de error simplificado
        }
    }

    async addProductos(product) {
        try {
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
                id: this.products.length + 1,
                nombre,
                descripcion,
                precio,
                thumbnail,
                categoria,
                stock,
                code,
            };

            this.products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log("Producto agregado:", newProduct);
        } catch (error) {
            console.log(error); // Manejo de error simplificado
        }
    }

    async getProductById(id){
        try {
            await this.getProducts();
            const idRepetido = this.products.find((product) => product.id === id);
            if (idRepetido === -1) {
                throw new Error(`No se encontró el producto con ID: ${id}`);
            }
            }
        } catch (error) {
            
        }
    }

    async updateProduct(id, data) {
        try {
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
        } catch (error) {
            console.log(error); // Manejo de error simplificado
        }
    }
}

const Tienda = new productosRiver();

(async () => {

    await Tienda.updateProduct(1, { nombre: "Camiseta Actualizada River Plate 2025" });
})();
