import { NewCourseType } from "../models/courseModel"

export type JsonType = {
    msg: string
}

export type ParticularCourse = {
    msg: string,
    courses: NewCourseType[]
}

export type LoginType = {
    msg: string,
    token: string
}

export type AllCoursesType = {
    msg: string,
    data: NewCourseType[] | NewCourseType
}