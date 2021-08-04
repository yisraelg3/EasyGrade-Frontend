import React from 'react'
import { Menu, Button, Space } from 'antd';
import { useState } from 'react'
import { useSelector } from 'react-redux'
import TopLevelResource from './TopLevelResource'
import { Link, withRouter } from 'react-router-dom'


function Home() {
    
    const admin = useSelector(state => state.admin)
        const [current, setCurrent] = useState('teachers')

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e.key)
    }

  return (
      <>
      <h1>{`Hello ${admin.username}`}</h1>
      <Space>
        <Button type='primary' shape='round'size='medium'><Link to='/add_teacher'>Add Teacher</Link></Button>
        <Button type='primary' shape='round'size='medium'><Link to='/add_class'>Add Class</Link></Button>
        <Button type='primary' shape='round'size='medium'><Link to='/add_student'>Add Student</Link></Button>
        <Button type='primary' shape='round'size='medium'><Link to='/add_parent'>Add Parent</Link></Button>
      </Space>
      <hr/>
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="teachers">
            Teachers
        </Menu.Item>
        <Menu.Item key="klasses">
            Classes
        </Menu.Item>
        <Menu.Item key="students">
            Students
        </Menu.Item>
        <Menu.Item key="parents">
            Parents
        </Menu.Item>
    </Menu>
    <TopLevelResource currentResource={current}/>
    </>
  )
}
export default withRouter(Home)