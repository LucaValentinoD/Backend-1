import fs from "fs";
import { v4 as uuid } from "uuid";

export class Messages{
    constructor(){
        this.message=[];
        this.path = "./src/managers/data/messages.json"
    }
async getMessages() {
    const file = await fs.promises.readFile(this.path, "utf-8");
    const fileParse = JSON.parse(file);

    this.message = fileParse || [];

    return this.message;
}

    async addMessage(user,message) {
            await this.getMessages();

            const newMessage = {
            user: user,
            message: message,
            }; 
            
            this.message.push(newMessage);
            await fs.promises.writeFile(this.path, JSON.stringify(this.message, null, 2));
            console.log("Mensaje agregado:", newMessage);
        
        }



}
