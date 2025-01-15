import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
    mongoose.connect("mongodb+srv://elProfe:VbfwAwC6fIs31bhw@cluster70395.7fo4p.mongodb.net/clase-01")
    console.log("Mongo DB connected")
  } catch (error) {
    console.log(error)
  }
}
