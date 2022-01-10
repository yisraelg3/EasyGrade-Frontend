import React, {useState} from 'react'
import { Form, Input, Button, Divider } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../redux/LoginSlice'
import apiHelper from '../api'

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
  const handleSubmit = () => {
    fetch(`${apiHelper()}/admins`, {
        method: 'POST',
        headers: {"Content-type":"application/json"},
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(responseObj => {
        console.log(responseObj)
        if (responseObj.id || responseObj.user) {
            localStorage.token = responseObj.token
            dispatch(login(responseObj))
            history.push('/home')
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

  return (
    <div align="center">
        <h1>New Administrator</h1>
        <Button><Link to='/'>Click here to return to Login</Link></Button>
        <br/> <br/>
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
             <Form.Item style={{position:'relative', top:'99%', left: '30%'}}>
                <Button type="primary" htmlType='submit'>Sign up</Button>
            </Form.Item>
        </Form>
    </div>
  )
}
export default withRouter(SignUpForm)