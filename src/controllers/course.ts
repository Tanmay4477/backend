import HTTPStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import {JsonType, AllCoursesType} from "../utils/JsonType";
import Course from '../models/courseModel';



export async function allCourseRoute(req: Request, res: Response<AllCoursesType | JsonType>): Promise<any> {
  try {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;

    const courses: any = await Course.find({ videoUrls: { $ne: [] } }).sort({createdAt: -1}).skip((page-1)*limit).limit(limit);

    if (!courses || courses.length === 0) {
      return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: "No courses available" })
    }
    console.log(courses);
    return res.status(HTTPStatusCodes.OK).json({ msg: "Courses Fetched Successful", data: courses });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}


export async function singleCourseRoute(req: Request, res: Response<AllCoursesType | JsonType>): Promise<any> {
    try {
      const id: string = req.params.id
      const courses: any = await Course.findById(id);

      if (!courses || courses.length === 0) {
        return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: "No courses available" })
      }
      console.log(courses);
      return res.status(HTTPStatusCodes.OK).json({ msg: "Signup Successful", data: courses });
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong");
    }
}