import { connect } from "mongoose";
import dotenv from "dotenv";

const connectDb = async () => {
    try {
        dotenv.config();
        const mongoURI: string = process.env.MONGO_URL || "";
        await connect(mongoURI);
    } catch (error) {
        console.log("mongo url is down or incorrect")
        process.exit(1);
    }
};

export default connectDb;
