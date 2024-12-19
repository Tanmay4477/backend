import { UserType } from './../types/userType';
import {model, Schema, Document} from "mongoose";

export interface NewUserType extends UserType, Document {}

const UserModel: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    courseId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
})

const User = model<NewUserType>("User", UserModel);
export default User;