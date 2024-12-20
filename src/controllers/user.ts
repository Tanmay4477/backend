import HTTPStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import {JsonType, LoginType} from "../utils/JsonType";
import { UserTypeWithoutCourses } from '../utils/zod';
import User from '../models/userModel';
import { hashPassword, verifyPassword } from "../helpers/password"
import { NewUserType } from '../models/userModel';
import generateJwtToken from '../helpers/jwt';

export async function signupRoute(
  req: Request,
  res: Response<JsonType>,
): Promise<any> {
  try {
    const schema = UserTypeWithoutCourses.safeParse(req.body);
    if(schema.success === false) {
        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter valid input"});
    }
    const username: string = req.body.username;
    const password: string = req.body.password;

    const usernameExists = await User.findOne({username});

    if(usernameExists) {
        return res.status(HTTPStatusCodes.CONFLICT).json({ msg: "Already Signup, please login "});
    };

    const hashedPassword: string = await hashPassword(password);
    const success = await User.create({username: username, password: hashedPassword});
    if (!success) {
        return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong"});
    }
    return res.status(HTTPStatusCodes.OK).json({ msg: "Signup Successful" });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}


export async function loginRoute(req: Request, res: Response<JsonType|LoginType>): Promise<any> {
  try {
    const schema = UserTypeWithoutCourses.safeParse(req.body);
    if(schema.success === false) {
        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter valid input"});
    }
    const username: string = req.body.username;
    const password: string = req.body.password;

    const user: NewUserType | null = await User.findOne({username});

    if(user === null) {
        return res.status(HTTPStatusCodes.CONFLICT).json({ msg: "Username or Password is incorrect"});
    };
    const typedUser = user as NewUserType
    const success: boolean = await verifyPassword(password, typedUser.password);

    if(!success) {
      return res.status(HTTPStatusCodes.CONFLICT).json({ msg: "Username or Password is incorrect"});
    }

    const id: string = String(typedUser._id);
    const token: string = generateJwtToken(id);
    return res.status(HTTPStatusCodes.OK).json({ msg: "Login Successful", token: token })

  } catch (error) {
    throw new Error("Something went wrong");
  }
}