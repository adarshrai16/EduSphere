import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import { AppContext } from '../../context/AppContext'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'

const Player = () => {
    const { courseid } = useParams()
    const { enrolledCourses, isLectureCompleted, markLectureCompleted } = useContext(AppContext)

    const [courseData, setCourseData] = useState(null)
    const [openSection, setOpenSection] = useState({})
    const [selectedLecture, setSelectedLecture] = useState(null)

    const extractVideoId = (url) => {
        if (!url) return null

        try {
            const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
            return match ? match[1] : null
        } catch {
            return null
        }
    }

    useEffect(() => {
        const course = enrolledCourses.find((item) => item._id === courseid)

        setCourseData(course)

        if (course) {
            const defaultOpenState = {}
            course.courseContent.forEach((chapter, index) => {
                defaultOpenState[index] = index === 0
            })

            setOpenSection(defaultOpenState)

            const firstLecture = course.courseContent[0]?.chapterContent?.[0] || null
            setSelectedLecture(firstLecture)
        }
    }, [courseid, enrolledCourses])

    const toggleSection = (index) => {
        setOpenSection((prev) => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const handleLectureSelect = (lecture) => {
        setSelectedLecture(lecture)
        markLectureCompleted(lecture.lectureId)
    }

    const activeVideoId = selectedLecture ? extractVideoId(selectedLecture.lectureUrl) : null

    if (!courseData) {
        return (
            <>
                <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-gray-700">
                    <p className="text-lg font-medium">Course not found or not enrolled yet.</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <div className="px-4 py-8 md:px-36">
                <div className="grid gap-8 md:grid-cols-[1.05fr_1.95fr]">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">Course Structure</h2>
                        <span className="text-sm text-gray-500">{courseData.courseTitle}</span>
                    </div>

                    <div className="space-y-3">
                        {courseData.courseContent?.map((chapter, chapterIndex) => (
                            <div key={chapter.chapterId} className="overflow-hidden rounded-xl border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => toggleSection(chapterIndex)}
                                    className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Chapter {chapterIndex + 1}</p>
                                        <p className="text-sm text-gray-600">{chapter.chapterTitle}</p>
                                    </div>

                                    <span className="text-lg text-gray-500">{openSection[chapterIndex] ? '−' : '+'}</span>
                                </button>

                                {openSection[chapterIndex] && (
                                    <div className="bg-white">
                                        {chapter.chapterContent?.map((lecture) => {
                                            const isActive = selectedLecture && selectedLecture.lectureId === lecture.lectureId
                                            const isDone = isLectureCompleted(lecture.lectureId)

                                            return (
                                                <button
                                                    key={lecture.lectureId}
                                                    type="button"
                                                    onClick={() => handleLectureSelect(lecture)}
                                                    className={`flex w-full items-center justify-between border-t border-gray-200 px-4 py-3 text-left transition ${
                                                        isActive ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div>
                                                        <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                                                            {lecture.lectureTitle}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{lecture.lectureDuration} min</p>
                                                    </div>

                                                    <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                                                        isDone
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : lecture.isPreviewFree
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                        {isDone ? 'Done' : lecture.isPreviewFree ? 'Preview' : 'Locked'}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    {activeVideoId ? (
                        <>
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-black">
                                <YouTube
                                    videoId={activeVideoId}
                                    opts={{
                                        width: '100%',
                                        height: '440',
                                        playerVars: {
                                            autoplay: 0,
                                            controls: 1,
                                            rel: 0,
                                            modestbranding: 1
                                        }
                                    }}
                                />
                            </div>

                            <div className="mt-5">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                                        {selectedLecture?.isPreviewFree ? 'Preview' : 'Lesson'}
                                    </span>
                                    <span className="text-xs text-gray-500">{selectedLecture?.lectureDuration} min</span>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-800">{selectedLecture?.lectureTitle}</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    {courseData.courseTitle} • {selectedLecture?.lectureTitle}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-[440px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-500">
                            Select a lecture to watch the video.
                        </div>
                    )}

                    <Rating courseId={courseid} />
                </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Player