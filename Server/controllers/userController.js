import Course from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import mongoose from "mongoose"
import { getOrCreateUser, getRequestUserId } from "../utils/auth.js"
import { getStripeClient } from "../utils/stripeClient.js"



// Get User Data
export const getUserData = async (req, res) => {
    try {

        const userId = getRequestUserId(req)

        if (!userId) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        const user = await getOrCreateUser(userId)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Purchase Course 
export const purchaseCourse = async (req, res) => {

    let pendingPurchase

    try {
        const { courseId } = req.body
        const origin = req.get('origin')
        const userId = getRequestUserId(req)

        if (!userId || !courseId) {
            return res.status(400).json({ success: false, message: 'Course and authenticated user are required' })
        }

        const [courseData, userData] = await Promise.all([
            Course.findById(courseId),
            getOrCreateUser(userId),
        ])

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        if (!courseData || !courseData.isPublished) {
            return res.status(404).json({ success: false, message: 'Course not found or unavailable' })
        }

        if (userData.enrolledCourses.some(enrolledId => String(enrolledId) === String(courseData._id))) {
            return res.status(409).json({ success: false, message: 'Already enrolled in this course' })
        }

        if (!origin) {
            return res.status(400).json({ success: false, message: 'Request origin is required for checkout' })
        }

        const currency = process.env.CURRENCY?.toLowerCase()
        if (!currency || !/^[a-z]{3}$/.test(currency)) {
            return res.status(500).json({ success: false, message: 'CURRENCY must be configured as a three-letter ISO code' })
        }

        const amountCents = Math.round(
            (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100) * 100
        )
        pendingPurchase = await Purchase.create({
            courseId: courseData._id,
            userId,
            amount: amountCents / 100,
            currency,
        })

        const stripeInstance = getStripeClient()
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/course/${courseData._id}`,
            line_items: [{
                price_data: {
                    currency,
                    product_data: { name: courseData.courseTitle },
                    unit_amount: amountCents,
                },
                quantity: 1,
            }],
            mode: 'payment',
            metadata: { purchaseId: pendingPurchase._id.toString() },
            payment_intent_data: {
                metadata: { purchaseId: pendingPurchase._id.toString() },
            },
        })

        await Purchase.updateOne(
            { _id: pendingPurchase._id },
            {
                $set: {
                    stripeSessionId: session.id,
                    ...(typeof session.payment_intent === 'string'
                        ? { stripePaymentIntentId: session.payment_intent }
                        : {}),
                },
            }
        )

        res.json({ success: true, session_url: session.url })
    } catch (error) {
        if (pendingPurchase) {
            await Purchase.updateOne(
                { _id: pendingPurchase._id, status: 'pending' },
                { $set: { status: 'failed' } }
            ).catch(() => {})
        }

        res.status(500).json({ success: false, message: error.message })
    }
}

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {

    try {

        const userId = getRequestUserId(req)

        if (!userId) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        const userData = await getOrCreateUser(userId)

        if (!userData) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        await userData.populate('enrolledCourses')
        res.json({ success: true, enrolledCourses: userData.enrolledCourses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {

    try {

        const userId = getRequestUserId(req)
        const { courseId, lectureId } = req.body

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' })
        }

        if (!courseId || !lectureId || !mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ success: false, message: 'Valid course and lecture IDs are required' })
        }

        const [userData, courseData] = await Promise.all([
            User.findById(userId),
            Course.findById(courseId),
        ])

        if (!userData || !courseData) {
            return res.status(404).json({ success: false, message: 'User or course not found' })
        }

        const isEnrolled = userData.enrolledCourses.some(
            enrolledId => String(enrolledId) === String(courseData._id)
        )
        if (!isEnrolled) {
            return res.status(403).json({ success: false, message: 'Enroll in this course to save progress' })
        }

        const lectureIds = courseData.courseContent.flatMap(chapter =>
            chapter.chapterContent.map(lecture => lecture.lectureId)
        )
        if (!lectureIds.includes(String(lectureId))) {
            return res.status(404).json({ success: false, message: 'Lecture not found in this course' })
        }

        const progressData = await CourseProgress.findOneAndUpdate(
            { userId, courseId: courseData._id.toString() },
            { $addToSet: { lectureCompleted: String(lectureId) } },
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        )

        progressData.completed = lectureIds.length > 0 && lectureIds.every(
            completedId => progressData.lectureCompleted.includes(completedId)
        )
        await progressData.save()

        res.json({ success: true, message: 'Progress Updated', progressData })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {

    try {

        const userId = getRequestUserId(req)
        const { courseId } = req.body

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' })
        }

        if (!courseId || !mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ success: false, message: 'Valid course ID is required' })
        }

        const [userData, courseData] = await Promise.all([
            User.findById(userId),
            Course.findById(courseId),
        ])

        if (!userData || !courseData) {
            return res.status(404).json({ success: false, message: 'User or course not found' })
        }

        const isEnrolled = userData.enrolledCourses.some(
            enrolledId => String(enrolledId) === String(courseData._id)
        )
        if (!isEnrolled) {
            return res.status(403).json({ success: false, message: 'Enroll in this course to view progress' })
        }

        const progressData = await CourseProgress.findOne({
            userId,
            courseId: courseData._id.toString(),
        })

        res.json({ success: true, progressData })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {

    const userId = getRequestUserId(req);
    const { courseId, rating } = req.body;
    const numericRating = Number(rating);

    // Validate inputs
    if (!courseId || !mongoose.isValidObjectId(courseId) || !userId || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ success: false, message: 'Invalid course, user, or rating' });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.some(enrolledId => String(enrolledId) === String(course._id))) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check is user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = numericRating;
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating: numericRating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};