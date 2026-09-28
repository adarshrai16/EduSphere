import React from 'react'

const Loading = ({ label = 'Loading...' }) => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 sm:h-20 sm:w-20" />
        {label && <p className="text-sm font-medium text-gray-600">{label}</p>}
      </div>
    </div>
  )
}

export default Loading
