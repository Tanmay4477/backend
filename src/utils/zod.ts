import {z} from "zod";

export const UserTypeWithoutCourses = z.object({
    username: z.string().min(6).max(40),
    password: z.string().min(6).max(40).refine((val) => /[A-Z]/.test(val))
})

