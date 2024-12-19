import { Router } from "express";
import { signupRoute, loginRoute } from "../controllers/user";
import { adminSignup, adminLogin, createCourse } from "../controllers/admin";

const router: Router = Router();

router.post("/signup", signupRoute);
router.post("/login", loginRoute);
// router.post("/purchase/:id", purchaseRoute);
// router.get("/courses", allCourseRoute);
// router.get("/purchased", allPurchaseCourseRoute);

router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.post("/admin/course", createCourse);
// router.delete("/admin/:id", deleteCourse);
// router.put("/admin/:id", addContent)

export default router;