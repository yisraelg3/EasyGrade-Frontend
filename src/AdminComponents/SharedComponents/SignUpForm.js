import React from 'react'
import { Form, Input, Button, Row, Col, Divider } from 'antd'
import {useState} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, addTeacher } from '../AdminSlice'

function SignUpForm({className, history}) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    picture_url: '',
    title: '',
    first_name: '',
    last_name: ''
  })

  const dispatch = useDispatch()
  const headers = className === 'admins' ? 
  {"Content-type":"application/json"} : 
  {"Content-type":"application/json", "Authorization":`Bearer ${localStorage.token}`}
  const handleSubmit = () => {
    fetch(`http://localhost:3000/${className}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(responseObj => {
        // console.log(responseObj)
        if (responseObj.id || responseObj.user) {
            if (className === 'admins') {
                localStorage.token = responseObj.token
                dispatch(login(responseObj))
                history.push('/home')
            } else if (className === 'teachers') {
                dispatch(addTeacher(responseObj))
            }
        } else {
            alert(responseObj.errors)
        }
    })
  }

  const onChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      })
  }

  const handleClick = () => {
    history.push('/home')
  }

  return (
    <>
        {localStorage.token ?  <Link to='/home'> ↩︎ Back</Link> : className==='admins' ? <Link to='/'>Back to login</Link> : <h1>Add {className}</h1>}
        <Form labelCol={{ span: 24, offset: 11 }} wrapperCol= {{ span: 7, offset: 8}} onFinish={handleSubmit}>
            <Form.Item label='Username' >
                <Input name='username' id='username' value = {formData.username} placeholder='Username' onChange={onChange} />
            </Form.Item>
            <Form.Item label='Password'>
                <Input.Password name='password' id='password' value = {formData.password} placeholder='Password' onChange={onChange} />
            </Form.Item >
            <Divider />
            {className !==  'teachers' ? '' : <Form.Item label='Picture URL' >
                <Input name='picture_url' id='picture_url' value = {formData.picture_url} placeholder='picture_url' onChange={onChange} />
            </Form.Item>}
            <Form.Item label='Title' >
                <Input name='title' id='title' value = {formData.title} placeholder='Title (e.g Mr.)' onChange={onChange} />
            </Form.Item>
            <Form.Item label='First name' >
                <Input name='first_name' id='first_name' value = {formData.first_name} placeholder='First Name' onChange={onChange} />
            </Form.Item>
            <Form.Item label='Last name' >
                <Input name='last_name' id='last_name' value = {formData.last_name} placeholder='Last Name' onChange={onChange} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 11 }}>
                <Button type="primary" htmlType='submit'>{className==='admins' ? 'Sign up' : `Add ${className}`}</Button>
            </Form.Item>
            {className === 'teachers' ? <Form.Item >
                <Button type="primary" onClick={handleClick}>Close</Button>
            </Form.Item> : ''}
        </Form>
    </>
  )
}
export default withRouter(SignUpForm)