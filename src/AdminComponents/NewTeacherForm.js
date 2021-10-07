import React, {useState} from 'react'
import { Form, Input, Button, Divider, Space } from 'antd'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addTeacher } from '../redux/TeacherSlice'

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
    fetch(`https://easygrade-backend.herokuapp.com/teachers`, {
        method: 'POST',
        headers: {"Content-type":"application/json", 
        "Authorization":`Bearer ${localStorage.token}`},
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(responseObj => {
        console.log(responseObj)
        if (responseObj.id || responseObj.user) {
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
        <br/><h1>New Teacher</h1><br/>
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
            {/* <Form.Item label='Picture URL' >
                <Input name='picture_url' id='picture_url' value = {formData.picture_url} placeholder='picture_url' onChange={onChange} />
            </Form.Item >*/}
            <Form.Item style={{position:'relative', top:'99%', left:'28%'}}>
                <Space size='middle'><Button type="primary" htmlType='submit'>Add Teacher</Button> <Button type="primary" onClick={handleClick}>Close</Button></Space>
            </Form.Item>
        </Form>
    </div>
  )
}
export default withRouter(SignUpForm)