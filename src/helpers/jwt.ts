import jwt from "jsonwebtoken";
import config from "config";


export default function generateJwtToken(userId: string): string {
    try {
        const token: string = jwt.sign({userId}, config.get<string>("jwtSecret"), { expiresIn: config.get<string>("jwtExpiration")});
        return token;
    }
    catch(error) {
        throw new Error("Error not generating")
    }
}