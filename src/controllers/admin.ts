import HTTPStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import {JsonType, LoginType} from "../utils/JsonType";
import { UserTypeWithoutCourses, CourseZodType } from '../utils/zod';
import Admin from '../models/adminModel';
import { hashPassword, verifyPassword } from "../helpers/password"
import { NewAdminType } from '../models/adminModel';
import generateJwtToken from '../helpers/jwt';
import Course, { NewCourseType } from '../models/courseModel';
import request from '../utils/Request';
import { CourseType } from '../types/courseType';


export async function adminSignup(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const schema = UserTypeWithoutCourses.safeParse(req.body);
    if(schema.success === false) {
        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter valid input"});
    }
    const username: string = req.body.username;
    const password: string = req.body.password;

    const usernameExists = await Admin.findOne({username});

    if(usernameExists) {
        return res.status(HTTPStatusCodes.CONFLICT).json({ msg: "Already Signup, please login "});
    };

    const hashedPassword: string = await hashPassword(password);
    const success = await Admin.create({username: username, password: hashedPassword});
    if (!success) {
        return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong"});
    }
    return res.status(HTTPStatusCodes.OK).json({ msg: "Signup Successful" });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

export async function adminLogin(req: Request, res: Response<JsonType|LoginType>): Promise<any> {
  try {
    const schema = UserTypeWithoutCourses.safeParse(req.body);
    if(schema.success === false) {
        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter valid input"});
    }
    const username: string = req.body.username;
    const password: string = req.body.password;

    const user: NewAdminType | null = await Admin.findOne({username});

    if(user === null) {
        return res.status(HTTPStatusCodes.CONFLICT).json({ msg: "Username or Password is incorrect"});
    };
    const typedUser = user as NewAdminType
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

export async function createCourse(req: any, res: Response<JsonType>): Promise<any> {
    try {
        const schema = CourseZodType.safeParse(req.body);
        if(schema.success === false) {
            return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter all inputs"});
        }
        const {title, description, content, price, imageUrl, videoUrls} = req.body;
        const data: any = {
          title: title,
          description: description,
          content: content, 
          price: price,
          imageUrl: imageUrl,
          videoUrls: videoUrls,
          adminId: req.userId
        }
        const success = await Course.create(data);
        console.log(success, "sucessss");
        if(!success) {
          return res.status(HTTPStatusCodes.BAD_GATEWAY).json({msg: "Not able to add Course"});
        }
        return res.status(HTTPStatusCodes.OK).json({ msg: "Course Created Successfully" })
    
    } catch (error) {
        throw new Error("Something went wrong");
    }
}



export async function deleteCourse(req: any, res: Response<JsonType>): Promise<any> {
  try {
    const id: string = req.params.id;
    console.log("id", id);

    const course = Course.findById(id);

    console.log(course, "course");


    return res.status(HTTPStatusCodes.OK).json({ msg: "Course Deleted Successfully"});
  }
  catch (error) {
    throw new Error("Something went wrong");
  }
}