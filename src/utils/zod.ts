import {z} from "zod";

export const UserTypeWithoutCourses = z.object({
    username: z.string().min(6, {message: "Username is too short"}).max(40, {message: "Username is too large"}),
    password: z.string().min(6, {message: "Password is too short"}).max(40, {message: "Password is too large"}).refine((val) => /[A-Z]/.test(val), {message: "One letter should be uppercase"})
})

export const CourseZodType = z.object({
    title: z.string({message: "It should be a valid string"}).min(1, {message: "Atleast 1 character"}).max(60, {message: "Content is too long"}).optional(),
    description: z.string({message: "It should be a valid string"}).min(1, {message: "Atleast 1 character"}).max(200, {message: "Content is too long"}).optional(),
    content: z.string({message: "It should be a valid string"}).min(1, {message: "Atleast 1 character"}).max(1000, {message: "Content is too long"}).optional(),
    price: z.number({message: "It should be a valid number"}).positive({message: "Price should be atleast ₹1"}),
    imageUrl: z.string({message: "It should be a valid string"}).url({message: "It should be a valid url"}),
    videoUrls: z.array(z.string({message: "It should be a valid string"}).url({message: "It should be a valid url"})).optional()
})

export const AddCourseZodType = z.object({
    videoUrls: z.array(z.string({message: "It should be a valid string"}).url({message: "It should be a valid url"}))
})