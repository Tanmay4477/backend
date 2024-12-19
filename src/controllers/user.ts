import HTTPStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import JsonType from "../utils/JsonType";
import { UserType } from '../utils/zod';
import User from '../models/userModel';

export async function signupRoute(
  req: Request,
  res: Response<JsonType>,
): Promise<any> {
  try {
    const schema = UserType.safeParse(req.body);
    if(schema.success === false) {
        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter valid input"});
    }
    const username: string = req.body.username;
    const password: string = req.body.password;

    const usernameExists = await User.findOne({username});

    if(usernameExists) {
        return res.status(HTTPStatusCodes.CONFLICT).json({ msg: "Already Signup, please login "});
    };

    const success = await User.create({username: username, password: password});
    if (!success) {
        return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong"});
    }
    return res.status(HTTPStatusCodes.OK).json({ msg: "Signup Successful" });
  } catch (error) {
    console.error(error);
    return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
  }
}


