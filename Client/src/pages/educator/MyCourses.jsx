import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const MyCourses = () => {

  const { allCourses, deleteCourse } = useContext(AppContext)
  const navigate = useNavigate()

  const handleDeleteCourse = (course) => {
    const confirmed = window.confirm(`Delete "${course.courseTitle}"? It will also be removed from enrollments.`)

    if (confirmed) {
      deleteCourse(course._id)
    }
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Course library</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">My courses</h1>
          <p className="mt-2 text-sm text-slate-500">Review your published and draft course material.</p>
        </div>
        <button onClick={() => navigate('/educator/addcourse')} className="w-fit rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800">
          + Create course
        </button>
      </div>

      {allCourses.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {allCourses.map((course) => (
            <article key={course._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <img src={course.courseThumbnail} alt={course.courseTitle} className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-900">{course.courseTitle}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${course.isPublished === false ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
                    {course.isPublished === false ? 'Draft' : 'Published'}
                  </span>
                </div>
                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-500" dangerouslySetInnerHTML={{ __html: course.courseDescription || 'Course description not added yet.' }} />
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="text-slate-500">{course.enrolledStudents?.length || 0} learners</span>
                  <span className="font-semibold text-slate-900">${Number(course.coursePrice || 0).toFixed(2)}</span>
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                  <button onClick={() => navigate(`/course/${course._id}`)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800">
                    View course
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course)}
                    aria-label={`Delete ${course.courseTitle}`}
                    className="rounded-lg border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="font-semibold text-slate-900">Your course library is empty</h2>
          <p className="mt-1 text-sm text-slate-500">Create a course to get started.</p>
          <button onClick={() => navigate('/educator/addcourse')} className="mt-4 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Create course</button>
        </div>
      )}
    </section>
  )
}

export default MyCourses