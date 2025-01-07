import express, { Express } from "express";
import apiRoutes from "./routes/main"
import connectDb from "./db/database";
import config from "config";
import cors from "cors";

connectDb();

const app: Express = express();
const port: number = config.get("port") || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/v1", apiRoutes)

app.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`)
});