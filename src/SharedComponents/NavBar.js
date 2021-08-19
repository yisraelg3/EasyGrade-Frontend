import { Button, Select } from 'antd'
import React, {useState, useEffect, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { logOut, changeYear } from '../redux/LoginSlice'
import {numericSort} from './StudentsGrades'

function NavBar({history}) {

    const dispatch = useDispatch()

    const state = useSelector(state => state)
    // const user = state.login.accountType
    const gradeCategories = state.gradeCategories

    const years = numericSort([...new Set(gradeCategories.map(gc => gc.year))])
    const yearOptions = years.map(year =>  <Select.Option key={year} value={year}>{year}</Select.Option>)
    
    const [year, setYear] = useState(2020)
    let currentYear = useMemo(() => [],[])
    currentYear = year > 0 ? year : Math.max(...years)

    const handleClick = () => {
        dispatch(logOut())
        localStorage.clear()
        history.push('/')
    }
    
    useEffect(() => {
      dispatch(changeYear(year))
      setYear(currentYear)},
      [currentYear, dispatch, year]
    )
   
    const handleChange = (e) => {
      setYear(e)
    }

  return (
    <div id='navbar'>
      {history.location.pathname === '/home' ? ''  :<Button type='text' className='back-btn' onClick={()=>history.goBack()}> ↩︎:&nbsp;Back</Button>}
      <NavLink to="/home" activeStyle={{fontWeight: "bold"}} style={{color: 'white',  fontSize:'20pt'}} className='nav-bar-item'>Home</NavLink>
      <Select size='large' className='nav-bar-item' value={year} onChange={handleChange}>{yearOptions}</Select>
      <NavLink to="/"><Button size='large' type='primary' onClick={handleClick} className='log-out-btn'>Log out</Button></NavLink>
    </div>
  )
}
export default withRouter(NavBar)