import { Types } from "mongoose";

export type CourseType = {
    adminId: Types.ObjectId,
    users: Types.ObjectId[],
    title: string,
    description: string,
    content: string,
    price: number,
    imageUrl: string,
    videoUrls: Array<string>
}