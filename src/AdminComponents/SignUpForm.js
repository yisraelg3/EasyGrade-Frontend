import React, {useState} from 'react'
import { Form, Input, Button, Divider, Space } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addTeacher } from '../redux/TeacherSlice'
import { login } from '../redux/LoginSlice'

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
        console.log(responseObj)
        if (responseObj.id || responseObj.user) {
            if (className === 'admins') {
                localStorage.token = responseObj.token
                dispatch(login(responseObj))
                history.push('/home')
            } else if (className === 'teachers') {
                console.log(responseObj)
                dispatch(addTeacher(responseObj))
                setFormData({
                    username: '',
                    password: '',
                    picture_url: '',
                    title: '',
                    first_name: '',
                    last_name: ''
                })
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
    history.goBack()
  }

  return (
    <div align="center">
        {localStorage.token ?  <h1>New Teacher</h1> :<> <h1>New Administrator</h1>
        <Button><Link to='/'>{"Click here to return to Login"}</Link></Button>
        <br/><br/></>}
        <Form labelCol={{offset: 2, span: 5 }} wrapperCol= {{ span: 9}} onFinish={handleSubmit}>
            <Form.Item label='Username' >
                <Input name='username' id='username' value = {formData.username} placeholder='Username' onChange={onChange} />
            </Form.Item>
            <Form.Item label='Password'>
                <Input.Password name='password' id='password' value = {formData.password} placeholder='Password' onChange={onChange} />
            </Form.Item >
            <Divider />
            <Form.Item label='Title' >
                <Input name='title' id='title' value = {formData.title} placeholder='Title (e.g Mr.)' onChange={onChange} />
            </Form.Item>
            <Form.Item label='First name' >
                <Input name='first_name' id='first_name' value = {formData.first_name} placeholder='First Name' onChange={onChange} />
            </Form.Item>
            <Form.Item label='Last name' >
                <Input name='last_name' id='last_name' value = {formData.last_name} placeholder='Last Name' onChange={onChange} />
            </Form.Item>
            {/* {className !==  'teachers' ? '' : <Form.Item label='Picture URL' >
                <Input name='picture_url' id='picture_url' value = {formData.picture_url} placeholder='picture_url' onChange={onChange} />
            </Form.Item >} */}
            {className === 'teachers' ? <Form.Item style={{position:'relative', top:'99%', left:'28%'}}>
                <Space size='middle'><Button type="primary" htmlType='submit'>Add Teacher</Button> <Button type="primary" onClick={handleClick}>Close</Button></Space>
            </Form.Item>
            :
             <Form.Item style={{position:'relative', top:'99%', left: '30%'}}>
                <Button type="primary" htmlType='submit'>Sign up</Button>
            </Form.Item>}
        </Form>
    </div>
  )
}
export default withRouter(SignUpForm)