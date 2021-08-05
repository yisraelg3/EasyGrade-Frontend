import React from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { Form, Input, Button, Radio } from 'antd'
import { useState } from 'react'
import { useDispatch} from 'react-redux'
import { login } from '../AdminSlice'
import { parentLogin } from '../../TeacherComponents/ParentSlice'

function LoginForm({history}) {

  const dispatch = useDispatch()

  const [formData, setformData] = useState({
      username: '',
      password: '',
      accountType: 'Admin'
  })

  const handleChange = (e) => {
    setformData({
          ...formData,
          [e.target.name]: e.target.value
      })
  }

  const handleSubmit = () => {
    fetch(`http://localhost:3000/${formData.accountType}_login`, {
        method: 'POST',
        headers: {"Content-type":"application/json"},
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(res => {
        if (res.user) {
          console.log(res)
            localStorage.token = res.token
            if (res.user.account_type === 'Parent') {
              dispatch(parentLogin(res))
            } else {
              dispatch(login(res))
            }
            history.push('/home')
        } else {
            alert(res.errors)
        }
        
    })
  }

  return (
    <div align="center">
      {localStorage.token ? <Redirect to='/home'/> : ''}
      <h1 >Login</h1>
      <Button><Link to='/admin_signup'>{"Click here to Register new Admininstrator"}</Link></Button>
      <div className='login-form'>
      <Form  onFinish={handleSubmit}>
          <Form.Item label='Username'>
              <Input name='username' id='username' placeholder='Username' value={formData.username} onChange={handleChange}></Input>
          </Form.Item>
          <Form.Item label='Password'>
              <Input.Password name='password' id='password' placeholder='Password' value={formData.password} onChange={handleChange}></Input.Password>
          </Form.Item>
          <Form.Item>
            <span>&nbsp;I am a :&nbsp;&nbsp; </span>
            <Radio.Group name='accountType' onChange={handleChange} value={formData.accountType}>
              <Radio value='Admin'>Administrator</Radio>
              <Radio value='Teacher'>Teacher</Radio>
              <Radio value='Parent'>Parent</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType='submit'>Login</Button>
        </Form.Item>
      </Form>
      </div>
      <br/>
      

    </div>
  )
}
export default withRouter(LoginForm)
