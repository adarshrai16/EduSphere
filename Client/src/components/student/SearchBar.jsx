import React from 'react'
import { assets } from '../../assets/assets'

const SearchBar = ({ search, setSearch }) => {

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="search-bar">

      <form onSubmit={handleSubmit}>

        <img
          src={assets.search_icon}
          alt="Search"
        />

        <input
          type="text"
          placeholder="Search for courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">
          Search
        </button>

      </form>

    </div>
  )
}

export default SearchBar