import express, { Express } from "express";
import apiRoutes from "./routes/main"
import bodyParser from "body-parser";
import connectDb from "./db/database";
import config from "config";

connectDb();

const app: Express = express();
const port: number = config.get("port") || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/v1", apiRoutes)

app.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`)
});