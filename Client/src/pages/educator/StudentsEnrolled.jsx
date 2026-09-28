import { useContext, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext'

const StudentsEnrolled = () => {
  const { allCourses } = useContext(AppContext)
  const [searchQuery, setSearchQuery] = useState('')

  const students = useMemo(() => allCourses.flatMap((course) =>
    (course.enrolledStudents || []).map((student, index) => {
      const studentData = typeof student === 'object' && student !== null
        ? student
        : { id: String(student) }

      return {
        ...studentData,
        courseTitle: course.courseTitle,
        rowId: `${course._id}-${studentData._id || studentData.id || index}`
      }
    })
  ), [allCourses])

  const filteredStudents = students.filter((student) => {
    const searchableText = [
      student.name,
      student.fullName,
      student.email,
      student.id,
      student._id,
      student.courseTitle
    ].filter(Boolean).join(' ').toLowerCase()

    return searchableText.includes(searchQuery.trim().toLowerCase())
  })

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Learner activity</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Students enrolled</h1>
          <p className="mt-2 text-sm text-slate-500">Review the learners registered in your courses.</p>
        </div>
        <p className="w-fit rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{students.length}</span> enrollments
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">Enrollment list</h2>
            <p className="mt-1 text-xs text-slate-500">Search by learner, ID, or course.</p>
          </div>
          <label className="block sm:w-72">
            <span className="sr-only">Search students</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search enrollments"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Student</th>
                  <th className="px-6 py-3.5 font-semibold">Course</th>
                  <th className="px-6 py-3.5 font-semibold">Student ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student, index) => {
                  const studentName = student.name || student.fullName || student.email?.split('@')[0] || `Learner ${index + 1}`
                  const studentId = student._id || student.id || 'Not available'

                  return (
                    <tr key={student.rowId} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-800">
                            {studentName.slice(0, 1).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-medium text-slate-800">{studentName}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{student.email || 'Learner account'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{student.courseTitle}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{studentId}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <h2 className="font-semibold text-slate-900">{students.length ? 'No matching enrollments' : 'No students enrolled yet'}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {students.length ? 'Try another name, ID, or course title.' : 'Learners will appear here after enrolling in a course.'}
            </p>
          </div>
        )}
      </section>
    </section>
  )
}

export default StudentsEnrolled