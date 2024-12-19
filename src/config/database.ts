import { connect } from "mongoose";
import config from "config";

const connectDb = async () => {
    try {
        console.log(config, "ffffffffffffff");
        const mongoURI: string = config.get("mongoURI") || "";
        console.log(mongoURI, "CKJDNVDKJ")
        await connect(mongoURI);
    } catch (error) {
        process.exit(1);
    }
};

export default connectDb;
