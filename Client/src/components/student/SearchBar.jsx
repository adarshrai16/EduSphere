import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({data}) => {
  const navigate =useNavigate()
  const [input,setInput]=useState(data?data:'')
  const onSearchHandler =(e)=>{
    e.preventDefault()
    navigate('/courselist/'+input)
  }

  return (
    <div className="max-w-xl w-full h-12 md:h-14 bg-white border border-gray-500/20 rounded">
      <form onSubmit={onSearchHandler} className="flex items-center w-full h-full">

        <img
          src={assets.search_icon}
          alt="search"
          className="w-10 px-3"
        />

        <input onChange={e=>setInput(e.target.value)} value={input}
          type="text"
          placeholder="Search for courses"
          className="flex-1 h-full outline-none text-gray-500/80 text-sm"
        />

        <button
          type="submit"
          className="h-[calc(100%-8px)] bg-blue-600 hover:bg-blue-700 text-white rounded mr-1 px-7 md:px-10"
        >
          Search
        </button>

      </form>
    </div>
  )
}

export default SearchBar