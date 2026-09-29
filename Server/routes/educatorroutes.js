import express from "express"
import { updateRoleToEducator } from "../controllers/educatorController.js"
import upload from "../configs/multer.js"
import { protectEducator } from "../middlewares/authMiddleware.js"
import { addNewCourse } from "../controllers/educatorController.js"
import { getEducatorCourses } from "../controllers/educatorController.js"
import { getEducatorDashboardData } from "../controllers/educatorController.js"
import { getEnrolledStudentsData } from "../controllers/educatorController.js"

const educatorRouter = express.Router()

//Add Educator Role 
educatorRouter.put("/update-role", updateRoleToEducator)
educatorRouter.post("/add-course", upload.single('image'), protectEducator,addNewCourse)
educatorRouter.get("/courses", protectEducator, getEducatorCourses)
educatorRouter.get("/dashboard", protectEducator, getEducatorDashboardData)
educatorRouter.get("/enrolled-students", protectEducator, getEnrolledStudentsData)

export default educatorRouter