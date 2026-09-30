
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {
  const { path } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!path) return

    const timer = setTimeout(() => {
      navigate(`/${path}`)
    }, 5000)

    return () => clearTimeout(timer)
  }, [path, navigate])

  return (
    <div className="loading-page">
      <div className="loading-spinner"></div>
    </div>
  )
}

export default Loading

