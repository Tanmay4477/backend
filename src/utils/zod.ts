import {z} from "zod";

export const UserTypeWithoutCourses = z.object({
    username: z.string().min(6).max(40),
    password: z.string().min(6).max(40).refine((val) => /[A-Z]/.test(val))
})

export const CourseZodType = z.object({
    title: z.string().min(1).max(60),
    description: z.string().min(1).max(200),
    content: z.string().min(1).max(1000).optional(),
    price: z.number().positive(),
    imageUrl: z.string().url(),
    videoUrls: z.array(z.string().url()).optional()
})

export const AddCourseZodType = z.object({
    videoUrls: z.array(z.string().url())
})