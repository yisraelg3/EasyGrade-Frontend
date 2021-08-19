import React from 'react'
import { Input } from 'antd';

export default function SearchBar({searchTerm, setSearchTerm}) {
    // const { Search } = Input;

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

  return (
    <div align='center'>
        <Input placeholder='Search' value={searchTerm} onChange={handleChange} style={{ width: 400 }}/>
    </div>
  )
}
