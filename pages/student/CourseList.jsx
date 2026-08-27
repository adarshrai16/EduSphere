import React, { useContext } from 'react'

const CourseList = () => {
  const {navigate} = useContext(AppContext)
  return (
    <>
    <div>
      <h1>Course List</h1>
      <p className='text-gray-500'><span className='text-blue-600 cursor-pointer' onClick={()=>navigate('/')}>Home</span> / <span>Course List</span></p>
    </div>
    </>
  )
}

export default CourseList
