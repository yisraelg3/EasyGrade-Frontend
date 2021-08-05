import React from 'react'
import { Menu, Button, Space, Divider } from 'antd';
import { useState } from 'react'
import { useSelector } from 'react-redux'
import TopLevelResource from './TopLevelResource'
import { Link, withRouter } from 'react-router-dom'
import { EditTeacherForm } from './EditTeacherForm'


function Home() {
    
    const admin = useSelector(state => state.admin)
        const [current, setCurrent] = useState('teachers')

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e.key)
    }

  return (
      <div className='home-page'>
        <h1>{`Hello ${admin.username}`}</h1>
        {/* <hr/> */}
        <div className='home-containers'>
            <div id='add-buttons'>
                <h2 className='new-h2'>New</h2>
                <Button type='primary' shape='round'size='large'><Link to='/add_teacher'>New Teacher</Link></Button>
                <Button type='primary' shape='round'size='large'><Link to='/add_class'>New Class</Link></Button>
                <Button type='primary' shape='round'size='large'><Link to='/add_student'>New Student</Link></Button>
                <Button type='primary' shape='round'size='large'><Link to='/add_parent'>New Parent</Link></Button>
                <span style={{borderTop:'solid', borderStyle:'groove'}}></span>
                <Button type='primary' shape='round'size='large' style={{backgroundColor:'blueviolet'}}><Link to='/add_semester'>New Semester</Link></Button>
                <Button type='primary' shape='round'size='large' style={{backgroundColor:'darkblue'}}><Link to='/add_year'>New School Year</Link></Button>
            </div>
            <div className='home-menu'>
                <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{fontSize:'13pt', justifyContent: 'normal', fontWeight:'bold'}}>
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
            </div>
        </div>
        </div>
  )
}
export default withRouter(Home)