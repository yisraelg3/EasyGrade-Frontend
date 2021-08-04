import React from 'react'
import { Menu } from 'antd';
import { useState } from 'react'
import { useSelector } from 'react-redux'
import TopLevelResource from '../AdminComponents/TopLevelResource'
import { withRouter } from 'react-router-dom'
import ParentDisplay from './ParentDisplay'


function ParentTeacherHome() {
    
    const state = useSelector(state => state)
    const user = state.parent.accountType !== 'Parent' ? state.admin : state.parent 

        const [current, setCurrent] = useState('students')

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e.key)
    }

  return (
      <>
      <h1>{`Hello ${user.username}`}</h1>
      
    {user.accountType !== 'Parent' ? <>
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
     <Menu.Item key="klasses">
            Classes
        </Menu.Item>
        <Menu.Item key="students">
            Students
        </Menu.Item>
    </Menu> 
    <TopLevelResource currentResource={current}/>
    </> : ''}
    <ParentDisplay/>
    </>
  )
}
export default withRouter(ParentTeacherHome)