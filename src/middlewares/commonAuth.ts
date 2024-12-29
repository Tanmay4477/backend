import { JsonType } from './../utils/JsonType';
import config from "config"
import { Response, NextFunction} from "express";
import HTTPStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken"

import { Payload } from "../utils/Payload";
import CustomRequest from '../utils/Request';

function commonAuth(req: any, res: Response, next: NextFunction): any{
    try {
        const token = req.header('Authorization') as string;

        if (!token) {
            return res.status(HTTPStatusCodes.UNAUTHORIZED).json({msg: "Authorization not allowed, Please provide the token"});
        }
        if (token.split(" ")[0] !== "Bearer") {
            return res.status(HTTPStatusCodes.BAD_REQUEST).json({msg: "Are you sure, you are using Bearer?"})
        }

        try {
            const payload = jwt.verify(token.split(" ")[1], config.get('jwtSecret')) as Payload;
            req.userId = payload.userId;
        } catch (error) {
            return res.status(HTTPStatusCodes.UNAUTHORIZED).json({msg: "Token invalid"});
        }
        next();
    } catch (error) {
        throw new Error("Something went wrong");
    }
}
export default commonAuth;