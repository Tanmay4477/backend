import HTTPStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import {JsonType, LoginType} from "../utils/JsonType";
import { UserTypeWithoutCourses, CourseZodType, AddCourseZodType } from '../utils/zod';
import Admin from '../models/adminModel';
import { hashPassword, verifyPassword } from "../helpers/password"
import { NewAdminType } from '../models/adminModel';
import generateJwtToken from '../helpers/jwt';
import Course, { NewCourseType } from '../models/courseModel';
import CustomRequest from '../utils/Request';


export async function adminSignup(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const schema = UserTypeWithoutCourses.safeParse(req.body);
    if(schema.success === false) {
        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter valid input"});
    }
    const username: string = schema.data.username;
    const password: string = schema.data.password;

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
    const username: string = schema.data.username;
    const password: string = schema.data.password;

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
        const {title, description, content, price, imageUrl, videoUrls} = schema.data;
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
    const course: NewCourseType | null = await Course.findById(id);

    if(!course) {
      return res.status(HTTPStatusCodes.OK).json({ msg: "Unsuccessful, Course is not deleted yet, please try again later"});
    }

    if(course.adminId.toString() !== req.userId) {
      return res.status(HTTPStatusCodes.BAD_GATEWAY).json({ msg: "You are not eligible to delete this course" });
    }

    const deletedCourse: NewCourseType | null = await Course.findByIdAndDelete(id);
    console.log(deletedCourse);
    return res.status(HTTPStatusCodes.OK).json({ msg: "Course Deleted Successfully"});
  }
  catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function addContent(req: any, res: Response<JsonType>): Promise<any> {
  try {
    const id: string = req.params.id;
    const course: NewCourseType | null = await Course.findById(id);

    if(!course) {
      return res.status(HTTPStatusCodes.OK).json({ msg: "Unsuccessful, Course is not deleted yet, please try again later"});
    }

    if(course.adminId.toString() !== req.userId) {
      return res.status(HTTPStatusCodes.BAD_GATEWAY).json({ msg: "You are not eligible to edit this course" });
    }

    const schema = AddCourseZodType.safeParse(req.body);
    if(schema.success === false) {
      return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: "Please enter all inputs"});
    }

    const videos: string[] = schema.data.videoUrls;

    const updatedValue: NewCourseType | null = await Course.findByIdAndUpdate(id, { $push: { videoUrls: { $each: videos}}});
    console.log(updatedValue, "kjfnvdkjvj");

    if(!updatedValue) {
      return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: "Not able to update Urls"});
    }

    return res.status(HTTPStatusCodes.OK).json({ msg: "Course Updated Successfully"});
  }
  catch (error) {
    throw new Error("Something went wrong");
  }
}