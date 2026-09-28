import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const AddCourse = () => {
  const { addCourse } = useContext(AppContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    coursePrice: '',
    discount: '',
    courseThumbnail: ''
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.courseTitle.trim() || !formData.courseDescription.trim()) {
      setError('Add a course title and description before continuing.')
      return
    }

    addCourse(formData)
    navigate('/educator/mycourse')
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Course library</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Create a course</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Set up the essentials now. You can add chapters and lessons from your course list later.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/educator/mycourse')}
          className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View my courses
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Course details</h2>
            <p className="mt-1 text-sm text-slate-500">Start with the information learners will see first.</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Course title</span>
            <input
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="e.g. Practical Web Development"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <textarea
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleChange}
              required
              rows={6}
              placeholder="What will learners be able to do after completing this course?"
              className="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Thumbnail image URL</span>
            <input
              name="courseThumbnail"
              type="url"
              value={formData.courseThumbnail}
              onChange={handleChange}
              placeholder="https://example.com/course-cover.jpg"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <span className="mt-1.5 block text-xs text-slate-500">Leave blank to use the default course cover.</span>
          </label>
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Pricing</h2>
            <p className="mt-1 text-sm text-slate-500">Choose the initial course price.</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Price (USD)</span>
            <input
              name="coursePrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.coursePrice}
              onChange={handleChange}
              required
              placeholder="49.00"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Discount (%)</span>
            <input
              name="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="mt-auto border-t border-slate-100 pt-5">
            {error && <p className="mb-3 text-sm text-rose-700" role="alert">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Create course
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default AddCourse