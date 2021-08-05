import React from 'react'
import { Form, Input, Button, DatePicker, Select, Divider, Space } from 'antd'
import moment from 'moment'
import {useState} from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {addStudent} from './AdminSlice'

function NewStudentForm({className, history}) {

    const classes = useSelector(state => state.admin.klasses)
    const token = useSelector(state => state.admin.token)
    const year = useSelector(state => state.admin.year) 

    const classesDisplay =
        classes.length > 0 ? 
        classes.map(klass => {return {name: `${klass.grade} ${klass.subject}`, id: klass.id }}): []

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        birth_date: moment('01/01/2015', 'MM/DD/YYYY'),
        parent_id: 0,
        picture_url: '',
        currentClasses: [],
        year: year
    })

    const dispatch = useDispatch()

    const handleSubmit = () => {
        console.log(formData)
        fetch(`http://localhost:3000/students`, {
            method: 'POST',
            headers: {"Content-type":"application/json", 
            "Authorization":`Bearer ${token}`},
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(responseObj => {
            // console.log(responseObj)
            if (responseObj.student) {
                dispatch(addStudent(responseObj))
                setFormData({
                    first_name: '',
                    last_name: '',
                    birth_date: moment('01/01/2015', 'MM/DD/YYYY'),
                    parent_id: 0,
                    picture_url: '',
                    currentClasses: [],
                    year: year
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

    const dateChange = (moment, string) =>{
        setFormData({
            ...formData,
            birth_date: moment
        })
    }

    const classChange = (e) => {
        // console.log(e)
        setFormData({
            ...formData,
            currentClasses: e
        })
    }

    const handleClick = () => {
        history.push('/home')
      }

    const customFormat = value => value.format('MM/DD/YYYY')
    
    const options = classesDisplay.map(klass => <Select.Option key={klass.id} value={klass.id}>{klass.name}</Select.Option>)

  return (
      <div align='center'>
          <br/>
      <h1>New Student</h1>
      <br/>
      <Form labelCol={{ offset: 2, span: 5}} wrapperCol= {{ span: 9}} onFinish={handleSubmit}>
            <Form.Item label='First name' >
                <Input name='first_name' id='first_name' value = {formData.first_name} placeholder='First Name' onChange={handleChange} />
            </Form.Item>
            <Form.Item label='Last name' >
                <Input name='last_name' id='last_name' value = {formData.last_name} placeholder='Last Name' onChange={handleChange} />
            </Form.Item>
            <Divider/>
            <Form.Item label='Classes' >
                <Select allowClear mode='multiple' name='classes' id='classes' value={formData.currentClasses} placeholder='Select classes' onChange={classChange}>
                {options}
                </Select>
            </Form.Item>
            {/* <Form.Item label='Picture URL' >
                <Input name='picture_url' id='picture_url' value = {formData.picture_url} placeholder='picture_url' onChange={handleChange} />
            </Form.Item>
            <Form.Item label='Birth Date'>
                <DatePicker name='birth_date' id='birth_date' value={formData.birth_date} onChange={dateChange} format={customFormat}/>
            </Form.Item> */}
            <Form.Item style={{position:'relative', top:'99%', left: '28%'}}>
                <Space><Button type="primary" htmlType='submit'>Add Student</Button><Button type="primary" onClick={handleClick}>Close</Button></Space>
            </Form.Item>
        </Form>
        </div>
  )
}
export default withRouter(NewStudentForm)