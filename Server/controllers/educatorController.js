import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import { CourseProgress } from '../models/CourseProgress.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'
import { getRequestUserId } from '../utils/auth.js'

// update role to educator
export const updateRoleToEducator = async (req, res) => {

    try {

        const userId = getRequestUserId(req)

        if (!userId) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add New Course
export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body

        const imageFile = req.file

        const educatorId = getRequestUserId(req)

        if (!educatorId) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = JSON.parse(courseData)

        parsedCourseData.educator = educatorId

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        const newCourse = await Course.create({
            ...parsedCourseData,
            courseThumbnail: imageUpload.secure_url
        })

        res.status(201).json({ success: true, message: 'Course Added', course: newCourse })

    } catch (error) {

        res.status(500).json({ success: false, message: error.message })

    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {

        const educator = getRequestUserId(req)

        if (!educator) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        const courses = await Course.find({ educator })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Delete an educator's course and clear student enrollment references
export const deleteCourse = async (req, res) => {
    try {
        const educator = getRequestUserId(req)

        if (!educator) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        const course = await Course.findOne({ _id: req.params.id, educator })

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' })
        }

        await Promise.all([
            User.updateMany({ enrolledCourses: course._id }, { $pull: { enrolledCourses: course._id } }),
            CourseProgress.deleteMany({ courseId: course._id.toString() })
        ])

        await course.deleteOne()

        res.json({ success: true, message: 'Course deleted' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = getRequestUserId(req);

        if (!educator) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        const completedPurchaseRows = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl');

        const enrolledStudentsData = [];
        const seenStudentCoursePairs = new Set();

        for (const purchase of completedPurchaseRows) {
            const student = purchase.userId;
            if (!student) continue;

            const course = await Course.findById(purchase.courseId).select('courseTitle');
            const key = `${student._id}-${purchase.courseId.toString()}`;

            if (seenStudentCoursePairs.has(key) || !course) continue;
            seenStudentCoursePairs.add(key);

            enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
            });
        }

        for (const course of courses) {
            const fallbackStudents = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            for (const student of fallbackStudents) {
                const key = `${student._id}-${course._id.toString()}`;
                if (seenStudentCoursePairs.has(key)) continue;
                seenStudentCoursePairs.add(key);

                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            }
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = getRequestUserId(req);

        if (!educator) {
            return res.json({ success: false, message: 'Not authenticated' })
        }

        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        const seenRecords = new Set(
            enrolledStudents.map(student => `${student.student?._id || student.student}-${student.courseTitle}`)
        );

        for (const course of courses) {
            const fallbackStudents = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            for (const student of fallbackStudents) {
                const key = `${student._id}-${course.courseTitle}`;
                if (seenRecords.has(key)) continue;

                enrolledStudents.push({
                    student,
                    courseTitle: course.courseTitle,
                    purchaseDate: course.createdAt || new Date()
                });
                seenRecords.add(key);
            }
        }

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
