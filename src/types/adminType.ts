import { Types } from "mongoose";

export type AdminType = {
    username: string,
    password: string,
    courseId: Types.ObjectId[],
}