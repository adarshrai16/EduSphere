import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row sm:px-8">
      <p>© {new Date().getFullYear()} EduSphere. All rights reserved.</p>
      <Link to="/" className="font-medium text-slate-600 transition hover:text-blue-700">
        Back to learning portal
      </Link>
    </footer>
  )
}

export default Footer