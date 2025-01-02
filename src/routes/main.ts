import { Router } from "express";
import { signupRoute, loginRoute, purchaseRoute, allPurchaseCourseRoute } from "../controllers/user";
import { adminSignup, adminLogin, createCourse, deleteCourse, addContent } from "../controllers/admin";
import { allCourseRoute, singleCourseRoute } from "../controllers/course";
import commonAuth from "../middlewares/commonAuth"

const router: Router = Router();

router.post("/signup", signupRoute);
router.post("/login", loginRoute);
router.post("/purchase/:id", commonAuth, purchaseRoute);
router.get("/purchased", commonAuth, allPurchaseCourseRoute);

router.get("/courses", allCourseRoute);
router.get("/courses/:id", singleCourseRoute);


router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.post("/admin/course", commonAuth, createCourse);
router.patch("/admin/course/:id",commonAuth, addContent)
router.delete("/admin/course/:id",commonAuth, deleteCourse);

export default router;