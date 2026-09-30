import mongoose from "mongoose"

const courseProgessSchema = new mongoose.Schema({
    userId:{type:string ,required:ture},
    courseId:{type:string ,required:ture},
    completed:{type:string ,required:ture},
    lectureCompleted: []
},{minimize:false})

const CourseProgress = mongoose.model('CourseProgress',courseProgessSchema)

export default CourseProgress