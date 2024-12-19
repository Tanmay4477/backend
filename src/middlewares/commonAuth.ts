import config from "config"
import { Response, NextFunction} from "express";
import HTTPStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken"

import Payload from "../utils/Payload";
import request from "../utils/Request";
import JsonType from "../utils/JsonType";


function commonAuth(req: request, res: Response<JsonType>, next: NextFunction) :void | Response<JsonType>{
    try {
        const token = req.header('authorization');

        if (!token) {
            return res.status(HTTPStatusCodes.UNAUTHORIZED).json({msg: "Authorization not allowed, Please provide the token"});
        }

        try {
            const payload = jwt.verify(token, config.get('jwtSecret')) as Payload;
            req.userId = payload.userId;
            req.role = payload.role
        } catch (error) {
            console.log(error);
            return res.status(HTTPStatusCodes.UNAUTHORIZED).json({msg: "Token expired"});
        }
        next();
    } catch (error) {
        return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({msg: "Something went wrong"});
    }
}

export default commonAuth