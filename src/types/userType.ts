import { Types } from "mongoose"

export type UserType = {
    username: string,
    password: string,
    coursesId: Types.ObjectId[]
}