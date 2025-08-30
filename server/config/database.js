import mongoose from "mongoose";
export async function connectDatabase(uri) {
    if (!uri)
        throw new Error("MongoDB URI is required");
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
    await mongoose.connect(uri, {
        dbName: "nutricare",
    });
}
