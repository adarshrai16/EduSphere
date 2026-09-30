import Course from '../models/courseModel.js'
import User from '../models/User.js'
import Purchase from '../models/Purchase.js'
import Stripe from 'stripe'
import CourseProgress from '../models/CourseProgress.js'

// Get user data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId

        const user = await User.findById(userId)

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            user
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Get user's enrolled courses
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId

        const userData = await User
            .findById(userId)
            .populate('enrolledCourses')

        if (!userData) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            enrolledCourses: userData.enrolledCourses
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Purchase course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId

        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            return res.json({
                success: false,
                message: 'Data Not Found'
            })
        }

        const discountedPrice =
            courseData.coursePrice -
            (courseData.discount * courseData.coursePrice) / 100

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: Number(discountedPrice.toFixed(2))
        }

        const newPurchase = await Purchase.create(purchaseData)

        // Stripe
        const stripeInstance = new Stripe(
            process.env.STRIPE_SECRET_KEY
        )

        const currency = (
            process.env.CURRENCY || 'usd'
        ).toLowerCase()

        // Stripe line items
        const line_items = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle
                    },
                    unit_amount: Math.round(
                        newPurchase.amount * 100
                    )
                },
                quantity: 1
            }
        ]

        // Create Stripe checkout session
        const session =
            await stripeInstance.checkout.sessions.create({
                success_url: `${origin}/loading/my-enrollments`,
                cancel_url: `${origin}/`,
                line_items,
                mode: 'payment',
                metadata: {
                    purchaseId: newPurchase._id.toString()
                }
            })

        res.json({
            success: true,
            session_url: session.url
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

//update user course progress
export const updateUserCourseProgress = async(req,res)=>{
    try{
        const userId = req.auth.userId
        const {courseId,lectureId}= req.body
        const progressData= await CourseProgress.findOne({userId,courseId})
        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true ,message:'Lecture Already Completed'})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted :[lectureId]
            })
        }
        res.json({success: true, message:'Progress Updated'})
    }catch(error){
        res.json({
            success: false,
            message: error.message
        })
    }
}

// get user course progress
export const getUserCourseProgress = await async(req,res)=>{
    try{
        const userId = req.auth.userId
        const {courseId}= req.body
        const progressData = await CourseProgress.findOne({userId,courseId})
        res.json({success:true,progressData})
    }catch(error){
         res.json({
            success: false,
            message: error.message
        })
    }
}

// add user rating to course 
export const addUserRating = async(req,res)=>{
    const userId = req.auth.userId
    const {courseId,rating}= req.body
    if(!courseId||userId||!rating||rating<1||rating>5){
        return res.json({
            success: false,
            message: 'Invaild Details'
        })
    }
    try{
        const course= await Course.findById(courseId)
        if(!course){
            return res.json({
            success: false,
            message: 'Course not found'
        })
        }

        const user = await User.findById(userId)
        if(!user || user.enrolledCourses.includes(courseId)){
           return res.json({
            success: false,
            message: 'User has not purchased this course'
        })
        }
        
        const existingRatingIndex= course.coureseRatings.findIndex(r=>r.userId===userId)
        if(existingRatingIndex>-1){
            course.coureseRatings[existingRatingIndex].rating= addUserRating
        }else{
            course.coureseRatings.push({userId,rating})
        }
        await course.save()
        
        return res.json({success:true,message: 'Rating added'})
    }catch(error){
        return  res.json({
            success: false,
            message: error.message
        })
    }
}