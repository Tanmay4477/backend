import HTTPStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import {JsonType, LoginType, ParticularCourse} from "../utils/JsonType";
import { UserTypeWithoutCourses } from '../utils/zod';
import User from '../models/userModel';
import { hashPassword, verifyPassword } from "../helpers/password"
import { NewUserType } from '../models/userModel';
import generateJwtToken from '../helpers/jwt';
import Course, { NewCourseType } from '../models/courseModel';

export async function signupRoute(
  req: Request,
  res: Response<JsonType|LoginType>,
): Promise<any> {
  try {
    const schema = UserTypeWithoutCourses.safeParse(req.body);
    if(schema.success === false) {
      console.log(schema.error.issues[0].message)
      return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: schema.error.issues[0].message});
    }
    const username: string = schema.data.username;
    const password: string = schema.data.password;

    const usernameExists = await User.findOne({username});

    if(usernameExists) {
        return res.status(HTTPStatusCodes.CONFLICT).json({ msg: "Already Signup, please login "});
    };

    const hashedPassword: string = await hashPassword(password);
    const user: NewUserType = await User.create({username: username, password: hashedPassword});
    if (!user) {
        return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong"});
    }

    const id:string = String(user._id);
    const token: string = generateJwtToken(id);
    return res.status(HTTPStatusCodes.OK).json({ msg: "Signup Successful", token: token });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}


export async function loginRoute(req: Request, res: Response<JsonType|LoginType>): Promise<any> {
  try {
    const schema = UserTypeWithoutCourses.safeParse(req.body);
    if(schema.success === false) {
        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: schema.error.issues[0].message });
    }
    const username: string = schema.data.username;
    const password: string = schema.data.password;

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

export async function purchaseRoute(req: any, res: Response<JsonType>): Promise<any> {
  try {
    const id: string = req.params.id;

    const course: NewCourseType | null = await Course.findById(id);
    if(!course) {
      return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: "Course not available "});
    }
    if(!req.userId) {
      return res.status(HTTPStatusCodes.BAD_GATEWAY).json({ msg: "Login First" });
    }

    const previousUsers = course.users;
    previousUsers.push(req.userId);
    return res.status(HTTPStatusCodes.OK).json({ msg: "Purchase Successful" })

  } catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function allPurchaseCourseRoute(req: any, res: Response<JsonType | ParticularCourse>): Promise<any> {
  try {
    const user: NewUserType | null = await User.findById(req.userId);
    if(!req.userId) {
      return res.status(HTTPStatusCodes.BAD_GATEWAY).json({ msg: "Login First" });
    }
    if(!user) {
      return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: "User not found "});
    }
    
    const courses: any = user.courseId;
    console.log(courses, "coursesssssss");
    
    return res.status(HTTPStatusCodes.OK).json({ msg: "Fetched Successfully", courses: courses })

  } catch (error) {
    throw new Error("Something went wrong");
  }
}