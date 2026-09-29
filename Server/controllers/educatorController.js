import { clerkClient } from '@clerk/express';
import {v2 as cloudinary} from 'cloudinary'

//update role to educator
export const updateRoleToEducator = async (req,res) => {
    try{
        const userId = req.auth.userId;
        await clerClient.users.updateUserdata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })

        res.json({ success: true, message: 'You can publish a course now' })
    }catch(error){
        res.json({ success: false, message: error.message })
    }
}

//Add new course
export const addNewCourse = async (req,res) => {
    try{
        const {courseData} = req.body
        const imagefile = req.file
        const educatorId = req.auth.userId
        if(!imagefile){
            return res.json({ success: false, message: 'Please upload a course image' })
        }
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imagefile.path)
        newCourse.courseImage = imageUpload.secure_url
        await newCourse.save()
        res.json({ success: true, message: 'Course added successfully' })
    }catch(error){
        res.json({ success: false, message: error.message })
    }
}

//Get Educator Courses
export const getEducatorCourses = async (req,res) => {
    try{
        const educatorId = req.auth.userId

        const coursess = await Course.find({ educator })
        res.json({ success: true, courses })
    }catch(error){
        res.json({ success: false, message: error.message })    
    }
}

//get Educator Dashboard Data

export const getEducatorDashboardData = async (req,res) => {
    try{
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        const totalCourses = courses.length
        const courseIds = courses.map(course => course._id)
        
        // Get total earnings
        const purchases = await Purchase.find({ courseId: { $in: courseIds },status: 'success' })
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
        
        //collect unique student ids
        const enrolledStudentsData = []
        for(const course of courses){
            const students= await user.find({
                _id: { $in: course.enrolledStudents }
            },'name imageUrl')
            students.forEach(student => {
                enrolledStudentIds.push({
                    courseTilte: course.courseTitle,
                    student
                })
            })
        }
        res.json({success: true, dashboardData: {
            totalCourses,
            totalEarnings,
            enrolledStudentsData
        }})
    }catch(error){
        res.json({ success: false, message: error.message })
    }
}

//enrolled students with purchased data

export const getEnrolledStudentsData = async (req,res) => {
    try{
       const educator = req.auth.userId
       const courses = await Course.find({ educator })
       const courseIds = courses.map(course => course._id)
       
       const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'success' }).populate('userId','name email imageUrl').populate('courseId','courseTitle')
       const enrolledStudents = purchases.map(purchase => ({
        student: purchase.userId,
        courseTitle: purchase.courseId.courseTitle,
        purchaseDate: purchase.createdAt,
       }))
       res.json({ success: true, enrolledStudents })
    }catch(error){
        res.json({ success: false, message: error.message })
    }
}