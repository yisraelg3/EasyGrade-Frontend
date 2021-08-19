import React, { useState } from 'react'
import { Menu } from 'antd';
import { useSelector } from 'react-redux'
import TopLevelResource from '../AdminComponents/TopLevelResource'
import { withRouter } from 'react-router-dom'
import ParentDisplay from '../ParentComponents/ParentDisplay'
import SearchBar from '../SharedComponents/SearchBar'


function ParentTeacherHome() {
    
    const state = useSelector(state => state)
    const user = state.user 
// debugger
        const [current, setCurrent] = useState('students')
        const [searchTerm, setSearchTerm] = useState('')

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e.key)
        setSearchTerm('')
    }

  return (
      <>
      <h1>{`Hello ${user.professional_title}`}</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} current={current}/>
                <br/>
    {user.accountType !== 'Parent' ? <>
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
     <Menu.Item key="klasses">
            Classes
        </Menu.Item>
        <Menu.Item key="students">
            Students
        </Menu.Item>
    </Menu> 
    <TopLevelResource currentResource={current} searchTerm={searchTerm}/>
    </> : ''}
    <ParentDisplay/>
    </>
  )
}
export default withRouter(ParentTeacherHome)