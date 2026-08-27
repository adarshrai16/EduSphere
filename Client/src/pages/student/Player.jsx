import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Player = () => {

    const { id } = useParams()

    const {
        allCourses,
        markLectureCompleted,
        isLectureCompleted
    } = useContext(AppContext)

    const [openChapter, setOpenChapter] = useState(0)
    const [selectedLecture, setSelectedLecture] = useState(null)

    const course = allCourses.find(
        course => course._id === id
    )


    if (!course) {
        return (
            <div className="course-not-found">
                <h2>Course not found</h2>
            </div>
        )
    }


    // Mark current lecture completed
    const handleCompleteLecture = () => {

        if (!selectedLecture) {
            return
        }

        markLectureCompleted(
            selectedLecture.lectureId
        )
    }


    return (
        <div className="player-page">


            {/* ================= MAIN ================= */}

            <div className="player-main">

                {/* VIDEO */}

                <div className="player-video">

                    {selectedLecture?.lectureUrl ? (

                        <video
                            src={selectedLecture.lectureUrl}
                            controls
                            autoPlay
                        />

                    ) : (

                        <div className="video-placeholder">

                            <div>

                                <div className="play-circle">
                                    ▶
                                </div>

                                <p>
                                    Select a lecture to start learning
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* LECTURE INFORMATION */}

                {selectedLecture && (

                    <div className="player-lecture-info">

                        <h1>
                            {selectedLecture.lectureTitle}
                        </h1>

                        <p>
                            {course.courseTitle}
                        </p>


                        {/* COMPLETE BUTTON */}

                        <button
                            className={
                                isLectureCompleted(
                                    selectedLecture.lectureId
                                )
                                    ? 'completed-button'
                                    : 'complete-button'
                            }

                            onClick={handleCompleteLecture}
                        >

                            {isLectureCompleted(
                                selectedLecture.lectureId
                            )
                                ? '✓ Completed'
                                : 'Mark as Complete'
                            }

                        </button>

                    </div>

                )}

            </div>


            {/* ================= SIDEBAR ================= */}

            <div className="player-sidebar">

                <div className="player-sidebar-title">

                    <h2>
                        Course Content
                    </h2>

                    <p>
                        {course.courseContent?.length || 0}
                        {' '}chapters
                    </p>

                </div>


                {course.courseContent?.map(
                    (chapter, chapterIndex) => (

                        <div
                            className="player-chapter"
                            key={
                                chapter.chapterId ||
                                chapterIndex
                            }
                        >

                            {/* CHAPTER */}

                            <div
                                className="player-chapter-header"

                                onClick={() =>
                                    setOpenChapter(
                                        openChapter === chapterIndex
                                            ? -1
                                            : chapterIndex
                                    )
                                }
                            >

                                <div>

                                    <span>
                                        {openChapter === chapterIndex
                                            ? '⌃'
                                            : '⌄'
                                        }
                                    </span>

                                    <span>
                                        Chapter {chapterIndex + 1}:{' '}
                                        {chapter.chapterTitle}
                                    </span>

                                </div>

                                <span>
                                    {
                                        chapter.chapterContent?.length ||
                                        0
                                    }
                                </span>

                            </div>


                            {/* LECTURES */}

                            {openChapter === chapterIndex && (

                                <div className="player-lectures">

                                    {chapter.chapterContent?.map(
                                        (
                                            lecture,
                                            lectureIndex
                                        ) => (

                                            <button
                                                key={
                                                    lecture.lectureId ||
                                                    lectureIndex
                                                }

                                                className={
                                                    selectedLecture?.lectureId ===
                                                    lecture.lectureId
                                                        ? 'player-lecture active'
                                                        : 'player-lecture'
                                                }

                                                onClick={() =>
                                                    setSelectedLecture(
                                                        lecture
                                                    )
                                                }
                                            >

                                                <span className="lecture-play">

                                                    {isLectureCompleted(
                                                        lecture.lectureId
                                                    )
                                                        ? '✓'
                                                        : '▶'
                                                    }

                                                </span>

                                                <span className="lecture-name">

                                                    {
                                                        lecture.lectureTitle
                                                    }

                                                </span>

                                                <span className="lecture-duration">

                                                    {
                                                        lecture.lectureDuration
                                                    }
                                                    {' '}min

                                                </span>

                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    )
                )}

            </div>

        </div>
    )
}

export default Player