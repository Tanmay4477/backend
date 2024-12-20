import { NewCourseType } from "../models/courseModel"

export type JsonType = {
    msg: string
}

export type LoginType = {
    msg: string,
    token: string
}

export type AllCoursesType = {
    msg: string,
    data: NewCourseType[] | NewCourseType
}