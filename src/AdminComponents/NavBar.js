import { Button, Select } from 'antd'
import React, {useState, useEffect, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { changeYear, logOut } from '../AdminComponents/AdminSlice'
import {numericSort} from './StudentsGrades'

function NavBar({history}) {

    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(logOut())
        localStorage.clear()
    }

    const gradeCategories = useSelector(state => state.admin.grade_categories)

    const years = numericSort([...new Set(gradeCategories.map(gc => gc.year))])
    const yearOptions = years.map(year =>  <Select.Option key={year} value={year}>{year}</Select.Option>)
    
    const [year, setYear] = useState('')
    let currentYear = useMemo(() => [],[])
    currentYear = year>0 ? year : Math.max(...years)
    
    useEffect(() => {
      dispatch(changeYear(year))
      setYear(currentYear)},
      [currentYear, dispatch, year]
    )
   
    const handleChange = (e) => {
      setYear(e)
    }

  return (
      <div>
    {history.location.pathname === '/home' ? ''  : <><Button onClick={()=>history.goBack()}> ↩︎ Back</Button>
    <NavLink to="/home" activeStyle={{ fontWeight: "bold", color: "blue", position: 'absolute', top: '0%', left: '50%' }}>Home</NavLink></>}
    <Select value={year} onChange={handleChange}>{yearOptions}</Select>
    <NavLink to="/"><Button onClick={handleClick}>Log out</Button></NavLink>
    </div>
  )
}
export default withRouter(NavBar)