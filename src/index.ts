import express, { Express } from "express";
import apiRoutes from "./routes/main"
import bodyParser from "body-parser";
import connectDb from "./config/database";

connectDb();

const app: Express = express();
const oldPort: string = process.env.PORT || "3001";
const port: number = parseInt(oldPort);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/v1", apiRoutes)

app.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`)
});