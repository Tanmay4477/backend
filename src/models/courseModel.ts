import {model, Schema, Document} from "mongoose"
import { CourseType } from "../types/courseType"

export interface NewCourseType extends CourseType, Document {}

const CourseSchema: Schema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
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
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    videoUrls: [{
        type: String,
    }]
}, {
    strict: true,
    collection: "Course",
    versionKey: false,
    timestamps: true
})

const Course = model<NewCourseType>("Course", CourseSchema)
export default Course