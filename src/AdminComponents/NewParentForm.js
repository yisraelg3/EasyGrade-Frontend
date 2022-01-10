import React, {useState} from 'react'
import { Form, Input, Button, Select, Space } from 'antd'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addParent } from '../redux/ParentSlice'
import apiHelper from '../api'

function NewParentForm({className, history}) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    currentStudents: []
  })

  const dispatch = useDispatch()

  const students = useSelector(state => state.students) 
  const token = useSelector(state => state.user.token)

  const handleSubmit = () => {
    fetch(`${apiHelper()}/parents`, {
        method: 'POST',
        headers: {"Content-type":"application/json", "Authorization":`Bearer ${token}`},
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(responseObj => {
        console.log(responseObj)
        if (responseObj.parent) {
            dispatch(addParent(responseObj))
            setFormData({
                username: '',
                password: '',
                currentStudents: []
            })
        } else {
            alert(responseObj.errors)
        }
    })
  }

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      })
  }

  const studentsChange = (e) => {
    // debugger
    // console.log('e:',e)
    setFormData({
        ...formData,
        currentStudents: e
    })
  }

  const handleClick = () => {
    history.goBack()
  }

  const studentOptions = students.map(student => {
    // console.log(student.id)
    return <Select.Option key={student.id} value={student.id}>{`${student.first_name} ${student.last_name}`}</Select.Option>
  })

  return (
    <div align='center'>
        <h1>New Parent</h1>
        <Form labelCol={{ offset: 3, span: 5}} wrapperCol= {{ span: 9}} onFinish={handleSubmit}>
            <Form.Item label='Username' >
                <Input name='username' id='username' value = {formData.username} placeholder='Username' onChange={handleChange} />
            </Form.Item>
            <Form.Item label='Password'>
                <Input.Password name='password' id='password' value = {formData.password} placeholder='Password' onChange={handleChange} />
            </Form.Item >
            <Form.Item label='Add students' >
                <Select allowClear mode='multiple' name='students' id='students' value={formData.currentStudents} placeholder='Select students' onChange={studentsChange}>
                    {studentOptions}
                </Select>
            </Form.Item>
            <Form.Item style={{position:'relative', top:'99%', left: '30%'}}>
                <Space><Button type="primary" htmlType='submit'>Add Parent</Button><Button type="primary" onClick={handleClick}>Close</Button></Space>
            </Form.Item>
        </Form>
    </div>
  )
}
export default withRouter(NewParentForm)