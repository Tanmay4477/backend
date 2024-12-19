import {Schema, model, Document} from "mongoose";
import { AdminType } from "../types/adminType";

export interface NewAdminType extends AdminType, Document {}

const adminModel = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    courseId: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const Admin = model<NewAdminType>("Admin", adminModel);
export default Admin;