import React from 'react'
import { Form, Input, Button } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateTeacher } from './AdminSlice'
import { Link, withRouter } from 'react-router-dom'

function EditTeacherForm({routerProps, history}) {

    const {id} = routerProps.match.params
    const state = useSelector(state => state.admin)
    const token = useSelector(state => state.admin.token)

    const dispatch = useDispatch()

    const teacher = state.teachers.find(teacher => teacher.id === parseInt(id))
    || {username: '',
    // password: '',
    picture_url: '',
    title: '',
    first_name: '',
    last_name: ''}

    const [formData, setFormData] = useState({})
    useEffect(() => { setFormData({
        username: teacher.username,
        // password: resource.password,
        picture_url: teacher.picture_url,
        title: teacher.title,
        first_name: teacher.first_name,
        last_name: teacher.last_name
      })},[teacher.first_name, teacher.last_name, teacher.picture_url, teacher.title, teacher.username])

      const handleChange = (e) => {
        //   console.log(e.target.value)
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }           

    const handleSubmit = (e) => {
        fetch(`http://localhost:3000/teachers/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-type":"application/json",
                "Authorization" : `"Bearer ${token}"`
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(updatedObj => {
            // console.log(updatedObj)
            if (updatedObj.id) {
                dispatch(updateTeacher(updatedObj))
                history.push('/home')
            } else {
                alert(updatedObj.errors)
            }
        })
    }
               
  return (
      <>
      <Link to='/home'> ↩︎ Back</Link>
      <h1>{teacher.professional_title}</h1>
    <Form labelCol={{ span: 24, offset: 11 }} wrapperCol= {{ span: 7, offset: 8}} onFinish={handleSubmit}> 
        <Form.Item label='Username' >
            <Input name='username' id='username' value={formData.username} placeholder='Username' onChange={handleChange} />
        </Form.Item>
        {/* <Form.Item label='Password'>
            <Input.Password name='password' id='password' value = {formData.password} placeholder='Password' onChange={handleChange} />
        </Form.Item > */}
        <Form.Item label='Title' >
            <Input name='title' id='title' value={formData.title} placeholder='Title' onChange={handleChange} />
        </Form.Item>
        <Form.Item label='First name' >
            <Input name='first_name' id='first_name' value={formData.first_name} placeholder='First name' onChange={handleChange} />
        </Form.Item>
        <Form.Item label='Last name' >
            <Input name='last_name' id='last_name' value={formData.last_name} placeholder='Last name' onChange={handleChange} />
        </Form.Item>
        <Form.Item label='Picture URL' >
            <Input name='picture_url' id='picture_url' value={formData.picture_url} placeholder='Picture URL' onChange={handleChange} />
        </Form.Item>
        <Form.Item >
                <Button type="primary" htmlType='submit'>Update</Button>
        </Form.Item>
    </Form>
    </>
  )
}
export default withRouter(EditTeacherForm)