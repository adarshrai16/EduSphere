import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {

  const { allCourses } = useContext(AppContext)
  const navigate = useNavigate()

  const totalCourses = allCourses.length

  const totalStudents = allCourses.reduce(
    (total, course) => total + (course.enrolledStudents?.length || 0),
    0
  )

  const totalRevenue = allCourses.reduce(
    (total, course) =>
      total + (course.coursePrice || 0) * (course.enrolledStudents?.length || 0),
    0
  )

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Overview</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Educator dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">A clear view of your courses and learners.</p>
        </div>
        <button onClick={() => navigate('/educator/addcourse')} className="w-fit rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800">
          + Create course
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Courses', value: totalCourses, icon: assets.my_course_icon, accent: 'bg-blue-50 text-blue-700' },
          { label: 'Learner enrollments', value: totalStudents, icon: assets.person_tick_icon, accent: 'bg-emerald-50 text-emerald-700' },
          { label: 'Gross course revenue', value: `$${totalRevenue.toFixed(2)}`, icon: assets.earning_icon, accent: 'bg-amber-50 text-amber-700' }
        ].map((stat) => (
          <article key={stat.label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}>
              <img src={stat.icon} alt="" className="h-5 w-5 object-contain" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-1 truncate text-2xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">Recent courses</h2>
            <p className="mt-1 text-xs text-slate-500">Your latest course activity</p>
          </div>
          <button onClick={() => navigate('/educator/mycourse')} className="text-sm font-semibold text-blue-700 hover:text-blue-900">View all</button>
        </div>

        {allCourses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {allCourses.slice(0, 5).map((course) => (
              <div key={course._id} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
                <img src={course.courseThumbnail} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover sm:h-14 sm:w-20" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-800">{course.courseTitle}</h3>
                  <p className="mt-1 text-xs text-slate-500">{course.enrolledStudents?.length || 0} learners · ${Number(course.coursePrice || 0).toFixed(2)}</p>
                </div>
                <button onClick={() => navigate(`/course/${course._id}`)} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">View</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-800">No courses yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first course to start building your library.</p>
            <button onClick={() => navigate('/educator/addcourse')} className="mt-4 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Create course</button>
          </div>
        )}
      </section>
    </section>
  )
}

export default Dashboard