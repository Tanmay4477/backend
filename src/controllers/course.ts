import { AllCoursesType } from './../utils/JsonType';
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


export async function allCourseRoute(req: any, res: Response<AllCoursesType | JsonType>): Promise<any> {
  try {
    const page: number = parseInt(req.query.page) || 1;
    const limit: number = parseInt(req.query.limit) || 10;

    const courses: any = await Course.find({ videoUrls: { $ne: [] } }).sort({createdAt: -1}).skip((page-1)*limit).limit(limit);

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


export async function singleCourseRoute(req: any, res: Response<AllCoursesType | JsonType>): Promise<any> {
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