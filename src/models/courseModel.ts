import {model, Schema, Document} from "mongoose"
import { CourseType } from "../types/courseType"

export interface NewCourseType extends CourseType, Document {}

const CourseSchema: Schema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const Course = model<NewCourseType>("Course", CourseSchema)
export default Course